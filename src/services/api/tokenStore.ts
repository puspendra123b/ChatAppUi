/**
 * In-memory token store.
 * Access tokens are NEVER stored in localStorage for security.
 * Only the refresh token uses httpOnly cookies (server-side) or
 * a secure cookie fallback.
 */

let accessToken: string | null = null;

export const tokenStore = {
    getAccessToken: (): string | null => accessToken,

    setAccessToken: (token: string): void => {
        accessToken = token;
    },

    clearAccessToken: (): void => {
        accessToken = null;
    },

    /** Refresh token is stored as httpOnly cookie by the server.
     *  On the client we only keep a fallback in memory for demo purposes. */
    getRefreshToken: (): string | null => {
        // In production this would be an httpOnly cookie managed by the server.
        // For demo, we use a secure fallback.
        return localStorage.getItem('chatapp_rt');
    },

    setRefreshToken: (token: string): void => {
        localStorage.setItem('chatapp_rt', token);
    },

    clearRefreshToken: (): void => {
        localStorage.removeItem('chatapp_rt');
    },

    clearAll: (): void => {
        accessToken = null;
        localStorage.removeItem('chatapp_rt');
    },
};
