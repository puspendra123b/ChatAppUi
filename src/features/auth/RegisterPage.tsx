import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { Mail, Lock, Sparkles } from 'lucide-react';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setValidationError('');

        if (password.length < 6) {
            setValidationError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        try {
            await register({ email, password });
            navigate('/chat');
        } catch {
            // Error is already set in the store
        }
    };

    const displayError = validationError || error;

    return (
        <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {/* Animated background blobs */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -right-32 h-64 w-64 sm:h-96 sm:w-96 rounded-full blur-[100px] animate-blob"
                    style={{ backgroundColor: 'var(--blob-color-2)' }} />
                <div className="absolute top-1/2 -left-32 h-64 w-64 sm:h-80 sm:w-80 rounded-full blur-[100px] animate-blob animation-delay-2000"
                    style={{ backgroundColor: 'var(--blob-color-1)' }} />
                <div className="absolute -bottom-32 right-1/3 h-64 w-64 sm:h-72 sm:w-72 rounded-full blur-[100px] animate-blob animation-delay-4000"
                    style={{ backgroundColor: 'var(--blob-color-3)' }} />
            </div>

            <Card variant="glass" className="relative w-full max-w-md shadow-2xl animate-slide-up">
                <CardHeader className="items-center text-center pb-2">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, var(--accent-gradient-to), var(--accent-gradient-from))`,
                            boxShadow: `0 8px 24px var(--active-gradient-from)`,
                        }}
                    >
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle>
                        <span className="text-gradient">Join the vybe</span> 🎉
                    </CardTitle>
                    <CardDescription>Create your account and start chatting</CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    {displayError && (
                        <div className="mb-4 rounded-2xl px-4 py-3 text-sm animate-slide-up"
                            style={{
                                backgroundColor: 'var(--danger-bg)',
                                border: `1px solid var(--danger-border)`,
                                color: 'var(--danger-text)',
                            }}
                        >
                            <span>{displayError}</span>
                            <button
                                onClick={() => { setValidationError(''); clearError(); }}
                                className="ml-2 underline text-xs transition-colors opacity-80 hover:opacity-100"
                            >
                                dismiss
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="reg-email" className="text-xs font-semibold uppercase tracking-widest"
                                style={{ color: 'var(--text-muted)' }}>
                                Email
                            </label>
                            <Input
                                id="reg-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="h-4 w-4" />}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="reg-password" className="text-xs font-semibold uppercase tracking-widest"
                                style={{ color: 'var(--text-muted)' }}>
                                Password
                            </label>
                            <Input
                                id="reg-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="h-4 w-4" />}
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="reg-confirm" className="text-xs font-semibold uppercase tracking-widest"
                                style={{ color: 'var(--text-muted)' }}>
                                Confirm Password
                            </label>
                            <Input
                                id="reg-confirm"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                icon={<Lock className="h-4 w-4" />}
                                required
                                autoComplete="new-password"
                                error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Let's Goo 🎯
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold transition-colors" style={{ color: 'var(--accent)' }}>
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
