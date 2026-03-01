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
        <div className="flex h-screen h-[100dvh] w-full overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Sidebar */}
            <aside
                className={cn(
                    'h-full shrink-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    isMobile
                        ? cn(
                            'fixed inset-y-0 left-0 z-30 w-full',
                            showSidebar ? 'translate-x-0' : '-translate-x-full',
                        )
                        : 'relative w-80 lg:w-[22rem] xl:w-96',
                )}
            >
                <Sidebar onConversationSelect={handleConversationSelect} />
            </aside>

            {/* Chat area */}
            <main
                className={cn(
                    'relative flex-1 h-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    isMobile && showSidebar ? 'hidden' : 'flex',
                )}
            >
                <ChatView onBack={isMobile ? handleBack : undefined} />
            </main>
        </div>
    );
}
