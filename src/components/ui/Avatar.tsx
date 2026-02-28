import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/format';

interface AvatarProps {
    src?: string;
    fallback: string;
    size?: 'sm' | 'md' | 'lg';
    isOnline?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
};

const indicatorSizeClasses = {
    sm: 'h-2.5 w-2.5 border-[1.5px]',
    md: 'h-3 w-3 border-2',
    lg: 'h-3.5 w-3.5 border-2',
};

export function Avatar({ src, fallback, size = 'md', isOnline, className }: AvatarProps) {
    return (
        <div className="relative inline-flex">
            <AvatarPrimitive.Root
                className={cn(
                    'relative flex shrink-0 overflow-hidden rounded-full',
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
                    className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-semibold text-white"
                >
                    {getInitials(fallback)}
                </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
            {isOnline !== undefined && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-slate-900',
                        indicatorSizeClasses[size],
                        isOnline ? 'bg-emerald-400' : 'bg-slate-500',
                    )}
                />
            )}
        </div>
    );
}
