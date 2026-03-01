import { useEffect, useMemo, useCallback } from 'react';
import { useChatStore, useAuthStore } from '@/store';
import { Avatar, Input, ConversationSkeleton } from '@/components/ui';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemePicker } from '@/components/ThemePicker';
import { Search, LogOut, MessageCircle, UserPlus, Sparkles } from 'lucide-react';
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                searchUsers(searchQuery);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery, searchUsers]);

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
        if (typingUsers[chat._id]) {
            return { text: 'typing...', isTyping: true };
        }
        if (!chat.lastMessage) return { text: 'Say hi! 👋', isTyping: false };
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
        <div className="flex h-full flex-col"
            style={{
                backgroundColor: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-subtle)',
            }}
        >
            {/* ── Header ─────────────────────────────────────── */}
            <div className="shrink-0 glass-strong p-4 pb-3"
                style={{ paddingTop: 'calc(var(--safe-area-top) + 1rem)' }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar
                            src={authUser?.avatar || undefined}
                            fallback={authUser?.email || 'Me'}
                            size="lg"
                            isOnline={true}
                        />
                        <div className="min-w-0 flex-1">
                            <h1 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                {authUser?.email || 'User'}
                            </h1>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: 'var(--online-color)', boxShadow: `0 0 6px var(--online-glow)` }} />
                                <span className="text-xs font-medium" style={{ color: 'var(--online-color)' }}>Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                        <ThemePicker />
                        <button
                            onClick={logout}
                            className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 hover:bg-red-500/10 hover:text-red-400"
                            style={{ color: 'var(--text-muted)' }}
                            title="Logout"
                        >
                            <LogOut className="h-[1.1rem] w-[1.1rem]" />
                        </button>
                    </div>
                </div>

                <Input
                    type="text"
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="h-4 w-4" />}
                    className="h-10 text-xs rounded-xl"
                />
            </div>

            {/* ── Scrollable area ──────────────────────────── */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">

                {/* Search Results */}
                {showSearchResults && (
                    <div className="px-3 pt-3 pb-1 animate-fade-in">
                        <div className="flex items-center gap-2 px-2 mb-2">
                            <UserPlus className="h-3.5 w-3.5" style={{ color: 'var(--accent)', opacity: 0.6 }} />
                            <h2 className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: 'var(--accent)', opacity: 0.6 }}>
                                People
                            </h2>
                        </div>

                        {isSearching ? (
                            <div className="space-y-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                                        <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
                                        <div className="flex-1 space-y-1.5">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : searchResults.length === 0 ? (
                            <p className="px-3 py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                                No one found 😅
                            </p>
                        ) : (
                            <div className="space-y-0.5">
                                {searchResults.map((user) => (
                                    <button
                                        key={user._id}
                                        onClick={() => handleUserClick(user._id)}
                                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-200 active:scale-[0.98] group"
                                        style={{
                                            border: '1px solid transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'var(--active-gradient-from)';
                                            e.currentTarget.style.borderColor = 'var(--active-border)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.borderColor = 'transparent';
                                        }}
                                    >
                                        <Avatar src={user.avatar || undefined} fallback={user.email} size="md" isOnline={user.isOnline} />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm font-semibold truncate block" style={{ color: 'var(--text-primary)' }}>
                                                {user.email}
                                            </span>
                                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                {user.isOnline ? '🟢 Online' : '⚫ Offline'}
                                            </span>
                                        </div>
                                        <UserPlus className="h-4 w-4 shrink-0 transition-colors" style={{ color: 'var(--accent)', opacity: 0.5 }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Conversations */}
                <div className="px-3 pt-3 pb-3" style={{ paddingBottom: 'calc(var(--safe-area-bottom) + 0.75rem)' }}>
                    <div className="flex items-center gap-2 px-2 mb-2">
                        <MessageCircle className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} />
                        <h2 className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                            Chats
                        </h2>
                    </div>

                    {isLoadingChats ? (
                        <div className="space-y-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <ConversationSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="flex flex-col items-center py-12 px-4 text-center">
                            <div className="h-16 w-16 rounded-3xl flex items-center justify-center mb-4"
                                style={{
                                    background: `linear-gradient(135deg, var(--active-gradient-from), var(--active-gradient-to))`,
                                }}
                            >
                                <Sparkles className="h-7 w-7" style={{ color: 'var(--accent)', opacity: 0.5 }} />
                            </div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                {searchQuery ? 'No matching chats' : 'No chats yet'}
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                Search for someone to start vibing ✨
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredChats.map((chat) => {
                                const other = getOtherUser(chat);
                                const isActive = chat._id === activeChatId;
                                const online = other ? isUserOnline(other._id) || other.isOnline : false;

                                return (
                                    <button
                                        key={chat._id}
                                        onClick={() => handleChatClick(chat._id)}
                                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 active:scale-[0.98]"
                                        style={{
                                            background: isActive
                                                ? `linear-gradient(135deg, var(--active-gradient-from), var(--active-gradient-to))`
                                                : 'transparent',
                                            border: isActive ? `1px solid var(--active-border)` : '1px solid transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <Avatar
                                            src={other?.avatar || undefined}
                                            fallback={other?.email || 'User'}
                                            size="lg"
                                            isOnline={online}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold truncate"
                                                    style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                                    {other?.email || 'Unknown'}
                                                </span>
                                                {chat.lastMessage && (
                                                    <span className="text-[0.6rem] shrink-0 ml-2 font-medium"
                                                        style={{ color: 'var(--text-muted)' }}>
                                                        {formatMessageTime(chat.lastMessage.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                {(() => {
                                                    const preview = getLastMessagePreview(chat);
                                                    return (
                                                        <span className="text-xs truncate"
                                                            style={{
                                                                color: preview.isTyping ? 'var(--typing-color)' : 'var(--text-muted)',
                                                                fontWeight: preview.isTyping ? 600 : 400,
                                                            }}>
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
