import { cn } from '@/utils/cn';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5',
                className,
            )}
        />
    );
}

export function MessageSkeleton() {
    return (
        <div className="flex gap-3 px-4 py-2 animate-fade-in">
            <Skeleton className="h-8 w-8 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-12 w-3/4 rounded-2xl" />
            </div>
        </div>
    );
}

export function ConversationSkeleton() {
    return (
        <div className="flex items-center gap-3 px-4 py-3 animate-fade-in">
            <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3.5 w-40" />
            </div>
        </div>
    );
}

export function ContactSkeleton() {
    return (
        <div className="flex items-center gap-3 px-4 py-2.5 animate-fade-in">
            <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
}
