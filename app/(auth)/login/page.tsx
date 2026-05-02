'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLogin, useRegister } from '../../../lib/hooks';

type AuthMode = 'choose' | 'email' | 'whatsapp-phone' | 'whatsapp-otp';
type Flow     = 'login' | 'register';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.boldmind.ng';
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || 'https://boldmind.ng';

const brand = {
  primary:   'var(--product-primary)',
  secondary: 'var(--product-secondary)',
  fg:        'var(--product-foreground)',
} as const;

function LoginContent() {
  const router      = useRouter();
  const params      = useSearchParams();
  const redirectUrl = params.get('return_url') || params.get('redirect') || `${HUB_URL}/dashboard`;
  const isExternal  = params.get('external') === '1';

  const [mode, setMode] = useState<AuthMode>('choose');
  const [flow, setFlow] = useState<Flow>('login');

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const [phone,          setPhone]          = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [otp,            setOtp]            = useState(['', '', '', '', '', '']);
  const otpRefs                             = useRef<(HTMLInputElement | null)[]>([]);
  const [otpTimer,   setOtpTimer]   = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError,   setOtpError]   = useState('');

  const loginMutation    = useLogin();
  const registerMutation = useRegister();
  const isLoading        = loginMutation.loading || registerMutation.loading;
  const apiError         = loginMutation.error?.message || registerMutation.error?.message || '';

  useEffect(() => {
    if (otpTimer <= 0) return;
    const id = setTimeout(() => setOtpTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [otpTimer]);

  useEffect(() => {
    loginMutation.reset();
    registerMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, flow]);

  const handleRedirect = (user: { profile?: { onboardingDone?: boolean } }) => {
    if (!user.profile?.onboardingDone) {
      router.push('/onboarding');
      return;
    }
    window.location.href = redirectUrl;
  };

  const loginWithGoogle = () => {
    const url = new URL(`${API_URL}/auth/google`);
    url.searchParams.set('redirect', redirectUrl);
    if (isExternal) url.searchParams.set('external', '1');
    window.location.href = url.toString();
  };

  const loginWithFacebook = () => {
    const url = new URL(`${API_URL}/auth/facebook`);
    url.searchParams.set('redirect', redirectUrl);
    if (isExternal) url.searchParams.set('external', '1');
    window.location.href = url.toString();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = flow === 'login' ? loginMutation : registerMutation;
    const user = await mutation.execute({ email, password });
    if (user) handleRedirect(user as any);
  };

  const sendWhatsAppOTP = async () => {
    if (!phone) return;
    setOtpError('');
    setOtpLoading(true);

    let normalised = phone.replace(/\s/g, '');
    if (normalised.startsWith('0'))  normalised = `+234${normalised.slice(1)}`;
    if (!normalised.startsWith('+')) normalised = `+234${normalised}`;

    try {
      const res = await fetch(`${API_URL}/auth/whatsapp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalised }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setOtpError(message || 'Failed to send OTP');
        return;
      }
      const { verificationId: vid } = await res.json();
      setVerificationId(vid);
      setOtpTimer(60);
      setMode('whatsapp-otp');
    } catch {
      setOtpError('Failed to send OTP. Check your number.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/whatsapp/verify-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, otp: code }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setOtpError(message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
        return;
      }
      const { user } = await res.json();
      handleRedirect(user);
    } catch {
      setOtpError('Verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    if (otp.every(d => d !== '') && mode === 'whatsapp-otp') {
      verifyOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  // ── Mode: choose ──────────────────────────────────────────────────────────
  if (mode === 'choose') {
    return (
      <>
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold mb-1.5" style={{ color: brand.fg }}>
            {flow === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm" style={{ color: `color-mix(in srgb, ${brand.fg} 45%, transparent)` }}>
            {flow === 'login'
              ? 'Log in to access all your BoldMind products'
              : 'One account. 32+ products. All yours.'}
          </p>
        </div>

        <div className="space-y-2.5 mb-6">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all"
            style={{
              border: `1px solid color-mix(in srgb, ${brand.fg} 10%, transparent)`,
              background: `color-mix(in srgb, ${brand.fg} 4%, transparent)`,
              color: brand.fg,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `color-mix(in srgb, ${brand.fg} 8%, transparent)`)}
            onMouseLeave={e => (e.currentTarget.style.background = `color-mix(in srgb, ${brand.fg} 4%, transparent)`)}
          >
            <GoogleIcon /> Continue with Google
          </button>
          <button
            onClick={loginWithFacebook}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-blue-500/30 bg-blue-500/8 hover:bg-blue-500/15 hover:border-blue-500/50 transition-all font-medium text-sm"
            style={{ color: brand.fg }}
          >
            <FacebookIcon /> Continue with Facebook
          </button>
          <button
            onClick={() => setMode('whatsapp-phone')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-green-500/30 bg-green-500/8 hover:bg-green-500/15 hover:border-green-500/50 transition-all font-medium text-sm"
            style={{ color: brand.fg }}
          >
            <WhatsAppIcon /> Continue with WhatsApp
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: `color-mix(in srgb, ${brand.fg} 8%, transparent)` }} />
          <span className="text-xs" style={{ color: `color-mix(in srgb, ${brand.fg} 25%, transparent)` }}>or</span>
          <div className="flex-1 h-px" style={{ background: `color-mix(in srgb, ${brand.fg} 8%, transparent)` }} />
        </div>

        <button
          onClick={() => setMode('email')}
          className="w-full py-3 px-4 rounded-xl text-sm font-medium transition-all"
          style={{
            border: `1px solid color-mix(in srgb, ${brand.fg} 8%, transparent)`,
            background: `color-mix(in srgb, ${brand.fg} 2%, transparent)`,
            color: `color-mix(in srgb, ${brand.fg} 60%, transparent)`,
          }}
        >
          Continue with Email
        </button>

        <p className="text-center text-sm mt-5" style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}>
          {flow === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setFlow(f => f === 'login' ? 'register' : 'login')}
            className="font-medium transition-colors"
            style={{ color: brand.secondary }}
          >
            {flow === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>

        {redirectUrl !== `${HUB_URL}/dashboard` && (
          <p className="text-center text-xs mt-4" style={{ color: `color-mix(in srgb, ${brand.fg} 20%, transparent)` }}>
            After login, you'll be taken to{' '}
            <span style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}>
              {new URL(redirectUrl).hostname}
            </span>
          </p>
        )}
      </>
    );
  }

  // ── Mode: email form ──────────────────────────────────────────────────────
  if (mode === 'email') {
    return (
      <>
        <button
          onClick={() => setMode('choose')}
          className="text-sm mb-5 flex items-center gap-1 transition-colors"
          style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}
        >
          ← Back
        </button>

        <h2 className="text-xl font-bold mb-5" style={{ color: brand.fg }}>
          {flow === 'login' ? 'Log in with email' : 'Sign up with email'}
        </h2>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <InputField
            label="Email address" type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <InputField
            label="Password" type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {flow === 'login' && (
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-xs transition-colors"
                style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}
              >
                Forgot password?
              </a>
            </div>
          )}

          {apiError && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
            style={{
              background: brand.secondary,
              color: brand.primary,
            }}
          >
            {isLoading
              ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              : flow === 'login' ? 'Log in' : 'Create account'
            }
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: `color-mix(in srgb, ${brand.fg} 30%, transparent)` }}>
          {flow === 'login' ? 'No account? ' : 'Have an account? '}
          <button
            onClick={() => setFlow(f => f === 'login' ? 'register' : 'login')}
            className="transition-colors"
            style={{ color: brand.secondary }}
          >
            {flow === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </>
    );
  }

  // ── Mode: WhatsApp — enter phone ──────────────────────────────────────────
  if (mode === 'whatsapp-phone') {
    return (
      <>
        <button
          onClick={() => setMode('choose')}
          className="text-sm mb-5 flex items-center gap-1 transition-colors"
          style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}
        >
          ← Back
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-green-500/15 rounded-2xl flex items-center justify-center">
            <WhatsAppIcon size={28} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-1.5" style={{ color: brand.fg }}>Enter your number</h2>
        <p className="text-sm text-center mb-6" style={{ color: `color-mix(in srgb, ${brand.fg} 40%, transparent)` }}>
          We'll send a 6-digit code to your WhatsApp
        </p>

        <div className="flex gap-2 mb-4">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm whitespace-nowrap"
            style={{
              background: `color-mix(in srgb, ${brand.fg} 5%, transparent)`,
              border: `1px solid color-mix(in srgb, ${brand.fg} 10%, transparent)`,
              color: `color-mix(in srgb, ${brand.fg} 60%, transparent)`,
            }}
          >
            🇳🇬 +234
          </div>
          <input
            type="tel" value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="08012345678"
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={{
              background: `color-mix(in srgb, ${brand.fg} 5%, transparent)`,
              border: `1px solid color-mix(in srgb, ${brand.fg} 10%, transparent)`,
              color: brand.fg,
            }}
          />
        </div>

        {otpError && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-3">
            {otpError}
          </p>
        )}

        <button
          onClick={sendWhatsAppOTP}
          disabled={!phone || otpLoading}
          className="w-full py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
        >
          {otpLoading
            ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            : 'Send WhatsApp Code'
          }
        </button>
      </>
    );
  }

  // ── Mode: WhatsApp — enter OTP ────────────────────────────────────────────
  return (
    <>
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-green-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <WhatsAppIcon size={28} />
        </div>
        <h2 className="text-xl font-bold mb-1.5" style={{ color: brand.fg }}>Check your WhatsApp</h2>
        <p className="text-sm" style={{ color: `color-mix(in srgb, ${brand.fg} 40%, transparent)` }}>
          Sent a 6-digit code to <span style={{ color: `color-mix(in srgb, ${brand.fg} 70%, transparent)` }}>{phone}</span>
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-5">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { otpRefs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e => handleOTPChange(i, e.target.value)}
            onKeyDown={e => handleOTPKeyDown(i, e)}
            className="w-11 h-14 text-center text-xl font-bold rounded-xl outline-none transition-all"
            style={{
              background: `color-mix(in srgb, ${brand.fg} 5%, transparent)`,
              border: `1px solid ${digit ? brand.secondary : `color-mix(in srgb, ${brand.fg} 10%, transparent)`}`,
              color: brand.fg,
            }}
          />
        ))}
      </div>

      {otpError && (
        <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-3 text-center">
          {otpError}
        </p>
      )}

      {otpLoading && (
        <div className="flex justify-center mb-3">
          <span
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{
              borderColor: `color-mix(in srgb, ${brand.secondary} 30%, transparent)`,
              borderTopColor: brand.secondary,
            }}
          />
        </div>
      )}

      <div className="text-center">
        {otpTimer > 0 ? (
          <p className="text-sm" style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}>
            Resend in <span className="tabular-nums" style={{ color: `color-mix(in srgb, ${brand.fg} 60%, transparent)` }}>{otpTimer}s</span>
          </p>
        ) : (
          <button
            onClick={() => { setOtp(['', '', '', '', '', '']); sendWhatsAppOTP(); }}
            className="text-sm transition-colors"
            style={{ color: brand.secondary }}
          >
            Resend code
          </button>
        )}
      </div>

      <button
        onClick={() => { setMode('whatsapp-phone'); setOtp(['', '', '', '', '', '']); }}
        className="text-xs transition-colors mt-4 w-full text-center"
        style={{ color: `color-mix(in srgb, ${brand.fg} 30%, transparent)` }}
      >
        Wrong number? Change it
      </button>
    </>
  );
}

// ─── Shared input field ───────────────────────────────────────────────────────

function InputField({
  label, type, value, onChange, placeholder,
}: {
  label: string; type: string;
  value: string; onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}) {
  const fg = 'var(--product-foreground)';
  return (
    <div>
      <label
        className="text-xs font-medium mb-1.5 block"
        style={{ color: `color-mix(in srgb, ${fg} 50%, transparent)` }}
      >
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
        style={{
          background: `color-mix(in srgb, ${fg} 5%, transparent)`,
          border: `1px solid color-mix(in srgb, ${fg} 10%, transparent)`,
          color: fg,
        }}
      />
    </div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#1877F2"/>
      <path d="M12.5 9H10V7.5c0-.552.448-.75 1-.75h1V5h-1.5C9.119 5 8 6.119 8 7.5V9H6.5v2H8v5h2v-5h1.5l1-2z" fill="white"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#25D366"/>
      <path d="M13.5 11.5c-.3-.15-1.8-.9-2.1-.975-.3-.075-.525-.15-.75.15-.225.3-.825.975-1.05 1.2-.225.225-.375.225-.675.075-.3-.15-1.275-.45-2.4-1.425-.9-.825-1.5-1.8-1.65-2.1-.15-.3 0-.45.15-.6l.45-.525c.15-.15.15-.3.225-.45.075-.15 0-.3-.075-.45l-.9-2.1c-.225-.525-.45-.45-.675-.45H4.5c-.225 0-.525.075-.825.375C3.375 5.025 2.625 5.7 2.625 7.275c0 1.575 1.2 3.075 1.35 3.3.15.225 2.25 3.525 5.475 4.8.75.3 1.35.45 1.8.6.75.225 1.425.2 1.95.15.6-.075 1.8-.75 2.025-1.5.225-.75.225-1.35.15-1.5-.075-.075-.225-.15-.525-.3z" fill="white"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center" style={{ color: 'var(--product-foreground)' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
