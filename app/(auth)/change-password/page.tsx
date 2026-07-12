/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useResetPassword } from "../../../lib/hooks";

function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pwd)) return "Must contain at least one uppercase letter";
  if (!/[a-z]/.test(pwd)) return "Must contain at least one lowercase letter";
  if (!/[0-9]/.test(pwd)) return "Must contain at least one number";
  return null;
}

function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const email = searchParams?.get("email") ?? "";

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
      await resetMutation.execute(token, password);
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-14 h-14 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/25">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          Password Changed!
        </h1>
        <p className="text-white/50 text-sm mb-4">
          Your password has been successfully updated. You can now log in with
          your new password.
        </p>
        <p className="text-white/25 text-xs">Redirecting to login…</p>
      </motion.div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-white mb-1.5">
          Change Your Password
        </h1>
        <p className="text-white/45 text-sm">Enter your new password below</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="text-white/50 text-xs font-medium mb-1.5 block"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
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
              className="w-full pl-9 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/50 text-sm transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-white/30">
            Min 8 characters · uppercase · lowercase · number
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="text-white/50 text-xs font-medium mb-1.5 block"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
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
              className="w-full pl-9 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/50 text-sm transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
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
          className="w-full py-3 rounded-xl font-semibold bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
        >
          {resetMutation.loading && (
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          )}
          {resetMutation.loading ? "Changing Password…" : "Change Password"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="text-white/35 hover:text-white/60 text-sm transition-colors"
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
      fallback={<div className="text-center text-white/50">Loading...</div>}
    >
      <ChangePasswordContent />
    </Suspense>
  );
}
