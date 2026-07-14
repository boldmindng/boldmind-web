/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useIsAdmin } from "../lib/hooks";
import { authAPI, useAuthStore } from "@boldmindng/auth";
import { ThemeToggle, DyslexiaToggle } from "@boldmindng/ui";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Link2,
  Wallet,
  Users,
  Bell,
  UserCircle,
  Settings,
  Shield,
  Globe,
  BookOpen,
  GraduationCap,
  Zap,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BoldmindLayoutProps {
  children: ReactNode;
  /** 'protected' | 'admin' — controls which nav section shows */
  variant?: "protected" | "admin";
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

// ─── Nav definitions ──────────────────────────────────────────────────────────

const PROTECTED_NAV: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/revenue", icon: DollarSign, label: "Revenue" },
  { href: "/dashboard/referrals", icon: Link2, label: "Referrals" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/community", icon: Users, label: "Community" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/account", icon: UserCircle, label: "Account" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/logs", icon: Settings, label: "Logs" },
  { href: "/dashboard", icon: ChevronRight, label: "Back to Hub" },
];

interface EcosystemLink {
  href: string;
  icon: React.ElementType;
  label: string;
}

const ECOSYSTEM_LINKS: EcosystemLink[] = [
  { href: "https://amebogist.ng", icon: Globe, label: "AmeboGist" },
  { href: "https://villagecircle.ng", icon: BookOpen, label: "VillageCircle" },
  { href: "https://educenter.com.ng", icon: GraduationCap, label: "EduCenter" },
  { href: "https://planai.boldmind.ng", icon: Zap, label: "PlanAI" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true when the given nav href matches or is a prefix of the current path */
function isActiveHref(href: string, pathname: string): boolean {
  if (href === "/dashboard" || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

function NavItem({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const active = isActiveHref(item.href, pathname);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={{
        backgroundColor: active ? "var(--product-highlight)" : "transparent",
        color: active ? "var(--product-primary)" : "var(--product-foreground)",
        opacity: active ? 1 : 0.65,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.backgroundColor =
            "var(--product-muted)";
          (e.currentTarget as HTMLElement).style.opacity = "1";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.backgroundColor =
            "transparent";
          (e.currentTarget as HTMLElement).style.opacity = "0.65";
        }
      }}
    >
      <Icon size={16} />
      <span className="flex-1">{item.label}</span>
      {active && (
        <ChevronRight
          size={13}
          style={{ color: "var(--product-primary)", opacity: 0.6 }}
        />
      )}
    </Link>
  );
}

// ─── Sidebar content (shared between desktop + mobile drawer) ─────────────────

function SidebarContent({
  variant,
  pathname,
  displayName,
  initials,
  ecosystemRole,
  isAdmin,
  onSignOut,
  onClose,
}: {
  variant: "protected" | "admin";
  pathname: string;
  displayName: string;
  initials: string;
  ecosystemRole: string;
  isAdmin: boolean;
  onSignOut: () => void;
  onClose?: () => void;
}) {
  const navItems = variant === "admin" ? ADMIN_NAV : PROTECTED_NAV;

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "var(--product-background)" }}
    >
      {/* Brand bar */}
      <div
        className="flex items-center justify-between h-14 px-5 shrink-0"
        style={{
          background:
            "linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))",
        }}
      >
        <Link
          href={variant === "admin" ? "/admin" : "/dashboard"}
          className="flex items-center gap-2.5"
        >
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/logo.webp"
              alt="BoldmindNG"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-black text-white text-sm tracking-tight leading-none">
              BoldmindNG
            </div>
            <div
              className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5"
              style={{
                color:
                  variant === "admin" ? "#FCA5A5" : "var(--product-secondary)",
              }}
            >
              {variant === "admin" ? "Admin Panel" : "Hub"}
            </div>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* User pill */}
      <div className="px-4 pt-4 pb-3">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ backgroundColor: "var(--product-muted)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ backgroundColor: "var(--product-primary)" }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-sm font-bold truncate"
              style={{ color: "var(--product-foreground)" }}
            >
              {displayName}
            </div>
            <span
              className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded inline-block"
              style={{
                backgroundColor: "var(--product-highlight)",
                color: "var(--product-primary)",
              }}
            >
              {ecosystemRole}
            </span>
          </div>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
        <p
          className="text-[10px] font-black uppercase tracking-widest px-3 py-2"
          style={{ color: "var(--product-foreground)", opacity: 0.35 }}
        >
          {variant === "admin" ? "Admin" : "Hub"}
        </p>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onClose}
          />
        ))}

        {/* Ecosystem links — protected variant only */}
        {variant === "protected" && (
          <>
            <p
              className="text-[10px] font-black uppercase tracking-widest px-3 pt-4 pb-2"
              style={{ color: "var(--product-foreground)", opacity: 0.35 }}
            >
              Ecosystem
            </p>
            {ECOSYSTEM_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ color: "var(--product-foreground)", opacity: 0.6 }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "var(--product-muted)";
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.opacity = "0.6";
                  }}
                >
                  <Icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[10px] opacity-40">↗</span>
                </a>
              );
            })}

            {/* Admin link (if user is admin) */}
            {isAdmin && (
              <>
                <p
                  className="text-[10px] font-black uppercase tracking-widest px-3 pt-4 pb-2"
                  style={{ color: "var(--color-error)", opacity: 0.7 }}
                >
                  Admin
                </p>
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ color: "var(--color-error)", opacity: 0.8 }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "var(--color-error-light)";
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.opacity = "0.8";
                  }}
                >
                  <Shield size={16} />
                  <span>Admin Panel</span>
                </Link>
              </>
            )}
          </>
        )}
      </nav>

      {/* Controls row — theme + dyslexia toggles */}
      <div
        className="px-4 py-2 border-t flex items-center gap-2"
        style={{ borderColor: "var(--product-muted)" }}
      >
        <ThemeToggle />
        <DyslexiaToggle variant="compact" />
      </div>

      {/* Sign out */}
      <div className="px-3 pb-3 pt-1">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ color: "var(--color-error)", opacity: 0.75 }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--color-error-light)";
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent";
            (e.currentTarget as HTMLElement).style.opacity = "0.75";
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Main layout export ───────────────────────────────────────────────────────

