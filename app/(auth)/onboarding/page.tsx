"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { onboardingApi } from "../../../lib/api";
// import ProtectedLayout from '../../(dashboard)/components/layout/ProtectedLayout';
import { useAuth } from "../../../lib/hooks";
import { toast } from "sonner";

const BUSINESS_TYPES = [
  { value: "ecommerce", emoji: "🛍️", label: "E-Commerce / Retail" },
  { value: "services", emoji: "🔧", label: "Services / Freelance" },
  { value: "restaurant", emoji: "🍽️", label: "Restaurant / Food" },
  { value: "agency", emoji: "📊", label: "Marketing / Digital Agency" },
  { value: "tech", emoji: "💻", label: "Tech / Software" },
  { value: "education", emoji: "📚", label: "Education / Tutoring" },
  { value: "fashion", emoji: "👗", label: "Fashion / Beauty" },
  { value: "other", emoji: "✨", label: "Something else" },
] as const;

const GOALS = [
  { value: "grow_social", label: "Grow my social media" },
  { value: "run_ads", label: "Run ads that convert" },
  { value: "build_brand", label: "Build my brand identity" },
  { value: "manage_crm", label: "Manage clients & leads" },
  { value: "get_funding", label: "Raise investment" },
  { value: "hire_team", label: "Hire & manage a team" },
  { value: "learn_ai", label: "Learn AI tools for business" },
  { value: "pass_exams", label: "Pass JAMB / WAEC / NECO" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const displayName = user?.name?.split(" ")[0] ?? "Builder";

  const toggleGoal = (g: string) =>
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  const handleFinish = async () => {
    setSaving(true);
    try {
      await onboardingApi.complete({ businessType, goals });
      toast.success("All set! Welcome to BoldmindNG 🚀");
      router.push("/dashboard");
    } catch {
      // Even if it fails, send to dashboard — onboarding is not blocking
      router.push("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--product-background)" }}
    >
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full transition-all"
              style={{
                backgroundColor:
                  s <= step ? "var(--product-primary)" : "var(--product-muted)",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1
                className="text-2xl font-black mb-2"
                style={{ color: "var(--product-foreground)" }}
              >
                Welcome, {displayName}! 🎉
              </h1>
              <p
                className="text-sm mb-8"
                style={{ color: "var(--product-foreground)", opacity: 0.6 }}
              >
                Tell us about your business so we can suggest the right tools.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {BUSINESS_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setBusinessType(t.value)}
                    className="p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02]"
                    style={{
                      borderColor:
                        businessType === t.value
                          ? "var(--product-primary)"
                          : "var(--product-muted)",
                      backgroundColor:
                        businessType === t.value
                          ? "var(--product-highlight)"
                          : "var(--product-background)",
                    }}
                  >
                    <div className="text-2xl mb-2">{t.emoji}</div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: "var(--product-foreground)" }}
                    >
                      {t.label}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!businessType}
                className="auth-btn-primary w-full"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1
                className="text-2xl font-black mb-2"
                style={{ color: "var(--product-foreground)" }}
              >
                What are your main goals?
              </h1>
              <p
                className="text-sm mb-8"
                style={{ color: "var(--product-foreground)", opacity: 0.6 }}
              >
                Select all that apply. This helps us set up your dashboard.
              </p>
              <div className="space-y-2 mb-8">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => toggleGoal(g.value)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
                    style={{
                      borderColor: goals.includes(g.value)
                        ? "var(--product-primary)"
                        : "var(--product-muted)",
                      backgroundColor: goals.includes(g.value)
                        ? "var(--product-highlight)"
                        : "var(--product-background)",
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{
                        backgroundColor: goals.includes(g.value)
                          ? "var(--product-primary)"
                          : "var(--product-muted)",
                      }}
                    >
                      {goals.includes(g.value) ? "✓" : ""}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--product-foreground)" }}
                    >
                      {g.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border-2 font-bold text-sm"
                  style={{
                    borderColor: "var(--product-muted)",
                    color: "var(--product-foreground)",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={goals.length === 0}
                  className="auth-btn-primary flex-1"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">🚀</div>
              <h1
                className="text-3xl font-black mb-3"
                style={{ color: "var(--product-foreground)" }}
              >
                You&apos;re all set!
              </h1>
              <p
                className="text-base mb-8"
                style={{ color: "var(--product-foreground)", opacity: 0.65 }}
              >
                Your BoldmindNG dashboard is ready. One account. Four pillars.
                Everything you need to build.
              </p>
              <div className="grid grid-cols-4 gap-3 mb-10">
                {["📰", "🌱", "🎓", "⚡"].map((icon, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4 flex items-center justify-center text-3xl"
                    style={{ backgroundColor: "var(--product-highlight)" }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="auth-btn-primary w-full"
              >
                {saving ? "Setting up…" : "Go to Dashboard →"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
