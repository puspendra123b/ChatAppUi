import { create } from 'zustand';
import type { Chat, Message, User, ApiResponse, WSSendDirectPayload, WSMessageAck } from '@/types';
import { apiClient } from '@/services/api';
import { wsService } from '@/services/websocket';

interface ChatState {
    // State
    chats: Chat[];
    activeChatId: string | null;
    messages: Record<string, Message[]>;       // chatId -> messages
    searchResults: User[];
    onlineUsers: Set<string>;                  // set of online user IDs
    typingUsers: Record<string, string | null>; // chatId -> typing userId (null = not typing)
    isLoadingChats: boolean;
    isLoadingMessages: boolean;
    isSearching: boolean;
    searchQuery: string;

    // Derived
    activeChat: () => Chat | undefined;
    getOtherUser: (chat: Chat, myId: string) => User | undefined;
    isUserOnline: (userId: string) => boolean;
    isChatTyping: (chatId: string) => boolean;

    // Actions
    setActiveChat: (chatId: string | null) => void;
    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>;
    searchUsers: (query: string) => Promise<void>;
    clearSearch: () => void;
    initiateChat: (receiverUserId: string) => Promise<string>;
    sendMessage: (chatId: string, content: string) => void;
    sendTyping: (chatId: string, isTyping: boolean) => void;
    addIncomingMessage: (message: Message) => void;
    handleMessageAck: (ack: WSMessageAck) => void;
    initWSListeners: () => () => void;
    setSearchQuery: (query: string) => void;
}

