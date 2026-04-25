'use client';


import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@boldmind-tech/auth';
import { hubAPIAdapter } from '../../lib/hub-api-adapter';
import {
  Users, Package, BarChart3, CheckCircle, AlertCircle,
  DollarSign, Activity, Shield, Zap, ChevronRight, RefreshCw,
} from 'lucide-react';
import type { DashboardStats } from '../../lib/api';

// ─── AdminStatCard ────────────────────────────────────────────────────────────

function AdminStatCard({
  icon: Icon,
  label,
  value,
  change,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  color: string;
  loading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-[#FFC800] transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`text-${color}-600 dark:text-${color}-400`} size={24} />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      {loading
        ? <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
        : <p className="text-2xl font-black text-[#00143C] dark:text-white mt-1">{value}</p>
      }
      <p className="text-[10px] font-bold text-[#FFC800] bg-[#00143C] px-2 py-0.5 rounded-full inline-block mt-3 uppercase tracking-tighter">
        {change}
      </p>
    </motion.div>
  );
}

// ─── AdminControlButton ───────────────────────────────────────────────────────

function AdminControlButton({
  icon: Icon,
  label,
  color,
  href = '#',
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-[#FFC800] hover:bg-white dark:hover:bg-gray-800 transition-all group"
    >
      <div className={`p-4 rounded-xl bg-${color}-500/10 text-${color}-600 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <span className="text-sm font-black text-[#00143C] dark:text-gray-300 uppercase tracking-tighter text-center">
        {label}
      </span>
    </a>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
    </div>
  );
}

// ─── Admin role check ─────────────────────────────────────────────────────────

function isAdmin(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false;
  const u = user as Record<string, unknown>;
  const role = String(u['role'] ?? '').toLowerCase();
  return role === 'admin' || role === 'super_admin' || u['isSuperAdmin'] === true;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user: authUser } = useAuth();

  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hubAPIAdapter.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin(authUser)) fetchData();
    else setLoading(false);
  }, [authUser, fetchData]);

  // ── Access denied ─────────────────────────────────────────────────────────
  if (!loading && !isAdmin(authUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm">You need admin privileges to view this page.</p>
          <a href="/dashboard" className="mt-4 inline-block text-sm text-blue-600 font-semibold hover:underline">
            Go to Dashboard →
          </a>
        </div>
      </div>
    );
  }

  const userName = (authUser as any)?.firstName
    || (authUser as any)?.name?.split(' ')[0]
    || authUser?.email?.split('@')[0]
    || 'Admin';

  const totalUsers    = stats?.userStats?.totals?.users              ?? 0;
  const growthPct     = stats?.userStats?.growth?.percentage         ?? 0;
  const growthTrend   = stats?.userStats?.growth?.trend              ?? 'stable';
  const activeProds   = stats?.userStats?.totals?.activeProducts     ?? 0;
  const totalProds    = stats?.productStats?.total                   ?? 0;
  const revenue       = stats?.ecosystemOverview?.totalMonthlyRevenue ?? 0;
  const adminCount    = stats?.userStats?.totals?.admins             ?? 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 lg:p-10">

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#00143C] to-[#00255C] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC800]/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2 relative z-10">
              Admin Command, <span className="text-[#FFC800]">{userName}</span> 🚀
            </h1>
            <p className="text-blue-100 text-sm relative z-10">
              Managing the global product ecosystem and community vitality.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex-shrink-0 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={fetchData} className="text-red-600 text-sm font-semibold hover:text-red-800">Retry</button>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard icon={Users}      label="Total Community"
          value={totalUsers.toLocaleString()}
          change={`${growthTrend === 'up' ? '+' : ''}${growthPct}% MoM`}
          color="blue" loading={loading} />
        <AdminStatCard icon={Package}    label="Active Products"
          value={activeProds.toString()}
          change={`${totalProds} total`}
          color="purple" loading={loading} />
        <AdminStatCard icon={DollarSign} label="Global Revenue"
          value={`₦${revenue.toLocaleString()}`}
          change="Eco-wide"
          color="amber" loading={loading} />
        <AdminStatCard icon={Shield}     label="Admins"
          value={adminCount.toString()}
          change="Active Staff"
          color="emerald" loading={loading} />
      </div>

      {/* System health + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* System health */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-lg font-black text-[#00143C] dark:text-white mb-6 flex items-center gap-2">
              <Activity size={20} className="text-emerald-500" />
              Service Status
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (stats?.systemHealth ?? []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No services reported</p>
            ) : (
              <div className="space-y-3">
                {stats!.systemHealth.map(service => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      {service.status === 'healthy'
                        ? <CheckCircle className="text-emerald-500 flex-shrink-0" size={18} />
                        : <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                      }
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">
                        {service.name}
                      </span>
                    </div>
                    {service.responseTime != null && (
                      <span className="text-xs font-mono text-gray-400 flex-shrink-0">
                        {service.responseTime}ms
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Update card */}
          <div className="bg-[#00143C] rounded-2xl p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <Zap size={48} />
            </div>
            <h3 className="font-bold mb-2">System Update</h3>
            <p className="text-xs text-blue-200 mb-4 leading-relaxed">
              New identity layers are now live across boldmind-hub 1.2.0
            </p>
            <button className="text-xs font-bold text-[#FFC800] hover:underline flex items-center gap-1">
              View Changelog <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#00143C] dark:text-white flex items-center gap-2">
                <Activity size={20} className="text-blue-500" />
                Live Hub Activity
              </h2>
              <a href="/admin/activity" className="text-sm font-bold text-[#00143C] dark:text-[#FFC800] hover:underline">
                View Full Audit →
              </a>
            </div>
            <div className="flex-1 overflow-auto">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <ActivitySkeleton key={i} />)
              ) : (stats?.recentActivity ?? []).length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-gray-400">No recent activity</p>
                </div>
              ) : (
                stats!.recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors mx-2 my-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                      {activity.user?.fullName?.[0]?.toUpperCase() || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
                        <span className="font-bold">{activity.user?.fullName || 'System'}</span>{' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(activity.createdAt).toLocaleTimeString()} · {activity.entityType}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global controls */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">
        <h2 className="text-lg font-black text-[#00143C] dark:text-white mb-6">Global Controls</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminControlButton icon={Users}    label="Team Management"  color="blue"    href="/admin/users"      />
          <AdminControlButton icon={Shield}   label="Access Control"   color="emerald" href="/admin/roles"      />
          <AdminControlButton icon={Package}  label="Product Catalog"  color="purple"  href="/admin/products"   />
          <AdminControlButton icon={BarChart3} label="Custom Reports"  color="amber"   href="/admin/analytics"  />
        </div>
      </div>
    </div>
  );
}