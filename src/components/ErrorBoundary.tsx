import React from 'react';
import { Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="flex h-full w-full items-center justify-center p-6"
                    style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                    <div className="max-w-sm text-center space-y-5 animate-slide-up">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500/15 to-rose-500/15 border border-red-500/10">
                            <AlertTriangle className="h-9 w-9 text-red-400/70" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Something broke 😵</h2>
                            <p className="text-sm text-white/40 mt-2">{this.state.error?.message || 'An unexpected error occurred.'}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
