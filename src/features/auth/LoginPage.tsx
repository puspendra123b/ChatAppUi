import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { User, Lock, Mail, Sparkles, ShieldCheck, KeyRound } from 'lucide-react';
import { cn } from '@/utils/cn';

type LoginMode = 'password' | 'otp';
type OtpStep = 'email' | 'code';

export function LoginPage() {
    const navigate = useNavigate();
    const { login, sendOtp, loginWithOtp, isLoading, error, clearError } = useAuthStore();

    const [mode, setMode] = useState<LoginMode>('password');
    const [otpStep, setOtpStep] = useState<OtpStep>('email');

    // Password mode
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // OTP mode
    const [otpEmail, setOtpEmail] = useState('');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(0);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer
    useState(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    });

    const handlePasswordLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate('/chat');
        } catch {
            // Error is in the store
        }
    };

    const handleSendLoginOtp = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        try {
            await sendOtp({ email: otpEmail, purpose: 'login' });
            setOtpStep('code');
            setCountdown(60);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch {
            // Error is in the store
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...otpDigits];
        newDigits[index] = value.slice(-1);
        setOtpDigits(newDigits);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        if (newDigits.every((d) => d) && newDigits.join('').length === 6) {
            handleVerifyLoginOtp(newDigits.join(''));
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtpDigits(pasted.split(''));
            otpRefs.current[5]?.focus();
            handleVerifyLoginOtp(pasted);
        }
    };

    const handleVerifyLoginOtp = async (code: string) => {
        try {
            await loginWithOtp({ email: otpEmail, code, purpose: 'login' });
            navigate('/chat');
        } catch {
            // Error is in the store
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        clearError();
        try {
            await sendOtp({ email: otpEmail, purpose: 'login' });
            setOtpDigits(['', '', '', '', '', '']);
            setCountdown(60);
            otpRefs.current[0]?.focus();
        } catch {
            // handled
        }
    };

    const switchMode = (newMode: LoginMode) => {
        clearError();
        setMode(newMode);
        setOtpStep('email');
        setOtpDigits(['', '', '', '', '', '']);
    };

    return (
        <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6 overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {/* Animated background blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 h-64 w-64 sm:h-96 sm:w-96 rounded-full blur-[100px] animate-blob"
                    style={{ backgroundColor: 'var(--blob-color-1)' }} />
                <div className="absolute top-1/2 -right-32 h-64 w-64 sm:h-80 sm:w-80 rounded-full blur-[100px] animate-blob animation-delay-2000"
                    style={{ backgroundColor: 'var(--blob-color-2)' }} />
                <div className="absolute -bottom-32 left-1/3 h-64 w-64 sm:h-72 sm:w-72 rounded-full blur-[100px] animate-blob animation-delay-4000"
                    style={{ backgroundColor: 'var(--blob-color-3)' }} />
            </div>

            <Card variant="glass" className="relative w-full max-w-md shadow-2xl animate-slide-up">
                <CardHeader className="items-center text-center pb-2">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))`,
                            boxShadow: `0 8px 24px var(--active-gradient-from)`,
                        }}
                    >
                        {mode === 'password'
                            ? <Sparkles className="h-8 w-8 text-white" />
                            : otpStep === 'email'
                                ? <Mail className="h-8 w-8 text-white" />
                                : <ShieldCheck className="h-8 w-8 text-white" />
                        }
                    </div>
                    <CardTitle>
                        <span className="text-gradient">Welcome back</span> ✨
                    </CardTitle>
                    <CardDescription>
                        {mode === 'password'
                            ? 'Sign in to vybe with your crew'
                            : otpStep === 'email'
                                ? 'We\'ll send a code to your email'
                                : `Enter the code sent to ${otpEmail}`
                        }
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    {/* ─── Mode Toggle ──────────────────────── */}
                    <div className="flex rounded-xl overflow-hidden mb-5"
                        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}
                    >
                        {([
                            { key: 'password' as const, label: 'Password', icon: KeyRound },
                            { key: 'otp' as const, label: 'Email OTP', icon: Mail },
                        ]).map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => switchMode(key)}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all duration-200',
                                )}
                                style={{
                                    backgroundColor: mode === key ? 'var(--active-gradient-from)' : 'transparent',
                                    color: mode === key ? 'var(--text-primary)' : 'var(--text-muted)',
                                    borderRight: key === 'password' ? '1px solid var(--border-subtle)' : 'none',
                                }}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 rounded-2xl px-4 py-3 text-sm animate-slide-up"
                            style={{
                                backgroundColor: 'var(--danger-bg)',
                                border: `1px solid var(--danger-border)`,
                                color: 'var(--danger-text)',
                            }}
                        >
                            <span>{error}</span>
                            <button onClick={clearError} className="ml-2 underline text-xs transition-colors opacity-80 hover:opacity-100">
                                dismiss
                            </button>
                        </div>
                    )}

                    {/* ─── Password Mode ────────────────────── */}
                    {mode === 'password' && (
                        <form onSubmit={handlePasswordLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="login-username" className="text-xs font-semibold uppercase tracking-widest"
                                    style={{ color: 'var(--text-muted)' }}>
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
                                <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-widest"
                                    style={{ color: 'var(--text-muted)' }}>
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
                                Let's Go 🚀
                            </Button>
                        </form>
                    )}

                    {/* ─── OTP Mode: Email Step ─────────────── */}
                    {mode === 'otp' && otpStep === 'email' && (
                        <form onSubmit={handleSendLoginOtp} className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="otp-email" className="text-xs font-semibold uppercase tracking-widest"
                                    style={{ color: 'var(--text-muted)' }}>
                                    Email
                                </label>
                                <Input
                                    id="otp-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={otpEmail}
                                    onChange={(e) => setOtpEmail(e.target.value)}
                                    icon={<Mail className="h-4 w-4" />}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                Send OTP 📧
                            </Button>
                        </form>
                    )}

                    {/* ─── OTP Mode: Code Step ──────────────── */}
                    {mode === 'otp' && otpStep === 'code' && (
                        <div className="space-y-5">
                            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                                {otpDigits.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { otpRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className={cn(
                                            'h-14 w-12 rounded-xl text-center text-xl font-bold',
                                            'focus:outline-none focus:ring-2 transition-all duration-200',
                                        )}
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.04)',
                                            border: digit ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                            '--tw-ring-color': 'var(--border-active)',
                                        } as React.CSSProperties}
                                    />
                                ))}
                            </div>

                            <div className="text-center">
                                {countdown > 0 ? (
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        Resend code in <span style={{ color: 'var(--accent)' }}>{countdown}s</span>
                                    </p>
                                ) : (
                                    <button onClick={handleResendOtp}
                                        className="text-xs font-semibold transition-colors"
                                        style={{ color: 'var(--accent)' }}>
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <Button
                                onClick={() => handleVerifyLoginOtp(otpDigits.join(''))}
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                disabled={otpDigits.some((d) => !d)}
                            >
                                Sign In <ShieldCheck className="h-4 w-4 ml-1" />
                            </Button>

                            <button
                                onClick={() => { setOtpStep('email'); setOtpDigits(['', '', '', '', '', '']); clearError(); }}
                                className="w-full text-xs text-center transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                ← Use a different email
                            </button>
                        </div>
                    )}

                    <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        New here?{' '}
                        <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--accent)' }}>
                            Create an account
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
