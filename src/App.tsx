import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { useAuthStore } from '@/store';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  const initialise = useAuthStore((s) => s.initialise);

  useEffect(() => {
    initialise();
  }, [initialise]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
