import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { User, Lock, MessageCircle } from 'lucide-react';

export function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate('/chat');
        } catch {
            // Error is already set in the store
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
            {/* Ambient background glow */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-emerald-600/10 blur-[120px]" />
                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-teal-600/10 blur-[120px]" />
            </div>

            <Card variant="glass" className="relative w-full max-w-md border-white/[0.08] shadow-2xl shadow-black/40">
                <CardHeader className="items-center text-center pb-2">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                        <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>Sign in to continue chatting</CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    {error && (
                        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                            <button onClick={clearError} className="ml-2 text-red-400 hover:text-red-300 underline text-xs">
                                dismiss
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="login-username" className="text-xs font-medium text-white/60 uppercase tracking-wider">
                                Username / Email
                            </label>
                            <Input
                                id="login-username"
                                type="text"
                                placeholder="you@example.com"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                icon={<User className="h-4 w-4" />}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="login-password" className="text-xs font-medium text-white/60 uppercase tracking-wider">
                                Password
                            </label>
                            <Input
                                id="login-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="h-4 w-4" />}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-white/40">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                            Create one
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
