import * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, icon, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>{icon}</div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-12 w-full rounded-2xl px-4 py-3 text-sm transition-all duration-200',
                        'focus:outline-none focus:ring-2',
                        'disabled:cursor-not-allowed disabled:opacity-40',
                        icon && 'pl-11',
                        className,
                    )}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: error ? `1px solid var(--danger-border)` : '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        '--tw-ring-color': error ? 'var(--danger-border)' : 'var(--border-active)',
                    } as React.CSSProperties}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger-text)' }}>{error}</p>}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
