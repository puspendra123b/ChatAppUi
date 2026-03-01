import { useMemo, useCallback } from 'react';
import { useChatStore, useAuthStore } from '@/store';
import { useAutoScroll, useTypingIndicator } from '@/hooks';
import { Avatar } from '@/components/ui';
import { MessageSkeleton } from '@/components/ui/Skeleton';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';
import { ArrowLeft, Phone, Video, MoreVertical, ChevronDown } from 'lucide-react';
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

  // Find active chat and the other participant
  const activeChat = useMemo(
    () => chats.find((c) => c._id === activeChatId),
    [chats, activeChatId],
  );

  const otherUser = useMemo(
    () => activeChat?.members.find((m) => m._id !== user?._id),
    [activeChat, user],
  );

  // Real-time online status (from WS events)
  const otherOnline = otherUser ? isUserOnline(otherUser._id) || otherUser.isOnline : false;

  // Typing state for this chat
  const isOtherTyping = activeChatId ? typingUsers[activeChatId] != null : false;

  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];

  // Auto scroll
  const { scrollRef, scrollToBottom, handleScroll, isUserScrolledUp } =
    useAutoScroll(chatMessages.length);

  // Typing indicator hook
  const { startTyping, stopTyping } = useTypingIndicator(
    useCallback(
      (isTyping: boolean) => {
        if (activeChatId) sendTyping(activeChatId, isTyping);
      },
      [activeChatId, sendTyping],
    ),
  );

  // Determine if a message was sent by the current user
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
    stopTyping(); // Stop typing when we send
  };

  // Build status line for header
  const getStatusLine = (): string => {
    if (isOtherTyping) return 'typing...';
    if (otherOnline) return 'Online';
    if (otherUser?.lastSeen) return formatLastSeen(otherUser.lastSeen);
    return 'Offline';
  };

  // No conversation selected state
  if (!activeChatId || !activeChat) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-slate-950 text-center p-8">
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/10">
            <svg className="h-10 w-10 text-emerald-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white/80">Your messages</h2>
          <p className="text-sm text-white/40 max-w-xs">
            Select a conversation or search for a user to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
    <div className="flex h-full flex-col bg-slate-950">
      {/* ── Chat Header ────────────────────────────────── */}
      <header className="flex items-center gap-3 border-b border-white/[0.06] bg-slate-900/80 backdrop-blur-lg px-4 py-3 shrink-0">
=======
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* ── Chat Header ─────────────────────────────── */}
      <header className="flex items-center gap-3 glass-strong px-4 py-3 shrink-0"
        style={{ paddingTop: 'calc(var(--safe-area-top) + 0.75rem)' }}
      >
>>>>>>> Stashed changes
        {onBack && (
          <button
            onClick={onBack}
            className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all md:hidden"
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
          <h2 className="text-sm font-semibold text-white truncate">
            {otherUser?.email || 'Unknown'}
          </h2>
          <p className={cn(
            'text-xs transition-colors duration-300',
            isOtherTyping
              ? 'text-emerald-400'
              : otherOnline
                ? 'text-emerald-400/60'
                : 'text-white/40',
          )}>
            {getStatusLine()}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <Phone className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <Video className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── Messages Area ──────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
<<<<<<< Updated upstream
        className="flex-1 overflow-y-auto py-4 scrollbar-thin"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.03) 0%, transparent 50%)
          `,
        }}
=======
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin"
>>>>>>> Stashed changes
      >
        {isLoadingMessages ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-sm text-white/30">No messages yet</p>
              <p className="text-xs text-white/20">Say hello! 👋</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {chatMessages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isSelf={isSelfMessage(msg)}
              />
            ))}
          </div>
        )}

        {/* Typing indicator inside the messages area */}
        {isOtherTyping && (
          <TypingIndicator username={otherUser?.email} />
        )}
      </div>

      {/* Scroll to bottom FAB */}
      {isUserScrolledUp && (
        <div className="absolute bottom-20 right-6">
          <button
            onClick={() => scrollToBottom()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-white/60 hover:text-white shadow-xl transition-all hover:scale-105"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ── Message Input ──────────────────────────────── */}
      <MessageInput
        onSend={handleSend}
        onTyping={startTyping}
        disabled={!activeChatId}
      />
    </div>
  );
}
