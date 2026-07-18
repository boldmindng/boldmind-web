/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Loader2, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// ─── API helpers ──────────────────────────────────────────────────────────────

const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000/api/v1";

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
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
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(ref.current!);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  useEffect(
    () => () => {
      if (ref.current) clearInterval(ref.current);
    },
    [],
  );
  return { remaining, start, canResend: remaining === 0 };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// UPDATED — same rework as its Forgot/Change-password siblings: this page was
// hardcoded dark (`bg-white/5`, `text-white`, a blue icon badge unrelated to
// any product token) instead of using `--product-*`. It's nested inside
// AuthLayout's card, which is NOT guaranteed to be dark, so this was a real
// contrast risk, not just a style inconsistency.
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // FIX (TS18047): useSearchParams() types as ReadonlyURLSearchParams | null.
  const email = searchParams?.get("email") ?? "";
  const prefersReducedMotion = useReducedMotion();

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verified, setVerified] = useState(false);

  const cooldown = useResendCooldown(60);

  // ── Verify ───────────────────────────────────────────────────────────────
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setVerifyError("");

    if (!email) {
      toast.error("Email is missing. Please register again.");
      return;
    }
    if (code.length < 6) {
      setVerifyError("Please enter the full 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      await apiPost("/auth/verify-email", {
        email,
        code,
        purpose: "email_verify",
      });
      setVerified(true);
      toast.success("Email verified!");
      setTimeout(() => router.push("/onboarding"), 1500);
    } catch (err: any) {
      setVerifyError(
        err.message || "Verification failed. Check the code and try again.",
      );
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
      await apiPost("/auth/resend-verification", { email });
      toast.success("Verification email sent!");
      cooldown.start();
    } catch (err: any) {
      toast.error(err.message || "Failed to resend email");
    } finally {
      setIsResending(false);
    }
  };

  // ── Verified success ──────────────────────────────────────────────────────
  if (verified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border"
          style={{
            backgroundColor: "var(--color-success-light)",
            borderColor: "var(--color-success)",
          }}
        >
          <CheckCircle
            className="w-8 h-8"
            style={{ color: "var(--color-success)" }}
          />
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: "var(--product-foreground)" }}
        >
          Email Verified!
        </h2>
        <p
          className="text-sm"
          style={{ color: "var(--product-foreground)", opacity: 0.6 }}
        >
          Taking you to onboarding…
        </p>
      </motion.div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Icon + heading */}
      <div className="text-center mb-7">
        <motion.div
          initial={{ scale: prefersReducedMotion ? 1 : 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: prefersReducedMotion ? "tween" : "spring",
            duration: 0.5,
          }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5 border"
          style={{
            backgroundColor: "var(--product-highlight)",
            borderColor: "var(--product-muted)",
          }}
        >
          <Mail
            className="w-7 h-7"
            style={{ color: "var(--product-primary)" }}
          />
        </motion.div>

        <h1
          className="text-2xl font-bold mb-1.5"
          style={{ color: "var(--product-foreground)" }}
        >
          Check Your Email
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--product-foreground)", opacity: 0.6 }}
        >
          We sent a 6-digit code to{" "}
          <span
            className="font-medium"
            style={{ color: "var(--product-foreground)", opacity: 0.85 }}
          >
            {email || "your email"}
          </span>
        </p>
      </div>

      {/* Code input */}
      <form onSubmit={handleVerify}>
        <label
          className="text-xs font-medium mb-2 block"
          style={{ color: "var(--product-foreground)", opacity: 0.6 }}
        >
          Verification Code
        </label>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setVerifyError("");
            setCode(e.target.value.replace(/\D/g, ""));
          }}
          placeholder="123456"
          className="auth-input w-full mb-2 py-4 text-center text-2xl font-black tracking-[0.5em] placeholder:tracking-normal placeholder:font-normal"
        />

        {verifyError && (
          <p
            className="text-xs text-center mb-3"
            style={{ color: "var(--color-error)" }}
          >
            {verifyError}
          </p>
        )}

        <button
          type="submit"
          disabled={isVerifying || code.length < 6}
          className="auth-btn-primary w-full flex items-center justify-center gap-2 mt-1"
        >
          {isVerifying ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Verifying…
            </>
          ) : (
            "Verify Account"
          )}
        </button>
      </form>

      {/* Steps */}
      <div
        className="mt-6 pt-5 border-t space-y-3"
        style={{ borderColor: "var(--product-muted)" }}
      >
        <p
          className="text-[10px] uppercase tracking-widest font-bold"
          style={{ color: "var(--product-foreground)", opacity: 0.3 }}
        >
          Alternatively
        </p>
        <div className="flex gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--product-highlight)" }}
          >
            <Mail
              className="w-4 h-4"
              style={{ color: "var(--product-primary)" }}
            />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--product-foreground)" }}
            >
              Click the magic link
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--product-foreground)", opacity: 0.45 }}
            >
              You can also click the button in the email to verify instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Resend + back */}
      <div className="mt-6 text-center space-y-3">
        <p
          className="text-xs"
          style={{ color: "var(--product-foreground)", opacity: 0.35 }}
        >
          Didn&apos;t receive the email? Check your spam or{" "}
        </p>
        <button
          onClick={handleResend}
          disabled={isResending || !cooldown.canResend}
          className="flex items-center gap-2 mx-auto text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: "var(--product-primary)" }}
        >
          {isResending ? (
            <>
              <Loader2 size={13} className="animate-spin" /> Sending…
            </>
          ) : cooldown.remaining > 0 ? (
            <>
              <RefreshCw size={13} /> Resend in {cooldown.remaining}s
            </>
          ) : (
            "Resend Verification Email"
          )}
        </button>

        <Link
          href="/login"
          className="flex items-center gap-1.5 justify-center text-xs transition-colors"
          style={{ color: "var(--product-foreground)", opacity: 0.4 }}
        >
          <ArrowLeft size={12} /> Back to Login
        </Link>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
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
      <VerifyEmailContent />
    </Suspense>
  );
}
