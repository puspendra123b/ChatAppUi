import { create } from 'zustand';
import axios from 'axios';
import type {
    User,
    LoginCredentials,
    RegisterCredentials,
    SendOtpPayload,
    VerifyOtpPayload,
    ApiResponse,
} from '@/types';
import { apiClient, tokenStore } from '@/services/api';
import { config } from '@/config';
import { wsService } from '@/services/websocket';

interface AuthTokensResponse {
    accessToken: string;
    refreshToken: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialising: boolean;
    error: string | null;

    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    sendOtp: (payload: SendOtpPayload) => Promise<void>;
    verifyOtp: (payload: VerifyOtpPayload) => Promise<{ otpToken?: string }>;
    loginWithOtp: (payload: VerifyOtpPayload) => Promise<void>;
    logout: () => void;
    initialise: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialising: true,
    error: null,

    // ── Password Login ──────────────────────────────────────
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { data: res } = await apiClient.post<ApiResponse<AuthTokensResponse>>('/auth/login', credentials);
            tokenStore.setAccessToken(res.data.accessToken);
            tokenStore.setRefreshToken(res.data.refreshToken);

            let user: User | null = null;
            try {
                const { data: meRes } = await apiClient.get<ApiResponse<{ user: User }>>('/user/me');
                user = meRes.data.user;
            } catch {
                user = {
                    _id: 'self',
                    userId: '',
                    email: credentials.username,
                    isOnline: true,
                };
            }

            set({ user, isAuthenticated: true, isLoading: false });
            wsService.connect();
        } catch (err: unknown) {
            const message =
                err && typeof err === 'object' && 'message' in err
                    ? (err as { message: string }).message
                    : 'Login failed';
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    // ── Send OTP ────────────────────────────────────────────
    sendOtp: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.post<ApiResponse<{ email: string }>>('/auth/send-otp', payload);
            set({ isLoading: false });
        } catch (err: unknown) {
            const message =
                err && typeof err === 'object' && 'message' in err
                    ? (err as { message: string }).message
                    : 'Failed to send OTP';
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    // ── Verify OTP (for signup — returns otpToken) ──────────
    verifyOtp: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { data: res } = await apiClient.post<ApiResponse<{ email: string; otpToken: string }>>('/auth/verify-otp', payload);
            set({ isLoading: false });
            return { otpToken: res.data.otpToken };
        } catch (err: unknown) {
            const message =
                err && typeof err === 'object' && 'message' in err
                    ? (err as { message: string }).message
                    : 'OTP verification failed';
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    // ── Login with OTP (verify OTP → get tokens) ────────────
    loginWithOtp: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { data: res } = await apiClient.post<ApiResponse<AuthTokensResponse>>('/auth/verify-otp', payload);
            tokenStore.setAccessToken(res.data.accessToken);
            tokenStore.setRefreshToken(res.data.refreshToken);

            let user: User | null = null;
            try {
                const { data: meRes } = await apiClient.get<ApiResponse<{ user: User }>>('/user/me');
                user = meRes.data.user;
            } catch {
                user = {
                    _id: 'self',
                    userId: '',
                    email: payload.email,
                    isOnline: true,
                };
            }

            set({ user, isAuthenticated: true, isLoading: false });
            wsService.connect();
        } catch (err: unknown) {
            const message =
                err && typeof err === 'object' && 'message' in err
                    ? (err as { message: string }).message
                    : 'OTP login failed';
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    // ── Register (with OTP token) ───────────────────────────
    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { data: res } = await apiClient.post<ApiResponse<AuthTokensResponse & { email: string; userId: string }>>('/auth/signup', credentials);
            tokenStore.setAccessToken(res.data.accessToken);
            tokenStore.setRefreshToken(res.data.refreshToken);

            let user: User | null = null;
            try {
                const { data: meRes } = await apiClient.get<ApiResponse<{ user: User }>>('/user/me');
                user = meRes.data.user;
            } catch {
                user = {
                    _id: 'self',
                    userId: res.data.userId || '',
                    email: credentials.email,
                    isOnline: true,
                };
            }

            set({ user, isAuthenticated: true, isLoading: false });
            wsService.connect();
        } catch (err: unknown) {
            const message =
                err && typeof err === 'object' && 'message' in err
                    ? (err as { message: string }).message
                    : 'Registration failed';
            set({ error: message, isLoading: false });
            throw err;
        }
    },

    // ── Logout ──────────────────────────────────────────────
    logout: () => {
        wsService.disconnect();
        tokenStore.clearAll();
        set({ user: null, isAuthenticated: false, error: null });
    },

    // ── Initialise (sticky session via refresh token) ───────
    initialise: async () => {
        const refreshToken = tokenStore.getRefreshToken();
        if (!refreshToken) {
            set({ isInitialising: false });
            return;
        }

        try {
            const { data: refreshRes } = await axios.post(
                `${config.api.baseUrl}/auth/refresh`,
                { refreshToken },
            );

            const newAccessToken = refreshRes.data.accessToken as string;
            const newRefreshToken = refreshRes.data.refreshToken as string;

            tokenStore.setAccessToken(newAccessToken);
            tokenStore.setRefreshToken(newRefreshToken);

            const { data: meRes } = await apiClient.get<ApiResponse<{ user: User }>>('/user/me');
            set({ user: meRes.data.user, isAuthenticated: true, isInitialising: false });
            wsService.connect();
        } catch {
            tokenStore.clearAll();
            set({ isInitialising: false });
        }
    },

    clearError: () => set({ error: null }),
}));
