"use client";

import { motion } from "framer-motion";
import { TrendingUp, Globe, Briefcase, DollarSign } from "lucide-react";

export function FlywheelMetrics() {
  // These would ideally come from a global ecosystem API
  const metrics = [
    {
      label: "Active Businesses",
      value: "1,240",
      change: "+12% this month",
      icon: Briefcase,
      color: "blue",
    },
    {
      label: "Products Listed",
      value: "312",
      change: "+8 new this week",
      icon: Globe,
      color: "emerald",
    },
    {
      label: "Revenue Processed",
      value: "₦8.4M",
      change: "+24% growth",
      icon: DollarSign,
      color: "amber",
    },
    {
      label: "Active Users",
      value: "45.2K",
      change: "+2.1K today",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-[#00143C] dark:text-white">
          Flywheel Metrics
        </h3>
        <p className="text-sm text-gray-500 font-medium">
          Global Ecosystem Performance
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl border shadow-sm group hover:border-[#FFC800] transition-all"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-${metric.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <metric.icon
                className={`text-${metric.color}-600 dark:text-${metric.color}-400`}
                size={20}
              />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
              {metric.label}
            </p>
            <p className="text-2xl font-black text-[#00143C] dark:text-white mt-1">
              {metric.value}
            </p>
            <p
              className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${
                metric.color === "emerald"
                  ? "text-emerald-500"
                  : metric.color === "blue"
                    ? "text-blue-500"
                    : metric.color === "amber"
                      ? "text-amber-500"
                      : "text-purple-500"
              }`}
            >
              {metric.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-linear-to-r from-[#FFC800]/5 to-transparent p-6 rounded-2xl border border-[#FFC800]/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FFC800] rounded-full flex items-center justify-center shadow-inner">
            <TrendingUp className="text-[#00143C]" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#00143C] dark:text-white">
              Trending Niche
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Education Tech is growing at{" "}
              <span className="text-[#00143C] dark:text-[#FFC800] font-black">
                34% WoW
              </span>
            </p>
          </div>
        </div>
        <button className="px-6 py-2 bg-[#00143C] text-[#FFC800] text-sm font-bold rounded-lg hover:shadow-lg active:scale-95 transition-all">
          View Market Intelligence →
        </button>
      </div>
    </div>
  );
}
