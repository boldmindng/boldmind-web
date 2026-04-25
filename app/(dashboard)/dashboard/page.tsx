'use client';

import Link from 'next/link';
import { useAuth } from '@boldmind-tech/auth';
import { useDashboardStats } from '../../../lib/hooks';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { DashboardStats } from '../../../lib/api';

// ─── StatCard ─────────────────────────────────────────────────────────────────

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
        backgroundColor: accent ? 'var(--product-primary)' : 'var(--product-background)',
        borderColor:     accent ? 'var(--product-primary)' : 'var(--product-muted)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: accent ? 'rgba(255,255,255,0.2)' : 'var(--product-highlight)',
            color: accent ? 'white' : 'var(--product-primary)',
          }}
        >
          <Icon size={18} />
        </div>
        <span
          className="text-xs font-black uppercase tracking-widest"
          style={{
            color: accent ? 'rgba(255,255,255,0.7)' : 'var(--product-foreground)',
            opacity: accent ? 1 : 0.5,
          }}
        >
          {label}
        </span>
      </div>
      <p className="text-3xl font-black" style={{ color: accent ? 'white' : 'var(--product-foreground)' }}>
        {value}
      </p>
      {sub && (
        <p
          className="text-xs mt-1"
          style={{ color: accent ? 'rgba(255,255,255,0.6)' : 'var(--product-foreground)', opacity: accent ? 1 : 0.5 }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 border-2 animate-pulse"
      style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl" style={{ backgroundColor: 'var(--product-muted)' }} />
        <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
      </div>
      <div className="h-9 w-24 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
    </div>
  );
}

function SkeletonActivityRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
      <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--product-muted)' }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-48 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
        <div className="h-2 w-28 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
      </div>
    </div>
  );
}

// ─── Growth badge ─────────────────────────────────────────────────────────────

