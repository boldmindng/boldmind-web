/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  Package,
  Wallet,
  Link2,
  Users,
  Bell,
  User,
  Settings,
  ShieldCheck,
  Newspaper,
  Sprout,
  GraduationCap,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../../../lib/hooks";
import { authAPI, useAuthStore } from "@boldmindng/auth";
import { getUserRoleDisplay, hasAdminPermission } from "@boldmindng/utils";
import { toast } from "sonner";
import type { ReactNode } from "react";

// Icons were emoji (⚡📦💰🔗👛👥🔔👤⚙️🛡️🚪) — swapped for lucide-react to
// match BoldmindLayout, the newer sidebar, which already made this move.
// This file is otherwise a duplicate of that layout; consider retiring it
// in favor of BoldmindLayout rather than maintaining both long-term.
const NAV_ITEMS = [
  { href: "/dashboard", Icon: Zap, label: "Overview" },
  { href: "/dashboard/products", Icon: Package, label: "Products" },
  { href: "/dashboard/revenue", Icon: Wallet, label: "Revenue" },
  { href: "/dashboard/referrals", Icon: Link2, label: "Referrals" },
  { href: "/dashboard/wallet", Icon: Wallet, label: "Wallet" },
  { href: "/dashboard/team", Icon: Users, label: "Team" },
  { href: "/dashboard/notifications", Icon: Bell, label: "Notifications" },
  { href: "/account", Icon: User, label: "Account" },
  { href: "/settings", Icon: Settings, label: "Settings" },
];

const ECOSYSTEM_LINKS = [
  { href: "https://amebogist.ng", Icon: Newspaper, label: "AmeboGist" },
  { href: "https://villagecircle.ng", Icon: Sprout, label: "VillageCircle" },
  { href: "https://educenter.com.ng", Icon: GraduationCap, label: "EduCenter" },
  { href: "https://planai.boldmind.ng", Icon: Zap, label: "PlanAI" },
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
                aria-current={active ? "page" : undefined}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-11"
                style={{
                  backgroundColor: active
                    ? "var(--product-primary)"
                    : "transparent",
                  color: active ? "white" : "var(--product-foreground)",
                  opacity: active ? 1 : 0.7,
                }}
              >
                <item.Icon
                  className="w-4.5 h-4.5 shrink-0"
                  aria-hidden="true"
                />
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
                aria-current={
                  currentPath.startsWith("/admin") ? "page" : undefined
                }
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-11"
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
                <ShieldCheck
                  className="w-4.5 h-4.5 shrink-0"
                  aria-hidden="true"
                />
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-11"
              style={{ color: "var(--product-foreground)", opacity: 0.6 }}
            >
              <item.Icon className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
              {item.label}
              <ExternalLink
                className="w-3 h-3 ml-auto opacity-40"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        <div
          className="p-4 border-t"
          style={{ borderColor: "var(--product-muted)" }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 min-h-11"
            style={{ color: "var(--color-error)" }}
          >
            <LogOut className="w-4.5 h-4.5" aria-hidden="true" /> Sign out
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
          {/* Was w-9 h-9 (36px) — under the 44px minimum touch target. */}
          <Link
            href="/dashboard/notifications"
            aria-label="Notifications"
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "var(--product-highlight)" }}
          >
            <Bell
              className="w-4.5 h-4.5"
              style={{ color: "var(--product-primary)" }}
              aria-hidden="true"
            />
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
