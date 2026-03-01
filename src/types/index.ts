// ─── User Types (matches backend User model) ────────────────
export interface User {
    _id: string;
    userId: string;       // auto-generated numeric ID
    email: string;
    avatar?: string | null;
    bio?: string;
    isOnline: boolean;
    lastSeen?: string | null;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ─── Auth Types ──────────────────────────────────────────────
export interface LoginCredentials {
    username: string;     // can be email or userId
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    otpToken: string;     // verification token from OTP flow
}

export interface SendOtpPayload {
    email: string;
    purpose: 'signup' | 'login';
}

export interface VerifyOtpPayload {
    email: string;
    code: string;
    purpose: 'signup' | 'login';
}

/** Shape: { success, message, data: { accessToken, refreshToken } } */
export interface ApiAuthResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user?: User;
    };
}

/** Shape: { success, message, data: { email, userId } } */
export interface ApiSignupResponse {
    success: boolean;
    message: string;
    data: {
        email: string;
        userId: string;
    };
}

// ─── Chat Types (matches backend Chat model) ─────────────────
export interface Chat {
    _id: string;
    type: 'direct' | 'group';
    members: User[];       // populated
    createdBy: string;
    lastMessage?: Message | null;
    name?: string | null;
    avatar?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// ─── Message Types (matches backend Message model) ───────────
export interface Message {
    _id: string;
    chatId: string;
    senderId: string | { _id: string; email: string; userId: string; avatar?: string };
    content: string;
    type: 'text' | 'image' | 'file' | 'video';
    mediaUrl?: string | null;
    readBy: string[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// ─── WebSocket Event Types ───────────────────────────────────
// Matches backend wsRouter.js event types
export type WSOutboundType = 'SEND_DIRECT_MESSAGE' | 'PING';

export type WSInboundType =
    | 'MESSAGE_SENT_ACK'
    | 'NEW_DIRECT_MESSAGE'
    | 'PONG'
    | 'TYPING_START'
    | 'TYPING_STOP';

export interface WSSendDirectPayload {
    chatId: string;
    content: string;
    clientMessageId: string;
}

export interface WSMessageAck {
    clientMessageId: string;
    messageId: string;
    createdAt: string;
}

// ─── API Wrapper Types ───────────────────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}
