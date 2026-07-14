/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../../lib/hooks";
import { authAPI, broadcastLogout, useAuthStore } from "@boldmindng/auth";
import { getUserRoleDisplay, hasAdminPermission } from "@boldmindng/utils";
import { toast } from "sonner";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "⚡", label: "Overview" },
  { href: "/dashboard/products", icon: "📦", label: "Products" },
  { href: "/dashboard/revenue", icon: "💰", label: "Revenue" },
  { href: "/dashboard/referrals", icon: "🔗", label: "Referrals" },
  { href: "/dashboard/wallet", icon: "👛", label: "Wallet" },
  { href: "/dashboard/team", icon: "👥", label: "Team" },
  { href: "/dashboard/notifications", icon: "🔔", label: "Notifications" },
  { href: "/account", icon: "👤", label: "Account" },
  { href: "/settings", icon: "⚙️", label: "Settings" },
];

const ECOSYSTEM_LINKS = [
  { href: "https://amebogist.ng", icon: "📰", label: "AmeboGist" },
  { href: "https://villagecircle.ng", icon: "🌱", label: "VillageCircle" },
  { href: "https://educenter.com.ng", icon: "🎓", label: "EduCenter" },
  { href: "https://planai.boldmind.ng", icon: "⚡", label: "PlanAI" },
];

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const clearSession = useAuthStore((s) => s.clearSession);

  const handleLogout = async () => {
    try {
      await authAPI.logoutAll();
    } catch {
      /* ignore — cookies get cleared client-side regardless */
    }
    broadcastLogout();
    clearSession();
    toast.success("Signed out successfully");
    router.push("/");
  };

  // AuthUser only ever has `name` (register/login take a single `name`
  // field, not firstName/lastName) — the previous `(user as any)?.firstName`
  // reached for a field that doesn't exist on the real shape.
  const displayName = user?.name ?? user?.email?.split("@")[0] ?? "Builder";
  const roleLabel = user?.role ? getUserRoleDisplay(user.role) : "Builder";
  const canSeeAdminPanel = hasAdminPermission(user, "users:read");

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--product-background)" }}
    >
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 border-r"
        style={{
          borderColor: "var(--product-muted)",
          backgroundColor: "var(--product-background)",
        }}
      >
        <div
          className="p-5 border-b"
          style={{ borderColor: "var(--product-muted)" }}
        >
          <Link href="/dashboard" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ backgroundColor: "var(--product-primary)" }}
            >
              B
            </div>
            <div>
              <div
                className="font-black text-sm"
                style={{ color: "var(--product-foreground)" }}
              >
                BoldmindNG
              </div>
              <div
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--product-secondary)" }}
              >
                Hub
              </div>
            </div>
          </Link>
        </div>

        <div
          className="p-4 border-b"
          style={{ borderColor: "var(--product-muted)" }}
        >
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: "var(--product-highlight)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
              style={{ backgroundColor: "var(--product-primary)" }}
            >
              {displayName[0]?.toUpperCase() ?? "B"}
            </div>
            <div className="min-w-0">
              <div
                className="text-sm font-bold truncate"
                style={{ color: "var(--product-foreground)" }}
              >
                {displayName}
              </div>
              <div
                className="text-[11px] truncate"
                style={{ color: "var(--product-foreground)", opacity: 0.5 }}
              >
                {roleLabel}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p
            className="text-[10px] font-black uppercase tracking-widest px-3 py-2"
            style={{ color: "var(--product-foreground)", opacity: 0.35 }}
          >
            Hub
          </p>
          {NAV_ITEMS.map((item) => {
            const active =
              currentPath === item.href ||
              (item.href !== "/dashboard" && currentPath.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: active
                    ? "var(--product-primary)"
                    : "transparent",
                  color: active ? "white" : "var(--product-foreground)",
                  opacity: active ? 1 : 0.7,
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          {canSeeAdminPanel && (
            <>
              <p
                className="text-[10px] font-black uppercase tracking-widest px-3 py-2 mt-4"
                style={{ color: "var(--product-foreground)", opacity: 0.35 }}
              >
                Admin
              </p>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: currentPath.startsWith("/admin")
                    ? "var(--product-primary)"
                    : "transparent",
                  color: currentPath.startsWith("/admin")
                    ? "white"
                    : "var(--product-foreground)",
                  opacity: currentPath.startsWith("/admin") ? 1 : 0.7,
                }}
              >
                <span className="text-base">🛡️</span>
                Admin Panel
              </Link>
            </>
          )}

          <p
            className="text-[10px] font-black uppercase tracking-widest px-3 py-2 mt-4"
            style={{ color: "var(--product-foreground)", opacity: 0.35 }}
          >
            Ecosystem
          </p>
          {ECOSYSTEM_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: "var(--product-foreground)", opacity: 0.6 }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              <span className="ml-auto text-[10px]" style={{ opacity: 0.4 }}>
                ↗
              </span>
            </a>
          ))}
        </nav>

        <div
          className="p-4 border-t"
          style={{ borderColor: "var(--product-muted)" }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ color: "var(--color-error)" }}
          >
            <span>🚪</span> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-30 h-16 flex items-center gap-4 px-6 border-b"
          style={{
            borderColor: "var(--product-muted)",
            backgroundColor: "var(--product-background)",
          }}
        >
          <Link
            href="/dashboard"
            className="lg:hidden font-black text-sm"
            style={{ color: "var(--product-primary)" }}
          >
            BoldmindNG
          </Link>
          <div className="flex-1" />
          <Link
            href="/dashboard/notifications"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: "var(--product-highlight)" }}
          >
            🔔
          </Link>
          <Link href="/account" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white"
              style={{ backgroundColor: "var(--product-primary)" }}
            >
              {displayName[0]?.toUpperCase() ?? "B"}
            </div>
          </Link>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
