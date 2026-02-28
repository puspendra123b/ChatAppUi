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
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-500" />
                    <p className="text-sm text-white/40 animate-pulse">Loading...</p>
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
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-500" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/chat" replace />;
    }

    return <Outlet />;
}
