/** Centralized environment-based configuration */
export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    },
    ws: {
        // WebSocket connects directly to backend (WSS attached to root of HTTP server)
        url: import.meta.env.VITE_WS_URL || 'ws://chatappapi-86qe.onrender.com',
    },
    app: {
        name: import.meta.env.VITE_APP_NAME || 'ChatApp',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    },
    auth: {
        refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'chatapp_refresh_token',
    },
} as const;
