import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/format';

interface AvatarProps {
    src?: string;
    fallback: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isOnline?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'h-8 w-8 text-[0.65rem]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
    xl: 'h-16 w-16 text-base',
};

const indicatorSizeClasses = {
    sm: 'h-2 w-2 border-[1.5px]',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
    xl: 'h-3.5 w-3.5 border-2',
};

export function Avatar({ src, fallback, size = 'md', isOnline, className }: AvatarProps) {
    return (
        <div className="relative inline-flex shrink-0">
            <AvatarPrimitive.Root
                className={cn(
                    'relative flex shrink-0 overflow-hidden rounded-2xl',
                    sizeClasses[size],
                    className,
                )}
            >
                <AvatarPrimitive.Image
                    className="aspect-square h-full w-full object-cover"
                    src={src}
                    alt={fallback}
                />
                <AvatarPrimitive.Fallback
                    className="flex h-full w-full items-center justify-center rounded-2xl font-bold text-white"
                    style={{
                        background: `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))`,
                    }}
                >
                    {getInitials(fallback)}
                </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
            {isOnline !== undefined && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full',
                        indicatorSizeClasses[size],
                    )}
                    style={{
                        borderColor: 'var(--bg-surface)',
                        backgroundColor: isOnline ? 'var(--online-color)' : '#64748b',
                        boxShadow: isOnline ? `0 0 6px var(--online-glow)` : 'none',
                    }}
                />
            )}
        </div>
    );
}
