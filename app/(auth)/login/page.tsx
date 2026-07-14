/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { authAPI } from "@boldmindng/auth";
import { useAuthStore } from "@boldmindng/auth";
import { setAccessToken } from "@boldmindng/api-client";
import { getAppNameFromReturnUrl, isSafeBoldMindUrl } from "@boldmindng/auth";
import { toast } from "sonner";

// ─── Inner component that reads search params ─────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, status } = useAuthStore();

  // FIX (TS18047): useSearchParams() types as ReadonlyURLSearchParams | null —
  // optional-chain every .get() call instead of asserting non-null.
  const returnUrl =
    searchParams?.get("return_url") ??
    searchParams?.get("redirect") ??
    "/dashboard";
  const appName = isSafeBoldMindUrl(returnUrl)
    ? getAppNameFromReturnUrl(returnUrl)
    : "BoldmindNG";
  const hasError = searchParams?.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Already authenticated — redirect
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(
        isSafeBoldMindUrl(returnUrl) && returnUrl !== "/dashboard"
          ? `/sso?return_url=${encodeURIComponent(returnUrl)}`
          : returnUrl.startsWith("/")
            ? returnUrl
            : "/dashboard",
      );
    }
  }, [status, returnUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      const data = res.data;

      // Check if 2FA is required
      if ("requires2fa" in data && data.requires2fa) {
        // Store the pending token and redirect to 2FA
        sessionStorage.setItem("pendingToken", data.pendingToken);
        router.push(`/2fa?return_url=${encodeURIComponent(returnUrl)}`);
        return;
      }

      // Normal login flow
      const tokens = data as Exclude<typeof data, { requires2fa: true }>;
      setAccessToken(tokens.accessToken);

      const userRes = await authAPI.me();
      setSession({
        user: userRes.data as any,
        accessToken: tokens.accessToken,
        // FIX: tokens.expiresIn is a DURATION in seconds (e.g. 900), not a
        // timestamp. Everywhere else (auth-provider.tsx's cookieRefresh,
        // TokenStorage.save) expiresAt is an absolute epoch-ms timestamp —
        // this was storing "900" as if it were a Date.now() value, which
        // made the session look expired since 1970 to anything that checks it.
        expiresAt: Date.now() + tokens.expiresIn * 1000,
        refreshToken: tokens.refreshToken,
      });

      // Navigate through /sso to handle cross-domain relay if needed
      const dest = isSafeBoldMindUrl(returnUrl)
        ? `/sso?return_url=${encodeURIComponent(returnUrl)}`
        : "/dashboard";

      toast.success("Welcome back!");
      router.push(dest);
    } catch (err: any) {
      const msg = err?.message ?? "Invalid email or password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const callbackUrl = `${window.location.origin}/api/auth/google/callback?return_url=${encodeURIComponent(returnUrl)}`;
    window.location.href = authAPI.googleOAuthUrl(
      callbackUrl,
      isSafeBoldMindUrl(returnUrl) && !returnUrl.includes("boldmind.ng"),
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--product-background)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl mx-auto mb-4"
              style={{ backgroundColor: "var(--product-primary)" }}
            >
              B
            </div>
          </Link>
          <h1
            className="text-2xl font-black mb-1"
            style={{ color: "var(--product-foreground)" }}
          >
            {appName === "BoldmindNG"
              ? "Welcome back"
              : `Sign in to continue to ${appName}`}
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            Your BoldmindNG account unlocks everything.
          </p>
        </div>

        {/* OAuth error banner */}
        {hasError && (
          <div
            className="mb-6 p-4 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "var(--color-error-light)",
              color: "var(--color-error)",
            }}
          >
            {hasError === "oauth_failed"
              ? "Google sign-in failed. Please try again."
              : "Authentication error. Please try again."}
          </div>
        )}

        <div
          className="rounded-2xl border-2 p-8"
          style={{
            borderColor: "var(--product-muted)",
            backgroundColor: "var(--product-background)",
          }}
        >
          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="auth-btn-social w-full mb-6"
          >
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--product-muted)" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--product-foreground)", opacity: 0.4 }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--product-muted)" }}
            />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-bold mb-1.5"
                style={{ color: "var(--product-foreground)" }}
              >
                Email
              </label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-sm font-bold"
                  style={{ color: "var(--product-foreground)" }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold"
                  style={{ color: "var(--product-primary)" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                >
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="auth-btn-primary"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            No account?{" "}
            <Link
              href={`/register${returnUrl !== "/dashboard" ? `?return_url=${encodeURIComponent(returnUrl)}` : ""}`}
              className="font-bold"
              style={{ color: "var(--product-primary)" }}
            >
              Create one free
            </Link>
          </p>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--product-foreground)", opacity: 0.35 }}
        >
          By signing in you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
