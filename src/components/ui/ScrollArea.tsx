import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/utils/cn';

interface ScrollAreaProps {
    children: React.ReactNode;
    className?: string;
    viewportClassName?: string;
    viewportRef?: React.Ref<HTMLDivElement>;
}

export function ScrollArea({ children, className, viewportClassName, viewportRef }: ScrollAreaProps) {
    return (
        <ScrollAreaPrimitive.Root className={cn('relative overflow-hidden', className)}>
            <ScrollAreaPrimitive.Viewport
                ref={viewportRef}
                className={cn('h-full w-full rounded-[inherit]', viewportClassName)}
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaPrimitive.Scrollbar
                className="flex touch-none select-none transition-colors duration-200 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col hover:bg-white/5"
                orientation="vertical"
            >
                <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors" />
            </ScrollAreaPrimitive.Scrollbar>
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
}
