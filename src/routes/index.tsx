import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './guards';
import { LoginPage, RegisterPage } from '@/features/auth';
import { ChatLayout } from '@/layouts';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/chat" replace />,
    },
    {
        element: <PublicOnlyRoute />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/register',
                element: <RegisterPage />,
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/chat',
                element: <ChatLayout />,
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/chat" replace />,
    },
]);
