import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MessageInputProps {
    onSend: (content: string) => void;
    onTyping: () => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, onTyping, disabled }: MessageInputProps) {
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setContent('');
        if (textareaRef.current) {
            textareaRef.current.style.height = '44px';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleChange = (value: string) => {
        setContent(value);
        onTyping();
    };

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '44px';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };

    return (
        <div className="shrink-0 glass-strong"
            style={{
                padding: '10px 12px',
                paddingBottom: 'calc(10px + var(--safe-area-bottom))',
                borderTop: '1px solid var(--border-subtle)',
            }}
        >
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                {/* Attachment */}
                <button
                    type="button"
                    className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl transition-all duration-150 active:scale-95"
                    style={{ color: 'var(--text-muted)' }}
                    title="Attach file"
                >
                    <Paperclip className="h-5 w-5" />
                </button>

                {/* Input container */}
                <div className="relative flex-1 min-w-0">
                    <textarea
                        ref={textareaRef}
                        id="message-input"
                        value={content}
                        onChange={(e) => {
                            handleChange(e.target.value);
                            autoResize();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={disabled}
                        rows={1}
                        className={cn(
                            'w-full resize-none rounded-2xl px-4 py-3 pr-11 text-sm',
                            'focus:outline-none focus:ring-2',
                            'disabled:opacity-40 disabled:cursor-not-allowed',
                            'transition-all duration-200',
                        )}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            height: '44px',
                            minHeight: '44px',
                            maxHeight: '120px',
                            lineHeight: '1.4',
                            overflow: 'hidden',
                            overflowY: content.split('\n').length > 2 ? 'auto' : 'hidden',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                            '--tw-ring-color': 'var(--border-active)',
                        } as React.CSSProperties}
                    />
                    <button
                        type="button"
                        className="absolute right-3 bottom-[10px] transition-colors active:scale-95"
                        style={{ color: 'var(--text-muted)' }}
                        title="Emoji"
                    >
                        <Smile className="h-5 w-5" />
                    </button>
                </div>

                {/* Send button */}
                <button
                    type="submit"
                    disabled={disabled || !content.trim()}
                    className={cn(
                        'flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-90',
                        'disabled:opacity-30 disabled:cursor-not-allowed',
                    )}
                    style={{
                        background: content.trim()
                            ? `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))`
                            : 'rgba(255,255,255,0.06)',
                        color: content.trim() ? '#fff' : 'var(--text-muted)',
                        boxShadow: content.trim() ? `0 4px 12px var(--active-gradient-from)` : 'none',
                        transform: content.trim() ? 'scale(1)' : 'scale(0.92)',
                    }}
                >
                    <Send className="h-[1.1rem] w-[1.1rem]" />
                </button>
            </form>
        </div>
    );
}