/** Generate a unique client message ID for idempotent sends */
function generateClientMsgId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
    chats: [],
    activeChatId: null,
    messages: {},
    searchResults: [],
    onlineUsers: new Set<string>(),
    typingUsers: {},
    isLoadingChats: false,
    isLoadingMessages: false,
    isSearching: false,
    searchQuery: '',

    // ── Derived helpers ─────────────────────────────────
    activeChat: () => {
        const { chats, activeChatId } = get();
        return chats.find((c) => c._id === activeChatId);
    },

    getOtherUser: (chat, myId) => {
        return chat.members.find((m) => m._id !== myId);
    },

    isUserOnline: (userId) => {
        return get().onlineUsers.has(userId);
    },

    isChatTyping: (chatId) => {
        return get().typingUsers[chatId] != null;
    },

    // ── Actions ─────────────────────────────────────────
    setActiveChat: (chatId) => {
        set({ activeChatId: chatId });
        if (chatId && !get().messages[chatId]) {
            get().fetchMessages(chatId);
        }
    },

    fetchChats: async () => {
        set({ isLoadingChats: true });
        try {
            const { data: res } = await apiClient.get<ApiResponse<Chat[]>>('/chat/list');

            // Build initial onlineUsers set from chat members
            const online = new Set<string>(get().onlineUsers);
            for (const chat of res.data) {
                for (const member of chat.members) {
                    if (member.isOnline) {
                        online.add(member._id);
                    }
                }
            }

            set({ chats: res.data, isLoadingChats: false, onlineUsers: online });
        } catch {
            set({ isLoadingChats: false });
        }
    },

    fetchMessages: async (chatId) => {
        set({ isLoadingMessages: true });
        try {
            const { data: res } = await apiClient.get<ApiResponse<Message[]>>(`/chat/${chatId}/messages`);
            set((state) => ({
                messages: { ...state.messages, [chatId]: res.data },
                isLoadingMessages: false,
            }));
        } catch {
            set({ isLoadingMessages: false });
        }
    },

    searchUsers: async (query) => {
        if (query.trim().length < 2) {
            set({ searchResults: [], isSearching: false });
            return;
        }
        set({ isSearching: true });
        try {
            const { data: res } = await apiClient.get<ApiResponse<User[]>>(`/user/search?q=${encodeURIComponent(query)}`);
            set({ searchResults: res.data, isSearching: false });
        } catch {
            set({ isSearching: false });
        }
    },

    clearSearch: () => set({ searchResults: [], searchQuery: '' }),

    initiateChat: async (receiverUserId) => {
        try {
            const { data: res } = await apiClient.post<ApiResponse<Chat | { chatId: string }>>('/chat/initiate', {
                receiverUserId,
                chatType: 'direct',
            });

            const chatId = '_id' in res.data ? res.data._id : (res.data as { chatId: string }).chatId;
            await get().fetchChats();
            set({ activeChatId: chatId });
            return chatId;
        } catch {
            throw new Error('Failed to start conversation');
        }
    },

    sendMessage: (chatId, content) => {
        const clientMessageId = generateClientMsgId();

        const tempMessage: Message = {
            _id: clientMessageId,
            chatId,
            senderId: 'self',
            content,
            type: 'text',
            readBy: [],
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        set((state) => ({
            messages: {
                ...state.messages,
                [chatId]: [...(state.messages[chatId] || []), tempMessage],
            },
        }));

        const payload: WSSendDirectPayload = { chatId, content, clientMessageId };
        wsService.send('SEND_DIRECT_MESSAGE', payload);
    },

    sendTyping: (chatId, isTyping) => {
        wsService.send(isTyping ? 'TYPING_START' : 'TYPING_STOP', { chatId });
    },

    addIncomingMessage: (message) => {
        const chatId = message.chatId;
        set((state) => {
            const existing = state.messages[chatId] || [];
            if (existing.some((m) => m._id === message._id)) return state;

            return {
                messages: {
                    ...state.messages,
                    [chatId]: [...existing, message],
                },
            };
        });

        // Update lastMessage on the chat
        set((state) => ({
            chats: state.chats.map((c) =>
                c._id === chatId ? { ...c, lastMessage: message, updatedAt: message.createdAt } : c,
            ),
        }));

        // Clear typing indicator when a message arrives for that chat
        set((state) => {
            const updated = { ...state.typingUsers };
            delete updated[chatId];
            return { typingUsers: updated };
        });
    },

    handleMessageAck: (ack) => {
        set((state) => {
            const updated = { ...state.messages };
            for (const chatId in updated) {
                updated[chatId] = updated[chatId].map((msg) =>
                    msg._id === ack.clientMessageId
                        ? { ...msg, _id: ack.messageId, createdAt: ack.createdAt }
                        : msg,
                );
            }
            return { messages: updated };
        });
    },

    setSearchQuery: (query) => set({ searchQuery: query }),

    /** Initialise WebSocket event listeners. Returns cleanup function. */
    initWSListeners: () => {
        const unsubs: Array<() => void> = [];

        // ── Incoming message from other user ──────────────
        unsubs.push(
            wsService.on('NEW_DIRECT_MESSAGE', (payload) => {
                get().addIncomingMessage(payload as Message);
            }),
        );

        // ── ACK for our sent message ──────────────────────
        unsubs.push(
            wsService.on('MESSAGE_SENT_ACK', (payload) => {
                get().handleMessageAck(payload as WSMessageAck);
            }),
        );

        // ── Presence: user came online ────────────────────
        unsubs.push(
            wsService.on('USER_ONLINE', (payload) => {
                const { userId } = payload as { userId: string };
                set((state) => {
                    const newOnline = new Set(state.onlineUsers);
                    newOnline.add(userId);

                    // Also update the member's isOnline in chats
                    const updatedChats = state.chats.map((chat) => ({
                        ...chat,
                        members: chat.members.map((m) =>
                            m._id === userId ? { ...m, isOnline: true, lastSeen: null } : m,
                        ),
                    }));

                    return { onlineUsers: newOnline, chats: updatedChats };
                });
            }),
        );

        // ── Presence: user went offline ───────────────────
        unsubs.push(
            wsService.on('USER_OFFLINE', (payload) => {
                const { userId, lastSeen } = payload as { userId: string; lastSeen: string };
                set((state) => {
                    const newOnline = new Set(state.onlineUsers);
                    newOnline.delete(userId);

                    const updatedChats = state.chats.map((chat) => ({
                        ...chat,
                        members: chat.members.map((m) =>
                            m._id === userId ? { ...m, isOnline: false, lastSeen: lastSeen || new Date().toISOString() } : m,
                        ),
                    }));

                    return { onlineUsers: newOnline, chats: updatedChats };
                });
            }),
        );

        // ── Typing: someone started typing ────────────────
        unsubs.push(
            wsService.on('TYPING_START', (payload) => {
                const { chatId, userId } = payload as { chatId: string; userId: string };
                set((state) => ({
                    typingUsers: { ...state.typingUsers, [chatId]: userId },
                }));

                // Auto-clear typing after 5 seconds (safety net)
                setTimeout(() => {
                    set((state) => {
                        if (state.typingUsers[chatId] === userId) {
                            const updated = { ...state.typingUsers };
                            delete updated[chatId];
                            return { typingUsers: updated };
                        }
                        return state;
                    });
                }, 5000);
            }),
        );

        // ── Typing: someone stopped typing ────────────────
        unsubs.push(
            wsService.on('TYPING_STOP', (payload) => {
                const { chatId } = payload as { chatId: string };
                set((state) => {
                    const updated = { ...state.typingUsers };
                    delete updated[chatId];
                    return { typingUsers: updated };
                });
            }),
        );

        return () => unsubs.forEach((unsub) => unsub());
    },
}));
