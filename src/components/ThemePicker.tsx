import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useThemeStore } from '@/store';
import { themes } from '@/config/themes';
import { Palette, X, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

function ThemeModal({ onClose }: { onClose: () => void }) {
    const { themeId, setTheme } = useThemeStore();

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return createPortal(
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="animate-fade-in"
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                }}
            />

            {/* Bottom Sheet */}
            <div
                className="animate-slide-up"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '28rem',
                    maxHeight: '80dvh',
                    backgroundColor: 'var(--bg-elevated)',
                    borderTop: '1px solid var(--border-subtle)',
                    borderLeft: '1px solid var(--border-subtle)',
                    borderRight: '1px solid var(--border-subtle)',
                    borderTopLeftRadius: '1.5rem',
                    borderTopRightRadius: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Drag handle */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '10px',
                    paddingBottom: '4px',
                    flexShrink: 0,
                }}>
                    <div style={{
                        height: '4px',
                        width: '40px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--text-muted)',
                    }} />
                </div>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 20px 12px',
                    flexShrink: 0,
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            margin: 0,
                        }}>
                            Choose your vybe ✨
                        </h2>
                        <p style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                        }}>
                            Pick a mood that fits you
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="active:scale-95"
                        style={{
                            display: 'flex',
                            height: '32px',
                            width: '32px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            color: 'var(--text-muted)',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Scrollable theme grid */}
                <div
                    className="scrollbar-hidden"
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch',
                        padding: '0 16px 16px',
                        paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
                    }}
                >
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '10px',
                    }}>
                        {themes.map((theme) => {
                            const isActive = theme.id === themeId;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => {
                                        setTheme(theme.id);
                                        onClose();
                                    }}
                                    className={cn(
                                        'active:scale-[0.97]',
                                        isActive ? 'ring-2' : '',
                                    )}
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: '8px',
                                        borderRadius: '1rem',
                                        padding: '12px',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        backgroundColor: theme.colors.bgSurface,
                                        border: `1px solid ${isActive ? theme.colors.borderActive : theme.colors.borderSubtle}`,
                                        '--tw-ring-color': isActive ? theme.colors.accent : 'transparent',
                                    } as React.CSSProperties}
                                >
                                    {/* Color dots */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{
                                            height: '14px', width: '14px', borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${theme.colors.sentBubbleFrom}, ${theme.colors.sentBubbleTo})`,
                                        }} />
                                        <span style={{
                                            height: '14px', width: '14px', borderRadius: '50%',
                                            backgroundColor: theme.colors.accent,
                                        }} />
                                        <span style={{
                                            height: '14px', width: '14px', borderRadius: '50%',
                                            backgroundColor: theme.colors.bgPrimary,
                                            border: `1px solid ${theme.colors.borderSubtle}`,
                                        }} />
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '0.75rem' }}>{theme.emoji}</span>
                                            <span style={{
                                                fontSize: '0.75rem', fontWeight: 700,
                                                color: theme.colors.textPrimary,
                                            }}>
                                                {theme.name}
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '0.6rem', marginTop: '1px',
                                            color: theme.colors.textMuted,
                                            lineHeight: 1.3,
                                        }}>
                                            {theme.description}
                                        </p>
                                    </div>

                                    {/* Active check */}
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute', top: '8px', right: '8px',
                                            display: 'flex', height: '16px', width: '16px',
                                            alignItems: 'center', justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: theme.colors.accent,
                                        }}>
                                            <Check className="h-2.5 w-2.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export function ThemePicker() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 active:scale-95"
                style={{
                    color: 'var(--text-muted)',
                    backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.backgroundColor = 'var(--active-gradient-from)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Change theme"
            >
                <Palette className="h-[1.1rem] w-[1.1rem]" />
            </button>

            {isOpen && <ThemeModal onClose={() => setIsOpen(false)} />}
        </>
    );
}
