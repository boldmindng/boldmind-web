/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useResetPassword } from "../../../lib/hooks";
import { LoadingSpinner } from "@boldmindng/ui";

function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pwd)) return "Must contain at least one uppercase letter";
  if (!/[a-z]/.test(pwd)) return "Must contain at least one lowercase letter";
  if (!/[0-9]/.test(pwd)) return "Must contain at least one number";
  return null;
}

// Same rework as ForgotPasswordPage: token-based colors and the shared
// `.auth-input` / `.auth-btn-primary` / `LoadingSpinner` instead of a
// hardcoded dark theme that assumed it always renders on a dark surface.
function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const email = searchParams?.get("email") ?? "";
  const prefersReducedMotion = useReducedMotion();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetMutation = useResetPassword();

  useEffect(() => {
    if (!token || !email)
      setFieldError("Invalid or missing reset link. Please request a new one.");
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");
    resetMutation.reset();

    const pwdError = validatePassword(password);
    if (pwdError) {
      setFieldError(pwdError);
      return;
    }
    if (password !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }
    if (!token) {
      setFieldError("Missing reset token");
      return;
    }
    if (!email) {
      setFieldError(
        "Missing email. Please use the link from your reset email.",
      );
      return;
    }

    // FIX: same stale-state race as forgot-password — `resetMutation.error` read
    // right after `await execute(...)` reflects the PREVIOUS render, not the
    // outcome of this call. That meant a failed reset could still flip to the
    // "Password Changed!" success screen. try/catch on the awaited call is the
    // reliable signal (useMutation's execute() rethrows on failure).
    //
    // NOTE: only `token` + `password` are sent — authAPI.resetPassword's
    // confirmed payload shape is { token, password }, no email field. `email`
    // is still read from the URL purely for display/validation on this page.
    try {
      await resetMutation.execute(token, password, confirmPassword);
      setSuccess(true);
      toast.success("Password changed successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error(
        err?.message ||
          resetMutation.error?.message ||
          "Failed to change password",
      );
    }
  };

  const error = fieldError || resetMutation.error?.message || "";

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
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
          Password Changed!
        </h1>
        <p
          className="text-sm mb-4"
          style={{ color: "var(--product-foreground)", opacity: 0.6 }}
        >
          Your password has been successfully updated. You can now log in with
          your new password.
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--product-foreground)", opacity: 0.35 }}
        >
          Redirecting to login…
        </p>
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
          Change Your Password
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--product-foreground)", opacity: 0.55 }}
        >
          Enter your new password below
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
            className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{
              backgroundColor: "var(--color-error-light)",
              border: "1px solid var(--color-error)",
            }}
          >
            <AlertCircle
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: "var(--color-error)" }}
            />
            <p className="text-sm" style={{ color: "var(--color-error)" }}>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="text-xs font-medium mb-1.5 block"
            style={{ color: "var(--product-foreground)", opacity: 0.6 }}
          >
            New Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--product-foreground)", opacity: 0.35 }}
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldError("");
                resetMutation.reset();
              }}
              required
              placeholder="Enter new password"
              className="auth-input pl-9 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--product-foreground)", opacity: 0.4 }}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p
            className="mt-1.5 text-xs"
            style={{ color: "var(--product-foreground)", opacity: 0.4 }}
          >
            Min 8 characters · uppercase · lowercase · number
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-xs font-medium mb-1.5 block"
            style={{ color: "var(--product-foreground)", opacity: 0.6 }}
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--product-foreground)", opacity: 0.35 }}
            />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldError("");
              }}
              required
              placeholder="Confirm new password"
              className="auth-input pl-9 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--product-foreground)", opacity: 0.4 }}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={resetMutation.loading || !token || !email}
          className="auth-btn-primary w-full flex items-center justify-center gap-2"
        >
          {resetMutation.loading && (
            <LoadingSpinner size="sm" color="currentColor" />
          )}
          {resetMutation.loading ? "Changing Password…" : "Change Password"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="text-sm transition-colors"
          style={{ color: "var(--product-foreground)", opacity: 0.5 }}
        >
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
}

export default function ChangePasswordPage() {
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
      <ChangePasswordContent />
    </Suspense>
  );
}
