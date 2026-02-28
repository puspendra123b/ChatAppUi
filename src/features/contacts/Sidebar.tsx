import { useEffect, useMemo, useCallback } from 'react';
import { useChatStore, useAuthStore } from '@/store';
import { Avatar, Input, ConversationSkeleton } from '@/components/ui';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, LogOut, MessageCircle, Users, UserPlus } from 'lucide-react';
import { truncate, formatMessageTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Chat, User } from '@/types';

interface SidebarProps {
    onConversationSelect?: () => void;
}

export function Sidebar({ onConversationSelect }: SidebarProps) {
    const authUser = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const {
        chats,
        activeChatId,
        searchQuery,
        searchResults,
        typingUsers,
        isLoadingChats,
        isSearching,
        setActiveChat,
        setSearchQuery,
        searchUsers,
        clearSearch,
        fetchChats,
        initiateChat,
        isUserOnline,
    } = useChatStore();

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    // Debounced search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                searchUsers(searchQuery);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery, searchUsers]);

    // Filter chats by search
    const filteredChats = useMemo(() => {
        if (!searchQuery.trim()) return chats;
        const query = searchQuery.toLowerCase();
        return chats.filter((chat) =>
            chat.members.some(
                (m) =>
                    m._id !== authUser?._id &&
                    m.email.toLowerCase().includes(query),
            ),
        );
    }, [chats, searchQuery, authUser]);

    const getOtherUser = useCallback(
        (chat: Chat): User | undefined =>
            chat.members.find((m) => m._id !== authUser?._id),
        [authUser],
    );

    const getLastMessagePreview = (chat: Chat): { text: string; isTyping: boolean } => {
        // Show typing indicator instead of last message
        if (typingUsers[chat._id]) {
            return { text: 'typing...', isTyping: true };
        }
        if (!chat.lastMessage) return { text: 'Start a conversation', isTyping: false };
        return { text: truncate(chat.lastMessage.content, 35), isTyping: false };
    };

    const handleChatClick = (chatId: string) => {
        setActiveChat(chatId);
        clearSearch();
        onConversationSelect?.();
    };

    const handleUserClick = async (userId: string) => {
        try {
            await initiateChat(userId);
            clearSearch();
            onConversationSelect?.();
        } catch (err) {
            console.error('Failed to initiate chat:', err);
        }
    };

    const showSearchResults = searchQuery.trim().length >= 2;

    return (
        <div className="flex h-full flex-col bg-slate-900/50 border-r border-white/[0.06]">
            {/* ── Header ─────────────────────────────────────── */}
            <div className="shrink-0 border-b border-white/[0.06] bg-slate-900/80 backdrop-blur-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={authUser?.avatar || undefined}
                            fallback={authUser?.email || 'Me'}
                            size="md"
                            isOnline={true}
                        />
                        <div className="min-w-0">
                            <h1 className="text-sm font-semibold text-white truncate">
                                {authUser?.email || 'User'}
                            </h1>
                            <p className="text-xs text-emerald-400">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>

                <Input
                    type="text"
                    placeholder="Search users by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="h-4 w-4" />}
                    className="h-9 text-xs rounded-lg"
                />
            </div>

            {/* ── Main scrollable area ──────────────────────── */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">

                {/* Search Results */}
                {showSearchResults && (
                    <div className="px-3 pt-3 pb-1">
                        <div className="flex items-center gap-2 px-1 mb-2">
                            <UserPlus className="h-3.5 w-3.5 text-white/30" />
                            <h2 className="text-[0.65rem] font-semibold text-white/30 uppercase tracking-wider">
                                Search Results
                            </h2>
                        </div>

                        {isSearching ? (
                            <div className="space-y-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                                        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                                        <div className="flex-1 space-y-1.5">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : searchResults.length === 0 ? (
                            <p className="px-3 py-4 text-center text-xs text-white/20">
                                No users found
                            </p>
                        ) : (
                            <div className="space-y-0.5">
                                {searchResults.map((user) => (
                                    <button
                                        key={user._id}
                                        onClick={() => handleUserClick(user._id)}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent transition-all duration-150"
                                    >
                                        <Avatar
                                            src={user.avatar || undefined}
                                            fallback={user.email}
                                            size="md"
                                            isOnline={user.isOnline}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm font-medium text-white truncate block">
                                                {user.email}
                                            </span>
                                            <span className="text-xs text-white/30">
                                                ID: {user.userId} • {user.isOnline ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                        <UserPlus className="h-4 w-4 text-emerald-400/60 shrink-0" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Conversations List */}
                <div className="px-3 pt-3 pb-3">
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <MessageCircle className="h-3.5 w-3.5 text-white/30" />
                        <h2 className="text-[0.65rem] font-semibold text-white/30 uppercase tracking-wider">
                            Conversations
                        </h2>
                    </div>

                    {isLoadingChats ? (
                        <div className="space-y-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <ConversationSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <p className="px-3 py-6 text-center text-xs text-white/20">
                            {searchQuery ? 'No matching conversations' : 'No conversations yet. Search for a user to start chatting!'}
                        </p>
                    ) : (
                        <div className="space-y-0.5">
                            {filteredChats.map((chat) => {
                                const other = getOtherUser(chat);
                                const isActive = chat._id === activeChatId;

                                return (
                                    <button
                                        key={chat._id}
                                        onClick={() => handleChatClick(chat._id)}
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150',
                                            isActive
                                                ? 'bg-emerald-600/15 border border-emerald-500/20'
                                                : 'hover:bg-white/5 border border-transparent',
                                        )}
                                    >
                                        <Avatar
                                            src={other?.avatar || undefined}
                                            fallback={other?.email || 'User'}
                                            size="lg"
                                            isOnline={other ? isUserOnline(other._id) || other.isOnline : false}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-white truncate">
                                                    {other?.email || 'Unknown'}
                                                </span>
                                                {chat.lastMessage && (
                                                    <span className="text-[0.65rem] text-white/30 shrink-0 ml-2">
                                                        {formatMessageTime(chat.lastMessage.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                {(() => {
                                                    const preview = getLastMessagePreview(chat);
                                                    return (
                                                        <span className={cn(
                                                            'text-xs truncate',
                                                            preview.isTyping ? 'text-emerald-400 font-medium' : 'text-white/40',
                                                        )}>
                                                            {preview.text}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
