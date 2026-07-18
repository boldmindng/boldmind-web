/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useForgotPassword } from "../../../lib/hooks";
import { LoadingSpinner } from "@boldmindng/ui";

/**
 * UPDATED — this page (and its ChangePassword/VerifyEmail siblings) had
 * drifted onto a completely separate, hardcoded dark theme: `bg-white/5`,
 * `text-white`, `bg-amber-400 text-black`, raw `border-white/10`, etc. That
 * assumes it's always rendered on a dark surface — but it's nested inside
 * AuthLayout's card, which is built from `--product-background`/
 * `--product-foreground` and is NOT guaranteed to be dark (boldmind-hub's
 * light mode renders that card close to white). White text on white/5 over a
 * light background is close to unreadable. Rebuilt on the same token system
 * every sibling auth page already uses, plus the shared `.auth-input` /
 * `.auth-btn-primary` classes and `LoadingSpinner` instead of three
 * independently hand-rolled versions of the same things.
 */
function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const forgotMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // FIX: the old code did `await forgotMutation.execute(...)` then immediately
    // read `forgotMutation.error` in the SAME render — but that state update from
    // execute() hasn't flowed back into this closure yet, so a failed request could
    // still show "email sent!" to the user. Wrapping in try/catch and treating a
    // thrown error as the failure signal removes that race.
    // NOTE: this assumes `execute` rethrows on failure. If `lib/hooks`'s
    // `useForgotPassword` swallows errors internally instead of throwing, share
    // that hook and I'll patch it at the source — that's the more correct fix.
    try {
      await forgotMutation.execute(email.trim());
      setEmailSent(true);
      toast.success("Password reset email sent!");
    } catch (err: any) {
      toast.error(
        err?.message ||
          forgotMutation.error?.message ||
          "Failed to send reset email",
      );
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 border"
          style={{
            backgroundColor: "var(--color-success-light)",
            borderColor: "var(--color-success)",
          }}
        >
          <CheckCircle
            className="w-7 h-7"
            style={{ color: "var(--color-success)" }}
          />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--product-foreground)" }}
        >
          Check Your Email
        </h1>

        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: "var(--product-foreground)", opacity: 0.6 }}
        >
          We&apos;ve sent a password reset link to{" "}
          <strong style={{ color: "var(--product-foreground)" }}>
            {email}
          </strong>
          . Click the link in the email to reset your password.
        </p>

        <div className="space-y-4">
          <p
            className="text-xs"
            style={{ color: "var(--product-foreground)", opacity: 0.4 }}
          >
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => {
                setEmailSent(false);
                forgotMutation.reset();
              }}
              className="font-medium transition-colors"
              style={{ color: "var(--product-primary)" }}
            >
              try again
            </button>
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--product-foreground)", opacity: 0.5 }}
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
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-7">
        <h1
          className="text-2xl font-bold mb-1.5"
          style={{ color: "var(--product-foreground)" }}
        >
          Reset Your Password
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--product-foreground)", opacity: 0.55 }}
        >
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-xs font-medium mb-1.5 block"
            style={{ color: "var(--product-foreground)", opacity: 0.6 }}
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--product-foreground)", opacity: 0.35 }}
            />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                forgotMutation.reset();
              }}
              required
              placeholder="you@example.com"
              className="auth-input pl-9"
            />
          </div>
        </div>

        {forgotMutation.error && (
          <p
            className="text-xs rounded-lg px-3 py-2"
            style={{
              color: "var(--color-error)",
              backgroundColor: "var(--color-error-light)",
            }}
          >
            {forgotMutation.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={forgotMutation.loading}
          className="auth-btn-primary w-full flex items-center justify-center gap-2"
        >
          {forgotMutation.loading && (
            <LoadingSpinner size="sm" color="currentColor" />
          )}
          {forgotMutation.loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--product-foreground)", opacity: 0.5 }}
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
    <Suspense
      fallback={
        <div
          className="text-center text-sm"
          style={{ color: "var(--product-foreground)", opacity: 0.5 }}
        >
          Loading...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
