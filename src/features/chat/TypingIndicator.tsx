import { cn } from '@/utils/cn';

interface TypingIndicatorProps {
    username?: string;
    className?: string;
}

export function TypingIndicator({ username, className }: TypingIndicatorProps) {
    return (
        <div className={cn('flex items-center gap-2 px-4 py-2', className)}>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-800 border border-white/[0.06] px-4 py-3">
                {/* Animated dots */}
                <div className="flex items-center gap-1">
                    <span
                        className="h-2 w-2 rounded-full bg-white/40 animate-bounce"
                        style={{ animationDelay: '0ms', animationDuration: '1.2s' }}
                    />
                    <span
                        className="h-2 w-2 rounded-full bg-white/40 animate-bounce"
                        style={{ animationDelay: '200ms', animationDuration: '1.2s' }}
                    />
                    <span
                        className="h-2 w-2 rounded-full bg-white/40 animate-bounce"
                        style={{ animationDelay: '400ms', animationDuration: '1.2s' }}
                    />
                </div>
                {username && (
                    <span className="text-xs text-white/40 ml-1">{username} is typing</span>
                )}
            </div>
        </div>
    );
}
