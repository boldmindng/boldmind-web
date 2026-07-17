"use client";

import Link from "next/link";
import {
  useAuth,
  useDashboardStats,
  isPersonalStats,
  isEcosystemStats,
} from "../../../../lib/hooks";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 border-2 transition-all hover:shadow-md"
      style={{
        backgroundColor: accent
          ? "var(--product-primary)"
          : "var(--product-background)",
        borderColor: accent ? "var(--product-primary)" : "var(--product-muted)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: accent
              ? "rgba(255,255,255,0.2)"
              : "var(--product-highlight)",
            color: accent ? "white" : "var(--product-primary)",
          }}
        >
          <Icon size={18} />
        </div>
        <span
          className="text-xs font-black uppercase tracking-widest"
          style={{
            color: accent
              ? "rgba(255,255,255,0.7)"
              : "var(--product-foreground)",
            opacity: accent ? 1 : 0.5,
          }}
        >
          {label}
        </span>
      </div>
      <p
        className="text-3xl font-black"
        style={{ color: accent ? "white" : "var(--product-foreground)" }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="text-xs mt-1"
          style={{
            color: accent
              ? "rgba(255,255,255,0.6)"
              : "var(--product-foreground)",
            opacity: accent ? 1 : 0.5,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 border-2 animate-pulse"
      style={{
        backgroundColor: "var(--product-background)",
        borderColor: "var(--product-muted)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl"
          style={{ backgroundColor: "var(--product-muted)" }}
        />
        <div
          className="h-3 w-20 rounded"
          style={{ backgroundColor: "var(--product-muted)" }}
        />
      </div>
      <div
        className="h-9 w-24 rounded"
        style={{ backgroundColor: "var(--product-muted)" }}
      />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
      <div
        className="w-8 h-8 rounded-full shrink-0"
        style={{ backgroundColor: "var(--product-muted)" }}
      />
      <div className="flex-1 space-y-1.5">
        <div
          className="h-3 w-48 rounded"
          style={{ backgroundColor: "var(--product-muted)" }}
        />
        <div
          className="h-2 w-28 rounded"
          style={{ backgroundColor: "var(--product-muted)" }}
        />
      </div>
    </div>
  );
}

function GrowthBadge({
  trend,
  percentage,
}: {
  trend: "up" | "down" | "stable";
  percentage: number;
}) {
  const Icon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color =
    trend === "up"
      ? "text-green-400"
      : trend === "down"
        ? "text-red-400"
        : "text-white/40";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${color}`}
    >
      <Icon size={13} />
      {percentage > 0 ? "+" : ""}
      {percentage}% this month
    </span>
  );
}

export default function HubDashboardPage() {
  const { user } = useAuth();
  const { data: stats, loading, error, refresh } = useDashboardStats();

  const displayName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Founder";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p
          className="text-sm"
          style={{ color: "var(--product-foreground)", opacity: 0.5 }}
        >
          Failed to load dashboard: {error.message}
        </p>
        <button
          onClick={refresh}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--product-primary)" }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Personal (non-admin) view — the everyday case for most Hub users ──────
  if (stats && isPersonalStats(stats)) {
    const walletNaira = `₦${(stats.wallet.balanceKobo / 100).toLocaleString("en-NG")}`;
    return (
      <div className="space-y-8">
        <div
          className="rounded-2xl p-7 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))",
          }}
        >
          <h1 className="text-2xl font-black text-white mb-1">
            Welcome back, {displayName} 🚀
          </h1>
          <p className="text-white/70 text-sm">
            {stats.products.activeCount} active product
            {stats.products.activeCount === 1 ? "" : "s"} · Member since{" "}
            {stats.member.memberSince
              ? new Date(stats.member.memberSince).getFullYear()
              : "—"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            icon={PackageIcon}
            label="Active Products"
            value={stats.products.activeCount}
          />
          <StatCard
            icon={DollarIcon}
            label="Total Spend"
            value={`₦${stats.spend.totalPaidNGN.toLocaleString()}`}
            sub={`${stats.spend.totalTransactions} transactions`}
          />
          <StatCard
            icon={WalletIcon}
            label="Wallet Balance"
            value={walletNaira}
            sub={stats.wallet.tier ?? undefined}
            accent
          />
          <StatCard
            icon={UsersIcon}
            label="Referral Earnings"
            value={`₦${stats.referrals.totalEarnings.toLocaleString()}`}
            sub={`${stats.referrals.totalReferrals} referrals`}
          />
        </div>

        <div>
          <h2
            className="text-lg font-black mb-4"
            style={{ color: "var(--product-foreground)" }}
          >
            My Products
          </h2>
          <div
            className="rounded-2xl border-2 overflow-hidden"
            style={{
              borderColor: "var(--product-muted)",
              backgroundColor: "var(--product-background)",
            }}
          >
            {stats.products.active.length === 0 ? (
              <div
                className="px-5 py-8 text-center text-sm"
                style={{ color: "var(--product-foreground)", opacity: 0.4 }}
              >
                No active products yet
              </div>
            ) : (
              stats.products.active.map((p, i) => (
                <div
                  key={p.productSlug}
                  className="flex items-center gap-4 px-5 py-3.5"
                  style={{
                    borderBottom:
                      i < stats.products.active.length - 1
                        ? "1px solid var(--product-muted)"
                        : undefined,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--product-foreground)" }}
                    >
                      {p.productName}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--product-foreground)",
                        opacity: 0.4,
                      }}
                    >
                      {p.tier} · {p.status}
                    </p>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                  >
                    renews{" "}
                    {new Date(p.currentPeriodEnd).toLocaleDateString("en-NG")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md group"
              style={{
                borderColor: "var(--product-muted)",
                backgroundColor: "var(--product-background)",
              }}
            >
              <span className="text-2xl">{q.emoji}</span>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--product-foreground)" }}
                >
                  {q.label}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                >
                  {q.sub}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--product-primary)" }}
              />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ── Ecosystem (admin/super_admin) view ─────────────────────────────────────
  const ecosystem = stats && isEcosystemStats(stats) ? stats : null;
  const totalUsers = ecosystem?.userStats.totals.users ?? 0;
  const activeProducts = ecosystem?.userStats.totals.activeProducts ?? 0;
  const totalAdmins = ecosystem?.userStats.totals.admins ?? 0;
  const monthlyRevenue = ecosystem?.ecosystemOverview.totalMonthlyRevenue ?? 0;
  const growth = ecosystem?.userStats.growth;

  return (
    <div className="space-y-8">
      <div
        className="rounded-2xl p-7 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))",
        }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-full blur-3xl"
          style={{
            backgroundColor: "var(--product-secondary)",
            transform: "translate(30%,-30%)",
          }}
        />
        <h1 className="text-2xl font-black text-white mb-1">
          Welcome back, {displayName} 🚀
        </h1>
        <p className="text-white/70 text-sm">
          BoldmindNG Ecosystem — 32+ products, one hub.
        </p>
        {growth && (
          <div className="mt-3">
            <GrowthBadge trend={growth.trend} percentage={growth.percentage} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={UsersIcon}
              label="Total Users"
              value={totalUsers.toLocaleString()}
              sub={`${ecosystem?.userStats.growth.currentMonth ?? 0} this month`}
            />
            <StatCard
              icon={PackageIcon}
              label="Active Products"
              value={activeProducts}
            />
            <StatCard icon={ShieldIcon} label="Admins" value={totalAdmins} />
            <StatCard
              icon={DollarIcon}
              label="Monthly Revenue"
              value={`₦${monthlyRevenue.toLocaleString()}`}
              sub={`Team: ${ecosystem?.ecosystemOverview.totalTeamSize ?? 0}`}
              accent
            />
          </>
        )}
      </div>

      <div>
        <h2
          className="text-lg font-black mb-4"
          style={{ color: "var(--product-foreground)" }}
        >
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md group"
              style={{
                borderColor: "var(--product-muted)",
                backgroundColor: "var(--product-background)",
              }}
            >
              <span className="text-2xl">{q.emoji}</span>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: "var(--product-foreground)" }}
                >
                  {q.label}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                >
                  {q.sub}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--product-primary)" }}
              />
            </Link>
          ))}
        </div>
      </div>

      {!loading && (ecosystem?.userStats.topProducts.length ?? 0) > 0 && (
        <div>
          <h2
            className="text-lg font-black mb-4"
            style={{ color: "var(--product-foreground)" }}
          >
            Top Products by Users
          </h2>
          <div
            className="rounded-2xl border-2 overflow-hidden"
            style={{
              borderColor: "var(--product-muted)",
              backgroundColor: "var(--product-background)",
            }}
          >
            {ecosystem!.userStats.topProducts.map((product, i) => (
              <div
                key={product.productSlug}
                className="flex items-center gap-4 px-5 py-3.5"
                style={{
                  borderBottom:
                    i < ecosystem!.userStats.topProducts.length - 1
                      ? "1px solid var(--product-muted)"
                      : undefined,
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: "var(--product-primary)" }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    {product.productName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--product-foreground)", opacity: 0.4 }}
                  >
                    {product.productSlug}
                  </p>
                </div>
                <span
                  className="text-sm font-black"
                  style={{ color: "var(--product-primary)" }}
                >
                  {product.userCount.toLocaleString()} users
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-black"
            style={{ color: "var(--product-foreground)" }}
          >
            Recent Activity
          </h2>
          <Link
            href="/admin/logs"
            className="text-sm font-bold"
            style={{ color: "var(--product-primary)" }}
          >
            View all →
          </Link>
        </div>
        <div
          className="rounded-2xl border-2 overflow-hidden"
          style={{
            borderColor: "var(--product-muted)",
            backgroundColor: "var(--product-background)",
          }}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (ecosystem?.recentActivity.length ?? 0) === 0 ? (
            <div
              className="px-5 py-8 text-center text-sm"
              style={{ color: "var(--product-foreground)", opacity: 0.4 }}
            >
              No recent activity
            </div>
          ) : (
            ecosystem!.recentActivity.slice(0, 5).map((act, i) => (
              <div
                key={act.id ?? i}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                style={{
                  borderBottom:
                    i < 4 ? "1px solid var(--product-muted)" : undefined,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: "var(--product-primary)" }}
                >
                  {act.user.fullName?.[0] ||
                    act.user.email?.[0]?.toUpperCase() ||
                    "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    <strong>{act.user.fullName || "System"}</strong>{" "}
                    {act.action}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--product-foreground)", opacity: 0.4 }}
                  >
                    {new Date(act.createdAt).toLocaleTimeString()} ·{" "}
                    {act.entityType}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!loading && (ecosystem?.systemHealth.length ?? 0) > 0 && (
        <div>
          <h2
            className="text-lg font-black mb-4"
            style={{ color: "var(--product-foreground)" }}
          >
            System Health
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ecosystem!.systemHealth.map((service) => (
              <div
                key={service.name}
                className="rounded-xl p-4 border-2"
                style={{
                  borderColor: "var(--product-muted)",
                  backgroundColor: "var(--product-background)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${service.status === "healthy" ? "bg-green-400" : service.status === "unhealthy" ? "bg-red-400" : "bg-yellow-400"}`}
                  />
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    {service.name}
                  </p>
                </div>
                {service.responseTime != null && (
                  <p
                    className="text-xs"
                    style={{ color: "var(--product-foreground)", opacity: 0.4 }}
                  >
                    {service.responseTime}ms
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const QUICK_LINKS = [
  {
    href: "/dashboard/products",
    emoji: "📦",
    label: "Products",
    sub: "Manage your subscriptions",
  },
  {
    href: "/dashboard/revenue",
    emoji: "💰",
    label: "Revenue",
    sub: "View earnings & payouts",
  },
  {
    href: "/dashboard/referrals",
    emoji: "🔗",
    label: "Referrals",
    sub: "Track & share your link",
  },
  {
    href: "/settings",
    emoji: "⚙️",
    label: "Settings",
    sub: "Profile & preferences",
  },
] as const;

function UsersIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function PackageIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function ShieldIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function DollarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function WalletIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}
