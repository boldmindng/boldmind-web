"use client";

import Link from "next/link";
import {
  useAuth,
  useDashboardStats,
  isPersonalStats,
  isEcosystemStats,
} from "../../../../lib/hooks";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  DollarSign,
  Wallet,
  Users,
  Shield,
  Link2,
  Settings,
} from "lucide-react";

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
        className="text-3xl font-black tabular-nums"
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

// Trend colors were `text-green-400`/`text-red-400` — switched to the
// `--color-success`/`--color-error` tokens the rest of the dashboard uses
// for the same up/down semantics (AdminUsersPage's verified/status pills),
// instead of a separate ad-hoc green/red pair. The neutral "stable" case
// stays a plain translucent white, since this badge only ever renders on
// the dark hero gradient card.
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
      ? "var(--color-success)"
      : trend === "down"
        ? "var(--color-error)"
        : "rgba(255,255,255,0.4)";
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold"
      style={{ color }}
    >
      <Icon size={13} />
      <span className="tabular-nums">
        {percentage > 0 ? "+" : ""}
        {percentage}%
      </span>{" "}
      this month
    </span>
  );
}

// Icons were emoji (📦💰🔗⚙️); swapped for lucide-react to match the rest
// of the ecosystem's move away from emoji-as-iconography.
const QUICK_LINKS = [
  {
    href: "/dashboard/products",
    Icon: Package,
    label: "Products",
    sub: "Manage your subscriptions",
  },
  {
    href: "/dashboard/revenue",
    Icon: DollarSign,
    label: "Revenue",
    sub: "View earnings & payouts",
  },
  {
    href: "/dashboard/referrals",
    Icon: Link2,
    label: "Referrals",
    sub: "Track & share your link",
  },
  {
    href: "/settings",
    Icon: Settings,
    label: "Settings",
    sub: "Profile & preferences",
  },
] as const;

function QuickLinkCard({ q }: { q: (typeof QUICK_LINKS)[number] }) {
  return (
    <Link
      href={q.href}
      className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md group"
      style={{
        borderColor: "var(--product-muted)",
        backgroundColor: "var(--product-background)",
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: "var(--product-highlight)" }}
      >
        <q.Icon
          size={16}
          style={{ color: "var(--product-primary)" }}
          aria-hidden="true"
        />
      </div>
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
            icon={Package}
            label="Active Products"
            value={stats.products.activeCount}
          />
          <StatCard
            icon={DollarSign}
            label="Total Spend"
            value={`₦${stats.spend.totalPaidNGN.toLocaleString()}`}
            sub={`${stats.spend.totalTransactions} transactions`}
          />
          <StatCard
            icon={Wallet}
            label="Wallet Balance"
            value={walletNaira}
            sub={stats.wallet.tier ?? undefined}
            accent
          />
          <StatCard
            icon={Users}
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
            <QuickLinkCard key={q.href} q={q} />
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
              icon={Users}
              label="Total Users"
              value={totalUsers.toLocaleString()}
              sub={`${ecosystem?.userStats.growth.currentMonth ?? 0} this month`}
            />
            <StatCard
              icon={Package}
              label="Active Products"
              value={activeProducts}
            />
            <StatCard icon={Shield} label="Admins" value={totalAdmins} />
            <StatCard
              icon={DollarSign}
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
            <QuickLinkCard key={q.href} q={q} />
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
                  className="text-sm font-black tabular-nums"
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
          {/* Health dots stay fixed green/red/yellow regardless of product —
              a universal semantic (healthy/unhealthy/degraded), same
              reasoning as StatusBadge's live/building/hiring variants. */}
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
                    className="text-xs tabular-nums"
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
