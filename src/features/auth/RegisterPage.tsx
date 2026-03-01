import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type Step = 'email' | 'otp' | 'password';

export function RegisterPage() {
    const navigate = useNavigate();
    const { sendOtp, verifyOtp, register, isLoading, error, clearError } = useAuthStore();

    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [otpToken, setOtpToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendOtp = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setValidationError('');

        if (!email.trim()) {
            setValidationError('Email is required');
            return;
        }

        try {
            await sendOtp({ email, purpose: 'signup' });
            setOtpSent(true);
            setStep('otp');
            setCountdown(60);
            // Focus first OTP input
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch {
            // Error handled by store
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only digits

        const newDigits = [...otpDigits];
        newDigits[index] = value.slice(-1); // Only last digit
        setOtpDigits(newDigits);

        // Auto-advance to next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits filled
        if (newDigits.every((d) => d) && newDigits.join('').length === 6) {
            handleVerifyOtp(newDigits.join(''));
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
            const digits = pasted.split('');
            setOtpDigits(digits);
            otpRefs.current[5]?.focus();
            handleVerifyOtp(pasted);
        }
    };

    const handleVerifyOtp = async (code: string) => {
        clearError();
        try {
            const result = await verifyOtp({ email, code, purpose: 'signup' });
            if (result.otpToken) {
                setOtpToken(result.otpToken);
                setStep('password');
            }
        } catch {
            // Error handled by store
        }
    };

    const handleSetPassword = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
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
            await register({ email, password, otpToken });
            navigate('/chat');
        } catch {
            // Error handled by store
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        clearError();
        try {
            await sendOtp({ email, purpose: 'signup' });
            setOtpDigits(['', '', '', '', '', '']);
            setCountdown(60);
            otpRefs.current[0]?.focus();
        } catch {
            // Error handled by store
        }
    };

    const displayError = validationError || error;

    const stepIndicator = (
        <div className="flex items-center justify-center gap-2 mb-5">
            {(['email', 'otp', 'password'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                    <div
                        className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                            step === s
                                ? 'scale-110'
                                : s === 'email' && (step === 'otp' || step === 'password')
                                    ? ''
                                    : s === 'otp' && step === 'password'
                                        ? ''
                                        : '',
                        )}
                        style={{
                            background: step === s
                                ? 'linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))'
                                : (s === 'email' && step !== 'email') || (s === 'otp' && step === 'password')
                                    ? 'var(--online-color)'
                                    : 'rgba(255,255,255,0.06)',
                            color: step === s || (s === 'email' && step !== 'email') || (s === 'otp' && step === 'password')
                                ? '#fff'
                                : 'var(--text-muted)',
                            boxShadow: step === s ? '0 4px 14px var(--active-gradient-from)' : 'none',
                        }}
                    >
                        {(s === 'email' && step !== 'email') || (s === 'otp' && step === 'password')
                            ? <CheckCircle2 className="h-4 w-4" />
                            : i + 1}
                    </div>
                    {i < 2 && (
                        <div
                            className="w-8 h-0.5 rounded"
                            style={{
                                backgroundColor: (i === 0 && (step === 'otp' || step === 'password')) || (i === 1 && step === 'password')
                                    ? 'var(--online-color)'
                                    : 'rgba(255,255,255,0.08)',
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );

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
                        {step === 'email' && <Mail className="h-8 w-8 text-white" />}
                        {step === 'otp' && <ShieldCheck className="h-8 w-8 text-white" />}
                        {step === 'password' && <Sparkles className="h-8 w-8 text-white" />}
                    </div>
                    <CardTitle>
                        <span className="text-gradient">
                            {step === 'email' && 'Join the vybe'}
                            {step === 'otp' && 'Check your email'}
                            {step === 'password' && 'Set your password'}
                        </span>{' '}
                        {step === 'email' && '🎉'}
                        {step === 'otp' && '📧'}
                        {step === 'password' && '🔐'}
                    </CardTitle>
                    <CardDescription>
                        {step === 'email' && 'Enter your email to get started'}
                        {step === 'otp' && `We sent a 6-digit code to ${email}`}
                        {step === 'password' && 'Almost there! Create a secure password'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                    {stepIndicator}

                    {displayError && (
                        <div className="mb-4 rounded-2xl px-4 py-3 text-sm animate-slide-up"
                            style={{
                                backgroundColor: 'var(--danger-bg)',
                                border: `1px solid var(--danger-border)`,
                                color: 'var(--danger-text)',
                            }}
                        >
                            <span>{displayError}</span>
                            <button onClick={() => { setValidationError(''); clearError(); }}
                                className="ml-2 underline text-xs transition-colors opacity-80 hover:opacity-100">
                                dismiss
                            </button>
                        </div>
                    )}

                    {/* ─── Step 1: Email ─────────────────────── */}
                    {step === 'email' && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
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
                                    autoFocus
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                Verify Email <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </form>
                    )}

                    {/* ─── Step 2: OTP ───────────────────────── */}
                    {step === 'otp' && (
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
                                    <button
                                        onClick={handleResendOtp}
                                        className="text-xs font-semibold transition-colors"
                                        style={{ color: 'var(--accent)' }}
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <Button
                                onClick={() => handleVerifyOtp(otpDigits.join(''))}
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                                disabled={otpDigits.some((d) => !d)}
                            >
                                Verify Code <ShieldCheck className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}

                    {/* ─── Step 3: Password ──────────────────── */}
                    {step === 'password' && (
                        <form onSubmit={handleSetPassword} className="space-y-4">
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
                                    autoFocus
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
                                Create Account 🚀
                            </Button>
                        </form>
                    )}

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
