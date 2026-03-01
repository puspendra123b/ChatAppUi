import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';

/**
 * Protected route wrapper.
 * Redirects to login if user is not authenticated.
 * Shows a loading spinner during auth initialisation.
 */
export function ProtectedRoute() {
    const { isAuthenticated, isInitialising } = useAuthStore();

    if (isInitialising) {
        return (
<<<<<<< Updated upstream
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-500" />
                    <p className="text-sm text-white/40 animate-pulse">Loading...</p>
=======
            <div className="flex h-full items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
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
>>>>>>> Stashed changes
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

/**
 * Public-only route wrapper.
 * Redirects to chat if user is already authenticated.
 */
export function PublicOnlyRoute() {
    const { isAuthenticated, isInitialising } = useAuthStore();

    if (isInitialising) {
        return (
<<<<<<< Updated upstream
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-500" />
=======
            <div className="flex h-full items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
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
>>>>>>> Stashed changes
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/chat" replace />;
    }

    return <Outlet />;
}
