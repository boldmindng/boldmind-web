/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

// ─── API Adapter ──────────────────────────────────────────────────────────────

const hubAPIAdapter = {
  getRevenueAnalytics: async (): Promise<RevenueAnalytics> => {
    // TODO: Replace with actual API call
    return {
      totalRevenue: 0,
      growthMoM: "—",
      arr: 0,
      topProducts: [],
    };
  },
};

// Types
type TopProduct = {
  id?: string | number;
  name: string;
  revenue: number;
  percentage?: number;
};

type RevenueAnalytics = {
  totalRevenue: number;
  growthMoM: string | number;
  arr: number;
  topProducts: TopProduct[];
};

// ─── StatCard (local) ─────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  loading?: boolean;
}) {
  const palette: Record<string, string> = {
    green:
      "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40",
    emerald:
      "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40",
    blue: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40",
    amber:
      "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40",
  };
  const iconColor: Record<string, string> = {
    green: "text-green-600 dark:text-green-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
  };
  return (
    <div
      className={`rounded-2xl border p-6 ${palette[color] ?? palette["blue"]}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-white/60 dark:bg-black/20 rounded-xl">
          <Icon size={20} className={iconColor[color] ?? iconColor["blue"]} />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      {loading ? (
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      )}
      {sub && !loading && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Bar chart (CSS only — no external lib) ───────────────────────────────────

function RevenueBar({
  name,
  revenue,
  maxRevenue,
  percentage,
}: {
  name: string;
  revenue: number;
  maxRevenue: number;
  percentage: number;
}) {
  const width = maxRevenue > 0 ? Math.max(4, (revenue / maxRevenue) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate flex-1">
          {name}
        </p>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            ₦{revenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">{percentage}%</p>
        </div>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RevenueDashboard() {
  const [data, setData] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await hubAPIAdapter.getRevenueAnalytics();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load revenue data");
        toast.error(err.message || "Failed to load revenue data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = data?.totalRevenue ?? 0;
  const growthMoM = data?.growthMoM ?? "—";
  const arr = data?.arr ?? 0;
  const topProducts = data?.topProducts ?? [];
  const maxRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

  async function load(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const result = await hubAPIAdapter.getRevenueAnalytics();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load revenue data");
      toast.error(err.message || "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between flex-wrap gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Revenue Overview
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  Consolidated financials across all products
                </p>
              </div>
              <button
                onClick={load}
                disabled={loading}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </motion.div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={load}
                  className="text-red-600 text-sm font-medium hover:text-red-800"
                >
                  Retry
                </button>
              </div>
            )}

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard
                icon={DollarSign}
                label="Monthly Revenue"
                loading={loading}
                value={`₦${totalRevenue.toLocaleString()}`}
                color="green"
              />
              <StatCard
                icon={TrendingUp}
                label="MoM Growth"
                loading={loading}
                value={growthMoM}
                color="emerald"
              />
              <StatCard
                icon={ArrowUpRight}
                label="ARR"
                loading={loading}
                value={`₦${arr.toLocaleString()}`}
                sub="Annual Run Rate"
                color="blue"
              />
            </div>

            {/* Top products */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 size={18} className="text-gray-400" />
                  Top Performing Products
                </h2>
                {!loading && topProducts.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {topProducts.length} products
                  </span>
                )}
              </div>

              {loading ? (
                <div className="space-y-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-1.5 animate-pulse">
                      <div className="flex justify-between">
                        <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-center py-10">
                  <BarChart3 size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-400 text-sm">
                    No revenue data available.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {topProducts.map((p, i) => (
                    <motion.div
                      key={p.id ?? i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <RevenueBar
                        name={p.name}
                        revenue={p.revenue}
                        maxRevenue={maxRevenue}
                        percentage={p.percentage ?? 0}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Total */}
              {!loading && topProducts.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Total MRR
                  </p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">
                    ₦{totalRevenue.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
