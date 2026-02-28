import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
    {
        variants: {
            variant: {
                default: 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-700',
                destructive: 'bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700',
                outline: 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
                secondary: 'bg-white/10 text-white hover:bg-white/15',
                ghost: 'text-white/70 hover:bg-white/10 hover:text-white',
                link: 'text-emerald-400 underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-11 px-5 py-2.5',
                sm: 'h-9 rounded-lg px-3.5',
                lg: 'h-12 rounded-xl px-8 text-base',
                icon: 'h-10 w-10 rounded-xl',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        <span>Loading...</span>
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
