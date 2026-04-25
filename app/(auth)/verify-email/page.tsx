'use client';


import { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ─── API helpers ──────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:4000/api/v1';

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method:      'POST',
    credentials: 'include',
    headers:     { 'Content-Type': 'application/json', Accept: 'application/json' },
    body:        JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ─── Resend cooldown hook ─────────────────────────────────────────────────────

function useResendCooldown(seconds = 60) {
  const [remaining, setRemaining] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setRemaining(seconds);
    ref.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(ref.current!); return 0; }
        return r - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (ref.current) clearInterval(ref.current); }, []);
  return { remaining, start, canResend: remaining === 0 };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
 function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const email        = searchParams.get('email') ?? '';

  const [code,        setCode]        = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verified,    setVerified]    = useState(false);

  const cooldown = useResendCooldown(60);

  // ── Verify ───────────────────────────────────────────────────────────────
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setVerifyError('');

    if (!email) {
      toast.error('Email is missing. Please register again.');
      return;
    }
    if (code.length < 6) {
      setVerifyError('Please enter the full 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      await apiPost('/auth/verify-email', { email, code });
      setVerified(true);
      toast.success('Email verified!');
      setTimeout(() => router.push('/onboarding'), 1500);
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed. Check the code and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (code.length === 6 && !isVerifying) handleVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // ── Resend ───────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!email || !cooldown.canResend) return;
    setIsResending(true);
    try {
      await apiPost('/auth/resend-verification', { email });
      toast.success('Verification email sent!');
      cooldown.start();
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  // ── Verified success ──────────────────────────────────────────────────────
  if (verified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-500/25">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
        <p className="text-white/45 text-sm">Taking you to onboarding…</p>
      </motion.div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Icon + heading */}
      <div className="text-center mb-7">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/15 border border-blue-500/25 mb-5"
        >
          <Mail className="w-7 h-7 text-blue-400" />
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-1.5">Check Your Email</h1>
        <p className="text-white/45 text-sm">
          We sent a 6-digit code to{' '}
          <span className="text-white/70 font-medium">{email || 'your email'}</span>
        </p>
      </div>

      {/* Code input */}
      <form onSubmit={handleVerify}>
        <label className="text-white/50 text-xs font-medium mb-2 block">
          Verification Code
        </label>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={e => {
            setVerifyError('');
            setCode(e.target.value.replace(/\D/g, ''));
          }}
          placeholder="123456"
          className="w-full mb-2 py-4 px-4 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-black tracking-[0.5em] text-white focus:border-amber-400/50 focus:outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-white/20"
        />

        {verifyError && (
          <p className="text-red-400 text-xs text-center mb-3">{verifyError}</p>
        )}

        <button
          type="submit"
          disabled={isVerifying || code.length < 6}
          className="w-full py-3 rounded-xl font-semibold bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm mt-1"
        >
          {isVerifying
            ? <><Loader2 size={16} className="animate-spin" /> Verifying…</>
            : 'Verify Account'
          }
        </button>
      </form>

      {/* Steps */}
      <div className="mt-6 pt-5 border-t border-white/6 space-y-3">
        <p className="text-white/25 text-[10px] uppercase tracking-widest font-bold">Alternatively</p>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Click the magic link</p>
            <p className="text-xs text-white/40">You can also click the button in the email to verify instantly.</p>
          </div>
        </div>
      </div>

      {/* Resend + back */}
      <div className="mt-6 text-center space-y-3">
        <p className="text-white/30 text-xs">
          Didn't receive the email? Check your spam or{' '}
        </p>
        <button
          onClick={handleResend}
          disabled={isResending || !cooldown.canResend}
          className="flex items-center gap-2 mx-auto text-amber-400 hover:text-amber-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isResending
            ? <><Loader2 size={13} className="animate-spin" /> Sending…</>
            : cooldown.remaining > 0
              ? <><RefreshCw size={13} /> Resend in {cooldown.remaining}s</>
              : 'Resend Verification Email'
          }
        </button>

        <Link
          href="/login"
          className="flex items-center gap-1.5 justify-center text-white/30 hover:text-white/55 text-xs transition-colors"
        >
          <ArrowLeft size={12} /> Back to Login
        </Link>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-white/50">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}