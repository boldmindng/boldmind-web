'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Target,
  Download, CalendarDays, ArrowUpRight, ArrowDownRight,
  Loader2, RefreshCw,
} from 'lucide-react';
import { SuperNavbar } from '@boldmindng/ui';
import { toast } from 'sonner';

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  change,
  isNegativeGood = false,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: number;
  isNegativeGood?: boolean;
  loading?: boolean;
}) {
  const isPositive = change >= 0;
  // For churn, negative is good — flip colour logic
  const isGood  = isNegativeGood ? !isPositive : isPositive;
  const Arrow   = isPositive ? ArrowUpRight : ArrowDownRight;
  const changeStr = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <Icon size={22} className="text-gray-600 dark:text-gray-400" />
        </div>
        {!loading && change !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <Arrow size={12} />
            {changeStr}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      {loading
        ? <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
        : <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
      }
    </div>
  );
}

// ─── Product row skeleton ─────────────────────────────────────────────────────

function ProductRowSkeleton() {
  return (
    <div className="flex justify-between items-center py-3 border-b dark:border-gray-800 last:border-0 animate-pulse">
      <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="text-right space-y-1">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
        <div className="h-3 w-10 bg-gray-100 dark:bg-gray-800 rounded ml-auto" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState<'revenue' | 'users'>('revenue');

  const load = async () => {
    setLoading(true);
    try {
      const result = await hubAPIAdapter.getAnalyticsOverview();
      setData(result);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <SuperNavbar logoSrc="/logo.png" user={{ name: 'Bobby', role: 'Founder' }} links={[
          { href: '/dashboard',         label: 'Dashboard' },
          { href: '/dashboard/revenue', label: 'Revenue' },
          { href: '/dashboard/roadmap', label: 'Roadmap' },
        ]} />

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Analytics
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                    Deep insights across products, revenue, users & performance
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <CalendarDays size={16} /> Last 30 days
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Download size={16} /> Export
                  </button>
                  <button onClick={load} disabled={loading}
                    className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors disabled:opacity-50">
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <KpiCard icon={BarChart3} label="Total Revenue"
                value={data ? `₦${data.totalRevenue.toLocaleString()}` : '—'}
                change={data?.revenueChange ?? 0}
                loading={loading} />
              <KpiCard icon={Users} label="Active Users"
                value={data ? data.activeUsers.toLocaleString() : '—'}
                change={data?.activeUsersChange ?? 0}
                loading={loading} />
              <KpiCard icon={Target} label="Avg. Churn"
                value={data ? `${data.churnRate.toFixed(1)}%` : '—'}
                change={data?.churnChange ?? 0}
                isNegativeGood
                loading={loading} />
              <KpiCard icon={TrendingUp} label="Conversion Rate"
                value={data ? `${data.conversionRate.toFixed(1)}%` : '—'}
                change={data?.conversionChange ?? 0}
                loading={loading} />
            </div>

            {/* Chart placeholder */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Trend & Product Breakdown
                </h2>
                <div className="flex gap-2">
                  {(['revenue', 'users'] as const).map(tab => (
                    <button key={tab} onClick={() => setPeriod(tab)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors font-medium capitalize ${
                        period === tab
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center gap-2">
                <BarChart3 size={32} className="text-gray-300 dark:text-gray-600" />
                <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                  Plug in Recharts / ApexCharts here using{' '}
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">data.topProductsByRevenue</code>
                </p>
              </div>
            </div>

            {/* Bottom tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Top products */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
                  Top Products by Revenue
                </h3>
                <div className="space-y-1">
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => <ProductRowSkeleton key={i} />)
                    : (data?.topProductsByRevenue ?? []).length === 0
                      ? <p className="text-sm text-gray-400 py-4 text-center">No product revenue data yet.</p>
                      : (data!.topProductsByRevenue).map((p, i) => (
                          <div key={i} className="flex justify-between items-center py-3 border-b dark:border-gray-800 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 text-xs font-black text-white rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                {i + 1}
                              </span>
                              <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{p.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                ₦{p.revenue.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">{p.percentage}%</p>
                            </div>
                          </div>
                        ))
                  }
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
                  Recent Activity
                </h3>
                <div className="space-y-1">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="py-3 border-b dark:border-gray-800 last:border-0 animate-pulse flex justify-between">
                          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                          <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                        </div>
                      ))
                    : (data?.recentActivity ?? []).length === 0
                      ? <p className="text-sm text-gray-400 py-4 text-center">No recent activity.</p>
                      : data!.recentActivity.map((item, i) => (
                          <div key={i} className="flex justify-between items-start py-3 border-b dark:border-gray-800 last:border-0 gap-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.text}</p>
                            <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{item.time}</p>
                          </div>
                        ))
                  }
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}