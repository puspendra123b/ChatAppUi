import { cn } from '@/utils/cn';
import { formatMessageTime } from '@/utils/format';
import type { Message } from '@/types';
import { CheckCheck, Clock } from 'lucide-react';

interface MessageBubbleProps {
    message: Message;
    isSelf: boolean;
}

export function MessageBubble({ message, isSelf }: MessageBubbleProps) {
    const isTemp = typeof message._id === 'string' && message._id.includes('-');

    return (
        <div
            className={cn(
                'group flex w-full mb-1 px-3 sm:px-4 animate-msg-pop overflow-hidden',
                isSelf ? 'justify-end' : 'justify-start',
            )}
        >
            <div
                className="relative max-w-[80%] sm:max-w-[70%] rounded-[1.25rem] px-4 py-2.5 shadow-sm transition-all duration-150 overflow-hidden"
                style={
                    isSelf
                        ? {
                            background: `linear-gradient(135deg, var(--sent-bubble-from), var(--sent-bubble-to))`,
                            color: 'var(--sent-bubble-text)',
                            borderBottomRightRadius: '0.5rem',
                        }
                        : {
                            backgroundColor: 'var(--received-bubble)',
                            color: 'var(--received-bubble-text)',
                            border: `1px solid var(--received-bubble-border)`,
                            borderBottomLeftRadius: '0.5rem',
                        }
                }
            >
                <p className="text-[0.9rem] leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                </p>

                <div className={cn('mt-1 flex items-center gap-1.5', isSelf ? 'justify-end' : 'justify-start')}>
                    <span className="text-[0.6rem] leading-none font-medium" style={{ opacity: 0.5 }}>
                        {formatMessageTime(message.createdAt)}
                    </span>
                    {isSelf && (
                        isTemp
                            ? <Clock className="h-3 w-3" style={{ opacity: 0.3 }} />
                            : <CheckCheck className="h-3 w-3" style={{ opacity: 0.5 }} />
                    )}
                </div>
            </div>
        </div>
    );
}
