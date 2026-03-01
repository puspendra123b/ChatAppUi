import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', asChild = false, isLoading, children, disabled, style, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        const sizeClasses: Record<string, string> = {
            default: 'h-11 px-6 py-2.5 text-sm',
            sm: 'h-9 rounded-xl px-4 text-xs',
            lg: 'h-12 rounded-2xl px-8 text-base',
            icon: 'h-10 w-10 rounded-xl',
        };

        const variantStyles: Record<string, React.CSSProperties> = {
            default: {
                background: `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))`,
                color: '#ffffff',
                boxShadow: `0 4px 14px var(--active-gradient-from)`,
            },
            destructive: {
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.25)',
            },
            outline: {
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary)',
            },
            secondary: {
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'var(--text-primary)',
            },
            ghost: {
                color: 'var(--text-secondary)',
            },
            link: {
                color: 'var(--accent)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
            },
        };

        return (
            <Comp
                className={cn(
                    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-40 cursor-pointer active:scale-[0.97]',
                    sizeClasses[size] || sizeClasses.default,
                    className,
                )}
                style={{
                    ...variantStyles[variant],
                    ...style,
                    '--tw-ring-color': 'var(--accent)',
                    '--tw-ring-offset-color': 'var(--bg-primary)',
                } as React.CSSProperties}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Hold on...</span>
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    },
);
Button.displayName = 'Button';

export { Button };
