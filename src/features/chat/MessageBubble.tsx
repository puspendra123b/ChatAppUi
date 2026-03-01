import { cn } from '@/utils/cn';
import { formatMessageTime } from '@/utils/format';
import type { Message } from '@/types';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface MessageBubbleProps {
    message: Message;
    isSelf: boolean;
}

/** Extract sender display name */
function getSenderName(senderId: Message['senderId']): string {
    if (typeof senderId === 'object' && senderId !== null) {
        return senderId.email || 'User';
    }
    return '';
}

export function MessageBubble({ message, isSelf }: MessageBubbleProps) {
    // Check if message is a temp optimistic message
    const isTemp = typeof message._id === 'string' && message._id.includes('-');

    return (
        <div
            className={cn(
<<<<<<< Updated upstream
                'group flex w-full mb-1 px-4',
=======
                'group flex w-full mb-1 px-3 sm:px-4 animate-msg-pop overflow-hidden',
>>>>>>> Stashed changes
                isSelf ? 'justify-end' : 'justify-start',
            )}
        >
            <div
<<<<<<< Updated upstream
                className={cn(
                    'relative max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-150',
=======
                className="relative max-w-[80%] sm:max-w-[70%] rounded-[1.25rem] px-4 py-2.5 shadow-sm transition-all duration-150 overflow-hidden"
                style={
>>>>>>> Stashed changes
                    isSelf
                        ? 'bg-emerald-600 text-white rounded-br-md'
                        : 'bg-slate-800 text-white/90 rounded-bl-md border border-white/[0.06]',
                )}
            >
                <p className="text-[0.9rem] leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                </p>

                <div
                    className={cn(
                        'mt-1 flex items-center gap-1.5',
                        isSelf ? 'justify-end' : 'justify-start',
                    )}
                >
                    <span className={cn(
                        'text-[0.65rem] leading-none',
                        isSelf ? 'text-white/50' : 'text-white/30',
                    )}>
                        {formatMessageTime(message.createdAt)}
                    </span>
                    {isSelf && (
                        isTemp
                            ? <Clock className="h-3 w-3 text-white/30" />
                            : <CheckCheck className="h-3 w-3 text-white/50" />
                    )}
                </div>
            </div>
        </div>
    );
}
