/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Rocket, GraduationCap, PenLine, Laptop2 } from "lucide-react";
import { authAPI } from "@boldmindng/auth";
import { useAuthStore } from "@boldmindng/auth";
import { setAccessToken } from "@boldmindng/api-client";
import { isSafeBoldMindUrl } from "@boldmindng/auth";
// FIX (TS2322): RegisterPayload.ecosystemRole expects the real EcosystemRole
// union, not `string`. Importing the type so form state matches it exactly.
// NOTE: confirm these four ECOSYSTEM_ROLES values ('founder' | 'student' |
// 'creator' | 'vibe_coder') are actually members of EcosystemRole in
// @boldmindng/auth's types — if the package has different/more role names,
// this array needs to match.
import type { EcosystemRole } from "@boldmindng/auth";
import { toast } from "sonner";

// Icons were emoji (🚀🎓✍️💻); swapped for lucide-react to match the rest
// of the ecosystem's move away from emoji-as-iconography.
const ECOSYSTEM_ROLES = [
  {
    value: "founder",
    Icon: Rocket,
    label: "Founder / Builder",
    sub: "PlanAI tools for your business",
  },
  {
    value: "student",
    Icon: GraduationCap,
    label: "Student",
    sub: "JAMB/WAEC prep on EduCenter",
  },
  {
    value: "creator",
    Icon: PenLine,
    label: "Creator / Writer",
    sub: "Write on AmeboGist",
  },
  {
    value: "vibe_coder",
    Icon: Laptop2,
    label: "Vibe Coder",
    sub: "Apply to Vibe Coders cohort",
  },
] as const satisfies readonly {
  value: EcosystemRole;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
}[];

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirm: string;
  ecosystemRole: EcosystemRole | "";
  referralCode: string;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuthStore();
  const prefersReducedMotion = useReducedMotion();

  // FIX (TS18047): useSearchParams() types as ReadonlyURLSearchParams | null.
  const returnUrl = searchParams?.get("return_url") ?? "/dashboard";

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    ecosystemRole: "",
    referralCode: "",
  });
  const [loading, setLoading] = useState(false);

  const set =
    (
      k: keyof Pick<
        RegisterFormState,
        "name" | "email" | "password" | "confirm" | "referralCode"
      >,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!form.ecosystemRole) {
      toast.error("Please select your role");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register({
        email: form.email,
        password: form.password,
        // FIX: the actual published RegisterPayload (dist/types-HM8PmpZ0.d.ts)
        // requires a single `name` field, not `firstName`/`lastName` — that
        // split was based on the stale local RegisterPayload declaration in
        // packages/auth/src/api.ts, which didn't match what's actually
        // installed. Sending the full name as one field instead.
        name: form.name,
        // FIX: form.ecosystemRole is now typed EcosystemRole | '' — the guard
        // above already ensures it's truthy here, but `|| undefined` keeps
        // the type checker happy without an `as` cast.
        ecosystemRole: form.ecosystemRole || undefined,
        referralCode: form.referralCode || undefined,
      });
      const tokens = res.data;
      setAccessToken(tokens.accessToken);
      const userRes = await authAPI.me();
      // Normalize user shape: api-client's AuthUser may be missing fields
      // expected by @boldmindng/auth's session type. Fill with safe
      // defaults to satisfy the type checker at runtime.
      const me = userRes.data as any;
      const normalizedUser = {
        ...me,
        name: me.name ?? me.email ?? "",
        permissions: me.permissions ?? [],
        isVerified: me.isVerified ?? false,
      };

      setSession({
        user: normalizedUser as any,
        accessToken: tokens.accessToken,
        // FIX: same duration-vs-timestamp bug as login/page.tsx.
        expiresAt: Date.now() + tokens.expiresIn * 1000,
        refreshToken: tokens.refreshToken,
      });
      toast.success("Account created! Welcome to BoldmindNG 🚀");
      const dest = isSafeBoldMindUrl(returnUrl)
        ? `/sso?return_url=${encodeURIComponent(returnUrl)}`
        : "/onboarding";
      router.push(dest);
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--product-background)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        className="w-full max-w-md"
      >
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
            {step === 1
              ? "Create your account"
              : "How will you use BoldmindNG?"}
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            {step === 1
              ? "One account. Four pillars."
              : "We use this to personalise your dashboard."}
          </p>
        </div>

        <div
          className="rounded-2xl border-2 p-8"
          style={{
            borderColor: "var(--product-muted)",
            backgroundColor: "var(--product-background)",
          }}
        >
          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--product-foreground)" }}
                >
                  Full name
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Amaka Okonkwo"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </div>
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
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--product-foreground)" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--product-foreground)" }}
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-bold mb-1.5"
                  style={{ color: "var(--product-foreground)" }}
                >
                  Referral code <span style={{ opacity: 0.4 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. abc123"
                  value={form.referralCode}
                  onChange={set("referralCode")}
                />
              </div>
              <button type="submit" className="auth-btn-primary">
                Continue →
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ECOSYSTEM_ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, ecosystemRole: role.value }))
                    }
                    className="p-4 rounded-xl border-2 text-left transition-all"
                    style={{
                      borderColor:
                        form.ecosystemRole === role.value
                          ? "var(--product-primary)"
                          : "var(--product-muted)",
                      backgroundColor:
                        form.ecosystemRole === role.value
                          ? "var(--product-highlight)"
                          : "transparent",
                    }}
                  >
                    <role.Icon
                      className="w-6 h-6 mb-2"
                      style={{ color: "var(--product-primary)" }}
                      aria-hidden="true"
                    />
                    <div
                      className="text-sm font-bold"
                      style={{ color: "var(--product-foreground)" }}
                    >
                      {role.label}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{
                        color: "var(--product-foreground)",
                        opacity: 0.5,
                      }}
                    >
                      {role.sub}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all"
                  style={{
                    borderColor: "var(--product-muted)",
                    color: "var(--product-foreground)",
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !form.ecosystemRole}
                  className="auth-btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    "Creating…"
                  ) : (
                    <>
                      Create Account{" "}
                      <Rocket className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--product-foreground)", opacity: 0.55 }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold"
            style={{ color: "var(--product-primary)" }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
