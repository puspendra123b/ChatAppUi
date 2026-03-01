import { useState, useEffect } from 'react';
import { Sidebar } from '@/features/contacts';
import { ChatView } from '@/features/chat';
import { useChatStore } from '@/store';
import { useIsMobile } from '@/hooks';
import { cn } from '@/utils/cn';

export function ChatLayout() {
    const isMobile = useIsMobile();
    const activeChatId = useChatStore((s) => s.activeChatId);
    const initWSListeners = useChatStore((s) => s.initWSListeners);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        if (isMobile && !activeChatId) {
            setShowSidebar(true);
        }
    }, [isMobile, activeChatId]);

    // Initialise WebSocket listeners
    useEffect(() => {
        const cleanup = initWSListeners();
        return cleanup;
    }, [initWSListeners]);

    const handleConversationSelect = () => {
        if (isMobile) setShowSidebar(false);
    };

    const handleBack = () => {
        setShowSidebar(true);
        useChatStore.getState().setActiveChat(null);
    };

    return (
<<<<<<< Updated upstream
        <div className="flex h-screen w-full overflow-hidden bg-slate-950">
=======
        <div className="flex h-full w-full overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
>>>>>>> Stashed changes
            {/* Sidebar */}
            <aside
                className={cn(
                    'h-full shrink-0 transition-all duration-300 ease-in-out',
                    isMobile
                        ? cn('absolute inset-y-0 left-0 z-30 w-full', showSidebar ? 'translate-x-0' : '-translate-x-full')
                        : 'relative w-80 xl:w-96',
                )}
            >
                <Sidebar onConversationSelect={handleConversationSelect} />
            </aside>

            {/* Chat area */}
            <main
                className={cn(
<<<<<<< Updated upstream
                    'relative flex-1 h-full transition-all duration-300 ease-in-out',
                    isMobile && showSidebar ? 'hidden' : 'block',
=======
                    'relative flex-1 min-w-0 h-full overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    isMobile && showSidebar ? 'hidden' : 'flex',
>>>>>>> Stashed changes
                )}
            >
                <ChatView onBack={isMobile ? handleBack : undefined} />
            </main>
        </div>
    );
}
