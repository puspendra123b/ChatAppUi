import { cn } from '@/utils/cn';

interface TypingIndicatorProps {
    username?: string;
    className?: string;
}

export function TypingIndicator({ username, className }: TypingIndicatorProps) {
    return (
        <div className={cn('flex items-center gap-2 px-3 sm:px-4 py-2 animate-fade-in', className)}>
            <div className="flex items-center gap-2.5 rounded-[1.25rem] rounded-bl-lg px-4 py-3"
                style={{
                    backgroundColor: 'var(--received-bubble)',
                    border: `1px solid var(--received-bubble-border)`,
                }}
            >
                <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full animate-typing-1" style={{ backgroundColor: 'var(--typing-color)', opacity: 0.6 }} />
                    <span className="h-2 w-2 rounded-full animate-typing-2" style={{ backgroundColor: 'var(--typing-color)', opacity: 0.6 }} />
                    <span className="h-2 w-2 rounded-full animate-typing-3" style={{ backgroundColor: 'var(--typing-color)', opacity: 0.6 }} />
                </div>
                {username && (
                    <span className="text-xs font-medium ml-0.5" style={{ color: 'var(--text-muted)' }}>
                        {username} is typing
                    </span>
                )}
            </div>
        </div>
    );
}
