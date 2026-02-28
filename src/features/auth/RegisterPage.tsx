import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { Mail, Lock, MessageCircle } from 'lucide-react';

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
            // Backend signup expects { email, password }
            await register({ email, password });
            navigate('/chat');
        } catch {
            // Error is already set in the store
        }
    };

    const displayError = validationError || error;

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-600/10 blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-600/10 blur-[120px]" />
            </div>

            <Card variant="glass" className="relative w-full max-w-md border-white/[0.08] shadow-2xl shadow-black/40">
                <CardHeader className="items-center text-center pb-2">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                        <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Create account</CardTitle>
                    <CardDescription>Start your messaging journey</CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    {displayError && (
                        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {displayError}
                            <button
                                onClick={() => { setValidationError(''); clearError(); }}
                                className="ml-2 text-red-400 hover:text-red-300 underline text-xs"
                            >
                                dismiss
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="reg-email" className="text-xs font-medium text-white/60 uppercase tracking-wider">
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
                            <label htmlFor="reg-password" className="text-xs font-medium text-white/60 uppercase tracking-wider">
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
                            <label htmlFor="reg-confirm" className="text-xs font-medium text-white/60 uppercase tracking-wider">
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
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-white/40">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