function GrowthBadge({ trend, percentage }: { trend: 'up' | 'down' | 'stable'; percentage: number }) {
  const Icon  = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const color = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/40';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${color}`}>
      <Icon size={13} />
      {percentage > 0 ? '+' : ''}{percentage}% this month
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HubDashboardPage() {
  const { user } = useAuth();
  const { data: stats, loading, error, refresh } = useDashboardStats();

  const displayName =
    (user as any)?.firstName || user?.email?.split('@')[0] || 'Founder';

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-sm" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
          Failed to load dashboard: {error.message}
        </p>
        <button
          onClick={refresh}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: 'var(--product-primary)', color: 'white' }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── Stat values (safe fallbacks while loading) ───────────────────────────
  const totalUsers     = stats?.userStats?.totals?.users   ?? 0;
  const activeProducts = stats?.userStats?.totals?.activeProducts ?? 0;
  const totalAdmins    = stats?.userStats?.totals?.admins   ?? 0;
  const monthlyRevenue = stats?.ecosystemOverview?.totalMonthlyRevenue ?? 0;
  const growth         = stats?.userStats?.growth;

  return (
    <div className="space-y-8">

      {/* ── Greeting banner ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-7 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))',
        }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-full blur-3xl"
          style={{ backgroundColor: 'var(--product-secondary)', transform: 'translate(30%, -30%)' }}
        />
        <h1 className="text-2xl font-black text-white mb-1">
          Welcome back, {displayName} 🚀
        </h1>
        <p className="text-white/70 text-sm">BoldMind Ecosystem — 32+ products, one hub.</p>
        {growth && (
          <div className="mt-3">
            <GrowthBadge trend={growth.trend} percentage={growth.percentage} />
          </div>
        )}
      </div>

      {/* ── Stats grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={UsersIcon}
              label="Total Users"
              value={totalUsers.toLocaleString()}
              sub={`${stats?.userStats?.growth?.currentMonth ?? 0} this month`}
            />
            <StatCard
              icon={PackageIcon}
              label="Active Products"
              value={activeProducts}
            />
            <StatCard
              icon={ShieldIcon}
              label="Admins"
              value={totalAdmins}
            />
            <StatCard
              icon={DollarIcon}
              label="Monthly Revenue"
              value={`₦${monthlyRevenue.toLocaleString()}`}
              sub={`Team: ${stats?.ecosystemOverview?.totalTeamSize ?? 0}`}
              accent
            />
          </>
        )}
      </div>

      {/* ── Quick actions ────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-black mb-4" style={{ color: 'var(--product-foreground)' }}>
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map(q => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md group"
              style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}
              onMouseEnter={(e: { currentTarget: HTMLElement; }) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--product-primary)')}
              onMouseLeave={(e: { currentTarget: HTMLElement; }) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--product-muted)')}
            >
              <span className="text-2xl">{q.emoji}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--product-foreground)' }}>
                  {q.label}
                </p>
                <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
                  {q.sub}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--product-primary)' }}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Top products ─────────────────────────────────────────────────── */}
      {!loading && (stats?.userStats?.topProducts?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-lg font-black mb-4" style={{ color: 'var(--product-foreground)' }}>
            Top Products by Users
          </h2>
          <div
            className="rounded-2xl border-2 overflow-hidden"
            style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}
          >
            {stats!.userStats.topProducts.map((product, i) => (
              <div
                key={product.productSlug}
                className="flex items-center gap-4 px-5 py-3.5"
                style={{ borderBottom: i < stats!.userStats.topProducts.length - 1 ? '1px solid var(--product-muted)' : undefined }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ backgroundColor: 'var(--product-primary)' }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--product-foreground)' }}>
                    {product.productName}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
                    {product.productSlug}
                  </p>
                </div>
                <span className="text-sm font-black" style={{ color: 'var(--product-primary)' }}>
                  {product.userCount.toLocaleString()} users
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent activity ───────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black" style={{ color: 'var(--product-foreground)' }}>
            Recent Activity
          </h2>
          <Link href="/admin/activity" className="text-sm font-bold" style={{ color: 'var(--product-primary)' }}>
            View all →
          </Link>
        </div>

        <div
          className="rounded-2xl border-2 overflow-hidden"
          style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonActivityRow key={i} />)
          ) : (stats?.recentActivity?.length ?? 0) === 0 ? (
            <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
              No recent activity
            </div>
          ) : (
            stats!.recentActivity.slice(0, 5).map((act, i) => (
              <div
                key={act.id ?? i}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                style={{
                  borderBottom: i < 4 ? '1px solid var(--product-muted)' : undefined,
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '')}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ backgroundColor: 'var(--product-primary)' }}
                >
                  {act.user?.fullName?.[0] || act.user?.email?.[0]?.toUpperCase() || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--product-foreground)' }}>
                    <strong>{act.user?.fullName || 'System'}</strong> {act.action}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
                    {new Date(act.createdAt).toLocaleTimeString()} · {act.entityType}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── System health ─────────────────────────────────────────────────── */}
      {!loading && (stats?.systemHealth?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-lg font-black mb-4" style={{ color: 'var(--product-foreground)' }}>
            System Health
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats!.systemHealth.map(service => (
              <div
                key={service.name}
                className="rounded-xl p-4 border-2"
                style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      service.status === 'healthy'
                        ? 'bg-green-400'
                        : service.status === 'unhealthy'
                        ? 'bg-red-400'
                        : 'bg-yellow-400'
                    }`}
                  />
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--product-foreground)' }}>
                    {service.name}
                  </p>
                </div>
                {service.responseTime != null && (
                  <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
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

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { href: '/dashboard/products', emoji: '📦', label: 'Products',  sub: 'Manage your subscriptions' },
  { href: '/dashboard/revenue',  emoji: '💰', label: 'Revenue',   sub: 'View earnings & payouts' },
  { href: '/dashboard/team',     emoji: '👥', label: 'Team',      sub: 'Manage team members' },
  { href: '/dashboard/settings', emoji: '⚙️', label: 'Settings',  sub: 'Profile & preferences' },
] as const;

// ─── Inline icon components (avoids lucide re-imports) ────────────────────────

function UsersIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function PackageIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}
function ShieldIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function DollarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}