"use client";

import type { ElementType } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Wallet,
  Gift,
  Download,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { useAnalyticsOverview } from "../../../../lib/hooks";
import { toast } from "sonner";

function KpiCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: ElementType;
  label: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mb-4">
        <Icon size={22} className="text-gray-600 dark:text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      {loading ? (
        <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
      ) : (
        <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
          {value}
        </p>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, loading, error, refresh } = useAnalyticsOverview();

  if (error) toast.error(error.message || "Failed to load analytics");

  const isPersonal = data?.scope === "personal";

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              {isPersonal
                ? "Your spend, wallet, and referral activity"
                : "Deep insights across products, revenue, users & performance"}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <CalendarDays size={16} /> Last 30 days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Download size={16} /> Export
            </button>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards — branch on scope, since /hub/stats returns different data per role */}
      {isPersonal ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            icon={Wallet}
            label="Wallet Balance"
            value={data?.personal?.walletBalanceNaira ?? "—"}
            loading={loading}
          />
          <KpiCard
            icon={BarChart3}
            label="Total Spend"
            value={
              data?.personal
                ? `₦${data.personal.spendNGN.toLocaleString()}`
                : "—"
            }
            loading={loading}
          />
          <KpiCard
            icon={Gift}
            label="Referral Earnings"
            value={
              data?.personal
                ? `₦${data.personal.referralEarnings.toLocaleString()}`
                : "—"
            }
            loading={loading}
          />
          <KpiCard
            icon={Users}
            label="Active Products"
            value={
              data?.personal ? String(data.personal.activeProducts.length) : "—"
            }
            loading={loading}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <KpiCard
            icon={BarChart3}
            label="Total Revenue"
            value={
              data?.totalRevenue != null
                ? `₦${data.totalRevenue.toLocaleString()}`
                : "—"
            }
            loading={loading}
          />
          <KpiCard
            icon={Users}
            label="Active Users"
            value={
              data?.activeUsers != null
                ? data.activeUsers.toLocaleString()
                : "—"
            }
            loading={loading}
          />
        </div>
      )}

      {/* Bottom tables — ecosystem scope only; empty by design for personal scope */}
      {!isPersonal && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
              Top Products by Users
            </h3>
            {/* NOTE: revenue/percentage are always 0 — analyticsApi.getOverview maps
                userStats.topProducts (userCount-ranked) into this shape but has no
                revenue-share field to fill revenue/percentage with. Needs a backend
                field before this table means anything beyond a name-ranked list. */}
            <div className="space-y-1">
              {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  Loading…
                </p>
              ) : (data?.topProductsByRevenue ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No product data yet.
                </p>
              ) : (
                data!.topProductsByRevenue.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b dark:border-gray-800 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 text-xs font-black text-white rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                        {p.name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
              Recent Activity
            </h3>
            <div className="space-y-1">
              {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  Loading…
                </p>
              ) : (data?.recentActivity ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No recent activity.
                </p>
              ) : (
                data!.recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start py-3 border-b dark:border-gray-800 last:border-0 gap-3"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {item.text}
                    </p>
                    <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {item.time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
