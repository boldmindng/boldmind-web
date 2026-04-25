'use client';


import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForgotPassword } from '../../../lib/hooks';

function ForgotPasswordContent() {
  const [email,     setEmail]     = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const forgotMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await forgotMutation.execute(email.trim());
    if (!forgotMutation.error) {
      setEmailSent(true);
      toast.success('Password reset email sent!');
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-14 h-14 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/25">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Check Your Email</h1>

        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          We've sent a password reset link to{' '}
          <strong className="text-white">{email}</strong>.
          Click the link in the email to reset your password.
        </p>

        <div className="space-y-4">
          <p className="text-xs text-white/35">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => { setEmailSent(false); forgotMutation.reset(); }}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              try again
            </button>
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-white/35 hover:text-white/60 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-white mb-1.5">Reset Your Password</h1>
        <p className="text-white/45 text-sm">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-white/50 text-xs font-medium mb-1.5 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); forgotMutation.reset(); }}
              required
              placeholder="you@example.com"
              className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/50 text-sm transition-colors"
            />
          </div>
        </div>

        {forgotMutation.error && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {forgotMutation.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={forgotMutation.loading}
          className="w-full py-3 rounded-xl font-semibold bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
        >
          {forgotMutation.loading ? (
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : null}
          {forgotMutation.loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-white/35 hover:text-white/60 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-white/50">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}