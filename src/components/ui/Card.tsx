import * as React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass';
}

export function Card({ className, variant = 'default', children, style, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-3xl transition-all duration-300',
                variant === 'glass' && 'glass',
                className,
            )}
            style={{
                ...(variant === 'default' ? {
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                } : {}),
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('flex flex-col space-y-2 p-6 sm:p-8', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn('text-2xl sm:text-3xl font-extrabold tracking-tight', className)}
            style={{ color: 'var(--text-primary)' }}
            {...props}
        >
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm', className)} style={{ color: 'var(--text-secondary)' }} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('p-6 pt-0 sm:p-8 sm:pt-0', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('flex items-center p-6 pt-0 sm:p-8 sm:pt-0', className)} {...props}>
            {children}
        </div>
    );
}
