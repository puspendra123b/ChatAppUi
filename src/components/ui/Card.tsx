import * as React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border transition-all duration-200',
                variant === 'default' && 'border-white/10 bg-slate-800/80',
                variant === 'glass' && 'border-white/10 bg-white/5 backdrop-blur-xl',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn('text-2xl font-bold tracking-tight text-white', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-white/50', className)} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
}
