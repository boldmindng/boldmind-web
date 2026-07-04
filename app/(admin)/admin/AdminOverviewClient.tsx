/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { useDashboardStats } from '../../../lib/hooks';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export default function AdminOverviewClient() {
  const { data: stats, loading, error, refresh } = useDashboardStats();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-sm" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
          Failed to load: {error.message}
        </p>
        <button
          onClick={refresh}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--product-primary)' }}
        >
          Retry
        </button>
      </div>
    );
  }

  const totals = stats?.userStats?.totals;

  const STAT_CARDS = [
    {
      label: 'Total Users',
      value: totals?.users?.toLocaleString() ?? '—',
      icon: '👥',
      accent: false,
    },
    {
      label: 'Active Products',
      value: totals?.activeProducts?.toString() ?? '—',
      icon: '📦',
      accent: false,
    },
    {
      label: 'Admin Accounts',
      value: totals?.admins?.toString() ?? '—',
      icon: '🛡️',
      accent: false,
    },
    {
      label: 'Monthly Revenue',
      value: `₦${(stats?.ecosystemOverview?.totalMonthlyRevenue ?? 0).toLocaleString()}`,
      icon: '💰',
      accent: true,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--product-foreground)' }}>
            Admin Overview
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
            Real-time BoldmindNG ecosystem metrics.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)' }}
        >
          🔐 Admin
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: card.accent ? 'var(--product-primary)' : 'var(--product-background)',
              // Use border shorthand with CSS var so colour is driven by the token system,
              // not Tailwind's default border palette.
              border: `2px solid ${card.accent ? 'var(--product-primary)' : 'var(--product-muted)'}`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{card.icon}</span>
              <span
                className="text-xs font-black uppercase tracking-widest"
                style={{
                  color: card.accent ? 'rgba(255,255,255,0.65)' : 'var(--product-foreground)',
                  opacity: card.accent ? 1 : 0.45,
                }}
              >
                {card.label}
              </span>
            </div>
            {loading ? (
              <div
                className="h-8 w-20 rounded animate-pulse"
                style={{ backgroundColor: card.accent ? 'rgba(255,255,255,0.2)' : 'var(--product-muted)' }}
              />
            ) : (
              <p
                className="text-3xl font-black"
                style={{ color: card.accent ? 'white' : 'var(--product-foreground)' }}
              >
                {card.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/users',    icon: '👥', label: 'Manage Users',   sub: 'View, role, deactivate'     },
          { href: '/admin/products', icon: '📦', label: 'Products',       sub: 'Ecosystem product registry' },
          { href: '/admin/logs',     icon: '📋', label: 'Activity Logs',  sub: 'Full audit trail'           },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:shadow-md"
            style={{
              border: '2px solid var(--product-muted)',
              backgroundColor: 'var(--product-background)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--product-primary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--product-muted)';
            }}
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--product-foreground)' }}>
                {item.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.45 }}>
                {item.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* System health */}
      {!loading && (stats?.systemHealth?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-base font-black mb-4" style={{ color: 'var(--product-foreground)' }}>
            System Health
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats!.systemHealth.map((svc: any) => (
              <div
                key={svc.name}
                className="rounded-xl p-4"
                style={{
                  border: '2px solid var(--product-muted)',
                  backgroundColor: 'var(--product-background)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {/* Status dot — uses Tailwind bg-* only for semantic colours
                      (green/red/yellow are not CSS var driven here intentionally,
                       since status colours are universal, not product-themed). */}
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      svc.status === 'healthy'
                        ? 'bg-green-400'
                        : svc.status === 'unhealthy'
                          ? 'bg-red-400'
                          : 'bg-yellow-400'
                    }`}
                  />
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--product-foreground)' }}
                  >
                    {svc.name}
                  </p>
                </div>
                {svc.responseTime != null && (
                  <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
                    {svc.responseTime}ms
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {!loading && (stats?.recentActivity?.length ?? 0) > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black" style={{ color: 'var(--product-foreground)' }}>
              Recent Activity
            </h2>
            <Link
              href="/admin/logs"
              className="text-sm font-bold"
              style={{ color: 'var(--product-primary)' }}
            >
              View all →
            </Link>
          </div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '2px solid var(--product-muted)',
              backgroundColor: 'var(--product-background)',
            }}
          >
            {stats!.recentActivity.slice(0, 8).map((act: any, i: number) => (
              <div
                key={act.id ?? i}
                className="flex items-center gap-4 px-5 py-3.5"
                style={{
                  borderBottom: i < 7 ? '1px solid var(--product-muted)' : undefined,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ backgroundColor: 'var(--product-primary)' }}
                >
                  {act.user?.email?.[0]?.toUpperCase() ?? 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: 'var(--product-foreground)' }}>
                    <strong>{act.user?.fullName || act.user?.email || 'System'}</strong>{' '}
                    {act.action}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
                    {new Date(act.createdAt).toLocaleString('en-NG')} · {act.entityType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}