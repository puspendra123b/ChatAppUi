import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui';
import { Send, Smile, Paperclip } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MessageInputProps {
    onSend: (content: string) => void;
    onTyping: () => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, onTyping, disabled }: MessageInputProps) {
    const [content, setContent] = useState('');

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setContent('');
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

    return (
        <div className="border-t border-white/[0.06] bg-slate-900/80 backdrop-blur-lg p-3">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                {/* Attachment button */}
                <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition-all"
                    title="Attach file"
                >
                    <Paperclip className="h-5 w-5" />
                </button>

                {/* Text input */}
                <div className="relative flex-1">
                    <textarea
                        id="message-input"
                        value={content}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={disabled}
                        rows={1}
                        className={cn(
                            'w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/30',
                            'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 focus:bg-white/[0.07]',
                            'max-h-32 transition-all duration-200',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                        style={{
                            height: 'auto',
                            minHeight: '2.75rem',
                            maxHeight: '8rem',
                        }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-3 bottom-2.5 text-white/30 hover:text-white/50 transition-colors"
                        title="Emoji"
                    >
                        <Smile className="h-5 w-5" />
                    </button>
                </div>

                {/* Send button */}
                <Button
                    type="submit"
                    size="icon"
                    disabled={disabled || !content.trim()}
                    className={cn(
                        'shrink-0 rounded-full h-10 w-10 transition-all duration-200',
                        content.trim()
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 scale-100'
                            : 'bg-white/10 hover:bg-white/15 scale-95',
                    )}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
