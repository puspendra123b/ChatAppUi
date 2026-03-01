import { useMemo, useCallback } from 'react';
import { useChatStore, useAuthStore } from '@/store';
import { useAutoScroll, useTypingIndicator } from '@/hooks';
import { Avatar } from '@/components/ui';
import { MessageSkeleton } from '@/components/ui/Skeleton';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { ArrowLeft, Phone, Video, MoreVertical, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatLastSeen } from '@/utils/format';

interface ChatViewProps {
  onBack?: () => void;
}

export function ChatView({ onBack }: ChatViewProps) {
  const user = useAuthStore((s) => s.user);
  const {
    activeChatId,
    messages,
    chats,
    isLoadingMessages,
    typingUsers,
    sendMessage,
    sendTyping,
    isUserOnline,
  } = useChatStore();

  const activeChat = useMemo(
    () => chats.find((c) => c._id === activeChatId),
    [chats, activeChatId],
  );

  const otherUser = useMemo(
    () => activeChat?.members.find((m) => m._id !== user?._id),
    [activeChat, user],
  );

  const otherOnline = otherUser ? isUserOnline(otherUser._id) || otherUser.isOnline : false;
  const isOtherTyping = activeChatId ? typingUsers[activeChatId] != null : false;
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];

  const { scrollRef, scrollToBottom, handleScroll, isUserScrolledUp } =
    useAutoScroll(chatMessages.length);

  const { startTyping, stopTyping } = useTypingIndicator(
    useCallback(
      (isTyping: boolean) => {
        if (activeChatId) sendTyping(activeChatId, isTyping);
      },
      [activeChatId, sendTyping],
    ),
  );

  const isSelfMessage = useCallback(
    (msg: { senderId: string | { _id: string } }) => {
      if (!user) return false;
      const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
      return senderId === user._id || senderId === 'self';
    },
    [user],
  );

  const handleSend = (content: string) => {
    if (!activeChatId) return;
    sendMessage(activeChatId, content);
    stopTyping();
  };

  const getStatusLine = (): string => {
    if (isOtherTyping) return 'typing...';
    if (otherOnline) return 'Online now';
    if (otherUser?.lastSeen) return formatLastSeen(otherUser.lastSeen);
    return 'Offline';
  };

  // No conversation selected
  if (!activeChatId || !activeChat) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center text-center p-8"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="space-y-5 animate-slide-up max-w-xs">
          <div className="relative mx-auto">
            <div className="h-24 w-24 rounded-[2rem] flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--active-gradient-from), var(--active-gradient-to))`,
                border: `1px solid var(--active-border)`,
              }}
            >
              <Sparkles className="h-10 w-10" style={{ color: 'var(--accent)', opacity: 0.5 }} />
            </div>
            <div className="absolute -inset-4 rounded-full blur-2xl"
              style={{ background: `linear-gradient(135deg, var(--active-gradient-from), var(--active-gradient-to))` }} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-secondary)' }}>Pick a chat</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Select a conversation or find someone new to vybe with ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
    <div className="flex h-full w-full flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ── Chat Header ─────────────────────────────── */}
      <header className="flex items-center gap-3 glass-strong px-4 py-3 shrink-0"
        style={{ paddingTop: 'calc(var(--safe-area-top) + 0.75rem)' }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="mr-0.5 flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <Avatar
          src={otherUser?.avatar || undefined}
          fallback={otherUser?.email || 'User'}
          size="md"
          isOnline={otherOnline}
        />

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {otherUser?.email || 'Unknown'}
          </h2>
          <p className="text-xs font-medium transition-colors duration-300"
            style={{
              color: isOtherTyping
                ? 'var(--typing-color)'
                : otherOnline
                  ? 'var(--online-color)'
                  : 'var(--text-muted)',
            }}>
            {getStatusLine()}
          </p>
        </div>

        <div className="flex items-center gap-0.5">
          {[Phone, Video, MoreVertical].map((Icon, i) => (
            <button key={i} className="flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95"
              style={{ color: 'var(--text-muted)' }}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </header>

      {/* ── Messages ────────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin"

      >
        {isLoadingMessages ? (
          <div className="space-y-3 px-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2 animate-fade-in">
              <p className="text-3xl">👋</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No messages yet</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Break the ice!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {chatMessages.map((msg) => (
              <MessageBubble key={msg._id} message={msg} isSelf={isSelfMessage(msg)} />
            ))}
          </div>
        )}

        {isOtherTyping && (
          <TypingIndicator username={otherUser?.email} />
        )}
      </div>

      {/* Scroll-to-bottom FAB */}
      {isUserScrolledUp && (
        <div className="absolute bottom-24 right-4 sm:right-6 z-10">
          <button
            onClick={() => scrollToBottom()}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))`,
              boxShadow: `0 4px 14px var(--active-gradient-from)`,
            }}
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ── Message Input ────────────────────────────── */}
      <MessageInput
        onSend={handleSend}
        onTyping={startTyping}
        disabled={!activeChatId}
      />
    </div>
  );
}