export default function BoldmindLayout({
  children,
  variant = "protected",
}: BoldmindLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const clearSession = useAuthStore((s) => s.clearSession);

  // Close mobile drawer on route change
  useEffect(() => {}, [pathname]);

  const displayName =
    (user as any)?.firstName ??
    user?.name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "Builder";

  const initials =
    (user?.name ?? "")
      .split(" ")
      .slice(0, 2)
      .map((p: string) => p[0])
      .join("")
      .toUpperCase() ||
    (user?.email?.[0]?.toUpperCase() ?? "B");

  const ecosystemRole = user?.ecosystemRole ?? (user as any)?.role ?? "Builder";

  const handleSignOut = async () => {
    try {
      await authAPI.logoutAll();
    } catch {
      /* best-effort */
    }
    clearSession();
    toast.success("Signed out");
    router.push("/");
  };

  const sidebarProps = {
    variant,
    pathname,
    displayName,
    initials,
    ecosystemRole,
    isAdmin,
    onSignOut: handleSignOut,
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--product-background)" }}
    >
      {/* Desktop sidebar — fixed, 240 px */}
      <div
        className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 border-r z-20"
        style={{ borderColor: "var(--product-muted)" }}
      >
        <SidebarContent {...sidebarProps} />
      </div>

      {/* Mobile drawer overlay + panel */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed inset-y-0 left-0 z-40 w-64 shadow-2xl lg:hidden"
            style={{ borderColor: "var(--product-muted)" }}
          >
            <SidebarContent
              {...sidebarProps}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main content area — offset by sidebar width on lg+ */}
      <div className="flex-1 flex flex-col lg:pl-60 min-w-0">
        {/* Sticky topbar */}
        <header
          className="sticky top-0 z-10 flex items-center h-14 px-4 sm:px-6 border-b"
          style={{
            backgroundColor: "var(--product-background)",
            borderColor: "var(--product-muted)",
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg mr-3 lg:hidden transition-colors"
            style={{ color: "var(--product-foreground)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--product-muted)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "")
            }
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Mobile logo (hidden on desktop — sidebar shows it) */}
          <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src="/logo.webp"
                alt="BoldmindNG"
                fill
                className="object-contain"
              />
            </div>
            <span
              className="font-black text-sm"
              style={{ color: "var(--product-primary)" }}
            >
              BoldmindNG
            </span>
          </Link>

          <div className="flex-1" />

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/dashboard/notifications"
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: "var(--product-foreground)", opacity: 0.65 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--product-muted)";
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "";
                (e.currentTarget as HTMLElement).style.opacity = "0.65";
              }}
              aria-label="Notifications"
            >
              <Bell size={17} />
            </Link>
            <Link href="/account">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ backgroundColor: "var(--product-primary)" }}
              >
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
