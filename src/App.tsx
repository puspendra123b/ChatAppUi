import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useAuthStore, useThemeStore } from '@/store';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  const initialise = useAuthStore((s) => s.initialise);
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
    initialise();
  }, [initialise, initTheme]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
