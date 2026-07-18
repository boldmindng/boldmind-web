"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Trophy, Flame, Target, Award } from "lucide-react";
import { getUserRoleDisplay } from "@boldmindng/utils";
import type { AuthUser } from "@boldmindng/auth";

interface IdentitySectionProps {
  user: AuthUser | null;
}

/**
 * UPDATED — this component was running its own, third design system:
 * hardcoded `#00143C` / `#00255C` / `#FFC800` hex (the first two are the
 * same off-token navy that used to be hardcoded in Modal.tsx's old title
 * color) plus a parallel Tailwind `dark:` class strategy (`bg-white
 * dark:bg-gray-900`, `text-gray-600 dark:text-gray-400`, etc.) — a totally
 * different dark-mode mechanism from the `--product-*` CSS-variable
 * approach every sibling component in this dashboard uses. Practically,
 * that meant this card never rebranded per pillar and duplicated dark-mode
 * logic the token system already handles for free. Rebuilt entirely on
 * `--product-*` tokens, matching HubDashboardPage/ProtectedLayout.
 */
export function IdentitySection({ user }: IdentitySectionProps) {
  const prefersReducedMotion = useReducedMotion();
  if (!user) return null;

  // `digitalMaturity` is expected from the auth payload, but the local
  // AuthUser type may not include it yet. Narrow it here to keep the
  // component compile-safe without changing the shared type.
  const { digitalMaturity } = user as AuthUser & {
    digitalMaturity?: "low" | "medium" | "high";
  };

  const maturity = digitalMaturity
    ? digitalMaturity.charAt(0).toUpperCase() + digitalMaturity.slice(1)
    : "Exploring";

  // FIXED: centralized role display — was local `.replace("_", " ")`
  // duplicating logic that now lives in @boldmindng/utils (ProtectedLayout,
  // AdminLayout, and AdminUsersPage all resolve role labels the same way).
  // Prefers ecosystemRole (the persona layer — founder/creator/student/etc.)
  // over the system role, falling back to system role for staff accounts
  // that have no ecosystemRole set (e.g. an internal 'admin' with no persona).
  const roleName = getUserRoleDisplay(
    user.ecosystemRole ?? user.role ?? "guest",
  );

  const displayName = user.name || user.email?.split("@")[0] || "Builder";

  // TODO: streak/progress/rank/badges are mocked — no backend source yet.
  // The only streak model that exists today (StudyStreak) is EduCenter-only
  // and scoped to students, not a general cross-ecosystem builder streak.
  // Wire this up once/if a Hub-wide activity streak exists server-side.
  const streak = 7;
  const progress = 65;
  const rank = "Top 18%";

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6"
    >
      {/* Main Identity Card */}
      <div
        className="md:col-span-8 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl"
        style={{
          background:
            "linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))",
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-20 -mt-20 blur-3xl"
          style={{ backgroundColor: "var(--product-secondary)", opacity: 0.1 }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black mb-2">
                Welcome back,{" "}
                <span style={{ color: "var(--product-secondary)" }}>
                  {displayName.split(" ")[0]}
                </span>{" "}
                🔥
              </h2>
              <p
                className="text-lg"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                You&apos;re in the{" "}
                <span className="font-bold text-white">{rank}</span> of active
                builders this week.
              </p>
            </div>

            <div className="flex gap-4">
              <div
                className="backdrop-blur-md rounded-xl p-4 border text-center min-w-25"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Role
                </p>
                <p className="font-bold text-lg">{roleName}</p>
              </div>
              <div
                className="backdrop-blur-md rounded-xl p-4 border text-center min-w-25"
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <p
                  className="text-xs uppercase tracking-wider mb-1"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Maturity
                </p>
                <p className="font-bold text-lg">{maturity}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "var(--product-secondary)" }}
              >
                <Flame style={{ color: "var(--product-primary)" }} size={24} />
              </div>
              <div>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Activity Streak
                </p>
                <p className="text-xl font-bold tabular-nums">{streak} Days</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "var(--color-success)" }}
              >
                <Target className="text-white" size={24} />
              </div>
              <div>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Progress Level
                </p>
                <p className="text-xl font-bold tabular-nums">
                  Lvl {Math.floor(progress / 10)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "var(--product-accent)" }}
              >
                <Award className="text-white" size={24} />
              </div>
              <div>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Badges
                </p>
                <p className="text-xl font-bold tabular-nums">12 Earned</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Progress / Next Step Card */}
      <div
        className="md:col-span-4 rounded-2xl p-8 border shadow-sm flex flex-col justify-between"
        style={{
          backgroundColor: "var(--product-background)",
          borderColor: "var(--product-muted)",
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-lg flex items-center gap-2"
              style={{ color: "var(--product-foreground)" }}
            >
              <Trophy style={{ color: "var(--product-secondary)" }} size={20} />
              Milestone
            </h3>
            <span
              className="text-sm font-medium px-2 py-1 rounded tabular-nums"
              style={{
                color: "var(--product-primary)",
                backgroundColor: "var(--product-highlight)",
              }}
            >
              {progress}%
            </span>
          </div>
          <div
            className="w-full rounded-full h-3 mb-6"
            style={{ backgroundColor: "var(--product-muted)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: prefersReducedMotion ? 0 : 1,
                delay: prefersReducedMotion ? 0 : 0.5,
              }}
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--product-secondary)" }}
            />
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--product-foreground)", opacity: 0.65 }}
          >
            Complete your <strong>Product Profile</strong> to reach{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--product-foreground)", opacity: 1 }}
            >
              Level 7
            </span>{" "}
            and unlock cross-collaboration tools.
          </p>
        </div>

        <button
          className="w-full mt-6 py-3 font-black rounded-xl hover:shadow-lg transition-all active:scale-[0.98]"
          style={{
            backgroundColor: "var(--product-secondary)",
            color: "var(--product-primary)",
          }}
        >
          Continue Building →
        </button>
      </div>
    </motion.div>
  );
}
