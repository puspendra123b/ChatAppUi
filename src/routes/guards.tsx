import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Sparkles } from 'lucide-react';

export function ProtectedRoute() {
    const { isAuthenticated, isInitialising } = useAuthStore();

    if (isInitialising) {
        return (
            <div className="flex h-screen h-[100dvh] items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="flex flex-col items-center gap-5 animate-slide-up">
                    <div className="relative">
                        <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))`,
                                boxShadow: `0 8px 24px var(--active-gradient-from)`,
                            }}>
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <div className="absolute inset-0 h-14 w-14 rounded-2xl animate-ping opacity-20"
                            style={{ background: `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))` }} />
                    </div>
                    <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-muted)' }}>
                        Loading your vybe...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
}

export function PublicOnlyRoute() {
    const { isAuthenticated, isInitialising } = useAuthStore();

    if (isInitialising) {
        return (
            <div className="flex h-screen h-[100dvh] items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="relative">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))`,
                            boxShadow: `0 8px 24px var(--active-gradient-from)`,
                        }}>
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <div className="absolute inset-0 h-14 w-14 rounded-2xl animate-ping opacity-20"
                        style={{ background: `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))` }} />
                </div>
            </div>
        );
    }

    if (isAuthenticated) return <Navigate to="/chat" replace />;
    return <Outlet />;
}
