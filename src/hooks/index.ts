import { useEffect, useRef, useCallback, useState } from 'react';

/** Auto-scroll to bottom of a scroll container when new content arrives */
export function useAutoScroll(dependency: unknown) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        if (!isUserScrolledUp) {
            scrollToBottom();
        }
    }, [dependency, isUserScrolledUp, scrollToBottom]);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setIsUserScrolledUp(distanceFromBottom > 100);
    }, []);

    return { scrollRef, scrollToBottom, handleScroll, isUserScrolledUp };
}

/** Debounced typing indicator */
export function useTypingIndicator(
    sendTyping: (isTyping: boolean) => void,
    delay = 2000,
) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    const startTyping = useCallback(() => {
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            sendTyping(true);
        }

        // Reset the stop timer
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            isTypingRef.current = false;
            sendTyping(false);
        }, delay);
    }, [sendTyping, delay]);

    const stopTyping = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (isTypingRef.current) {
            isTypingRef.current = false;
            sendTyping(false);
        }
    }, [sendTyping]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { startTyping, stopTyping };
}

/** Responsive sidebar detection */
export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
}
