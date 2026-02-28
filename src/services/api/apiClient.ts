import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { tokenStore } from './tokenStore';
import type { ApiError } from '@/types';

/** Extended config to track retry attempts */
interface RetryableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

/**
 * Centralized Axios instance with:
 * - Base URL from env config
 * - Request interceptor: attaches access token
 * - Response interceptor: handles 401 → refresh token flow
 * - Global error normalisation
 */
const apiClient = axios.create({
    baseURL: config.api.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// ─── Request Interceptor ─────────────────────────────────────
apiClient.interceptors.request.use(
    (reqConfig) => {
        const token = tokenStore.getAccessToken();
        if (token && reqConfig.headers) {
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
    },
    (error) => Promise.reject(error),
);

// ─── Response Interceptor ────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });
    failedQueue = [];
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as RetryableConfig | undefined;

        // Only attempt refresh on 401, and only once per request
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request until refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(apiClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = tokenStore.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const { data } = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
                    refreshToken,
                });

                const newAccessToken = data.tokens.accessToken as string;
                tokenStore.setAccessToken(newAccessToken);

                if (data.tokens.refreshToken) {
                    tokenStore.setRefreshToken(data.tokens.refreshToken as string);
                }

                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStore.clearAll();
                // Redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Normalise error shape
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
            statusCode: error.response?.status || 500,
            errors: error.response?.data?.errors,
        };

        return Promise.reject(apiError);
    },
);

export default apiClient;
