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
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-white/[0.07]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        icon && 'pl-10',
                        error && 'border-red-500/50 focus:ring-red-500/50',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
