import { config } from '@/config';
import { tokenStore } from '@/services/api/tokenStore';

type EventCallback = (payload: unknown) => void;

/**
 * Centralised WebSocket service matching the backend protocol:
 *   Outbound: { type: "SEND_DIRECT_MESSAGE" | "PING", payload: {...} }
 *   Inbound:  { type: "MESSAGE_SENT_ACK" | "NEW_DIRECT_MESSAGE" | "PONG", payload: {...} }
 */
class WebSocketService {
    private ws: WebSocket | null = null;
    private listeners: Map<string, Set<EventCallback>> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 10;
    private baseReconnectDelay = 1000;
    private maxReconnectDelay = 30000;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    private isIntentionallyClosed = false;

    connect(): void {
        const token = tokenStore.getAccessToken();
        if (!token) {
            console.warn('[WS] No access token, cannot connect');
            return;
        }
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.info('[WS] Already connected');
            return;
        }

        this.isIntentionallyClosed = false;
        const url = `${config.ws.url}?token=${encodeURIComponent(token)}`;

        try {
            this.ws = new WebSocket(url);
            this.setupHandlers();
        } catch (error) {
            console.error('[WS] Connection error:', error);
            this.scheduleReconnect();
        }
    }

    private setupHandlers(): void {
        if (!this.ws) return;

        this.ws.onopen = () => {
            console.info('[WS] Connected');
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        };

        this.ws.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data as string) as { type: string; payload?: unknown };
                if (data.type === 'PONG') return; // heartbeat response, ignore
                this.emit(data.type, data.payload);
            } catch (error) {
                console.error('[WS] Parse error:', error);
            }
        };

        this.ws.onclose = (event: CloseEvent) => {
            console.info(`[WS] Disconnected (code: ${event.code})`);
            this.stopHeartbeat();
            if (!this.isIntentionallyClosed) this.scheduleReconnect();
        };

        this.ws.onerror = (error: Event) => {
            console.error('[WS] Error:', error);
        };
    }

    private scheduleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[WS] Max reconnect attempts reached');
            return;
        }
        const delay = Math.min(
            this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
            this.maxReconnectDelay,
        );
        console.info(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }

    private startHeartbeat(): void {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'PING' }));
            }
        }, 30000);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    /** Send a typed event matching backend wsRouter format */
    send<T>(type: string, payload: T): void {
        if (this.ws?.readyState !== WebSocket.OPEN) {
            console.warn('[WS] Cannot send — not connected');
            return;
        }
        this.ws.send(JSON.stringify({ type, payload }));
    }

    /** Subscribe to an event type */
    on(type: string, callback: EventCallback): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)!.add(callback);
        return () => { this.listeners.get(type)?.delete(callback); };
    }

    private emit(type: string, payload: unknown): void {
        this.listeners.get(type)?.forEach((cb) => {
            try { cb(payload); } catch (e) { console.error(`[WS] Listener error (${type}):`, e); }
        });
    }

    disconnect(): void {
        this.isIntentionallyClosed = true;
        this.stopHeartbeat();
        if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
        if (this.ws) { this.ws.close(1000, 'Client disconnect'); this.ws = null; }
        this.reconnectAttempts = 0;
    }

    get isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

export const wsService = new WebSocketService();
