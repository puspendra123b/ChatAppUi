import { create } from 'zustand';
import type { User, LoginCredentials, RegisterCredentials, ApiResponse } from '@/types';
import { apiClient, tokenStore } from '@/services/api';
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

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const { data: res } = await apiClient.post<ApiResponse<AuthTokensResponse>>('/auth/login', credentials);
            tokenStore.setAccessToken(res.data.accessToken);
            tokenStore.setRefreshToken(res.data.refreshToken);

            // Fetch full user profile after login
            let user: User | null = null;
            try {
                const { data: meRes } = await apiClient.get<ApiResponse<{ user: User }>>('/user/me');
                user = meRes.data.user;
            } catch {
                // Fallback user from credentials
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

    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            // Signup endpoint: POST /api/auth/signup → { data: { email, userId } }
            await apiClient.post<ApiResponse<{ email: string; userId: string }>>('/auth/signup', credentials);

            // After signup, auto-login
            const { data: loginRes } = await apiClient.post<ApiResponse<AuthTokensResponse>>('/auth/login', {
                username: credentials.email,
                password: credentials.password,
            });
            tokenStore.setAccessToken(loginRes.data.accessToken);
            tokenStore.setRefreshToken(loginRes.data.refreshToken);

            let user: User | null = null;
            try {
                const { data: meRes } = await apiClient.get<ApiResponse<{ user: User }>>('/user/me');
                user = meRes.data.user;
            } catch {
                user = {
                    _id: 'self',
                    userId: '',
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

    logout: () => {
        wsService.disconnect();
        tokenStore.clearAll();
        set({ user: null, isAuthenticated: false, error: null });
    },

    initialise: async () => {
        const refreshToken = tokenStore.getRefreshToken();
        if (!refreshToken) {
            set({ isInitialising: false });
            return;
        }

        try {
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
