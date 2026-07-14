/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  DollarSign,
  Globe,
  Target,
  Loader2,
} from "lucide-react";
import { useDashboardStats } from "../../../../lib/hooks";

// ─── Feature definitions (static meta, data filled from API) ─────────────────

const FEATURES = [
  {
    id: "dashboard",
    title: "Product Ecosystem Dashboard",
    description: "Real-time overview of all products",
    icon: LayoutDashboard,
    color: "#3B82F6", // blue-500
    bgLight: "rgba(59,130,246,0.08)",
    components: [
      "Product status grid",
      "Revenue waterfall",
      "Team allocation",
      "Health scores",
    ],
  },
  {
    id: "revenue",
    title: "Real-time Revenue Tracking",
    description: "Consolidated financials across all products",
    icon: TrendingUp,
    color: "#22C55E",
    bgLight: "rgba(34,197,94,0.08)",
    components: [
      "Monthly/Annual trends",
      "Product contribution",
      "Payment integrations",
      "Forecasting",
    ],
  },
  {
    id: "team",
    title: "Team Management Tools",
    description: "Coordinate your distributed team across products",
    icon: Users,
    color: "#A855F7",
    bgLight: "rgba(168,85,247,0.08)",
    components: [
      "Role-based access",
      "Task assignment",
      "Performance metrics",
      "Communication hub",
    ],
  },
  {
    id: "roadmap",
    title: "Product Launch Roadmap",
    description: "Strategic planning for new product releases",
    icon: Calendar,
    color: "#F97316",
    bgLight: "rgba(249,115,22,0.08)",
    components: [
      "Timeline visualization",
      "Resource planning",
      "Market analysis",
      "Launch checklist",
    ],
  },
  {
    id: "resources",
    title: "Entrepreneur Resources",
    description: "Library of tools and knowledge for founders",
    icon: BookOpen,
    color: "#6366F1",
    bgLight: "rgba(99,102,241,0.08)",
    components: [
      "Documentation",
      "Templates",
      "Case studies",
      "Community forum",
    ],
  },
] as const;

type FeatureId = (typeof FEATURES)[number]["id"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  isActive,
  onClick,
}: {
  feature: (typeof FEATURES)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = feature.icon;
  return (
    <button
      onClick={onClick}
      className="p-6 rounded-2xl border-2 text-left transition-all duration-300 w-full"
      style={{
        borderColor: isActive ? feature.color : "var(--border, #e5e7eb)",
        backgroundColor: isActive ? feature.color : "transparent",
        transform: isActive ? "scale(1.03)" : "scale(1)",
        boxShadow: isActive ? `0 10px 30px ${feature.color}30` : undefined,
      }}
    >
      <Icon
        className="w-8 h-8 mb-3"
        style={{ color: isActive ? "white" : feature.color }}
      />
      <h3
        className="font-bold text-base mb-1"
        style={{ color: isActive ? "white" : "inherit" }}
      >
        {feature.title}
      </h3>
      <p
        className="text-sm"
        style={{ color: isActive ? "rgba(255,255,255,0.8)" : "#6b7280" }}
      >
        {feature.description}
      </p>
    </button>
  );
}

function ComponentPill({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
          {label}
        </span>
      </div>
      <p className="text-xs text-gray-400">Active · Updated recently</p>
    </div>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  loading?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-6 border"
      style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {loading ? (
            <div className="h-7 w-20 bg-gray-200 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>("dashboard");

  const { data: products, loading: productsLoading } = useHubProducts();
  const { data: stats, loading: statsLoading } = useDashboardStats();

  const active = FEATURES.find((f) => f.id === activeFeature)!;

  // Derive stats from real API data
  const productCount = Array.isArray(products)
    ? products.length
    : ((products as any)?.length ?? "—");
  const monthlyRevenue = stats?.ecosystemOverview?.totalMonthlyRevenue
    ? `₦${stats.ecosystemOverview.totalMonthlyRevenue.toLocaleString()}`
    : "—";
  const teamSize = stats?.ecosystemOverview?.totalTeamSize ?? "—";
  const liveProducts = stats?.ecosystemOverview?.liveProducts ?? 0;
  const totalProducts =
    (stats?.ecosystemOverview?.liveProducts ?? 0) +
    (stats?.ecosystemOverview?.buildingProducts ?? 0);
  const targetAchievement =
    totalProducts > 0
      ? `${Math.round((liveProducts / totalProducts) * 100)}%`
      : "—";

  // Top priority products (from stats) — fallback to empty array
  const topPriority = Array.isArray((stats as any)?.topPriority)
    ? (stats as any).topPriority
    : (Array.isArray((stats as any)?.top_priority) ? (stats as any).top_priority : []);

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Ecosystem Features
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            Five powerful modules to manage your product portfolio
          </p>
        </motion.div>

        {/* Feature selector grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES.map((f) => (
            <FeatureCard
              key={f.id}
              feature={f}
              isActive={activeFeature === f.id}
              onClick={() => setActiveFeature(f.id)}
            />
          ))}
        </div>

        {/* Active feature detail */}
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-8"
        >
          <div className="flex items-start gap-5 mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: active.bgLight }}
            >
              <active.icon size={36} style={{ color: active.color }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {active.title}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">{active.description}</p>
            </div>
          </div>

          {/* Components */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {active.components.map((comp) => (
              <ComponentPill key={comp} label={comp} color={active.color} />
            ))}
          </div>

          {/* Product list preview (only for 'dashboard' feature) */}
          {activeFeature === "dashboard" && (
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Live Ecosystem Products
                {productsLoading && (
                  <Loader2
                    size={14}
                    className="inline ml-2 animate-spin text-gray-400"
                  />
                )}
              </h3>
              {productsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={String(i)}
                      className="h-16 bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : Array.isArray(products) && products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(products as any[]).slice(0, 12).map((p: any, i: number) => (
                    <div
                      key={p.id ?? i}
                      className="px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
                    >
                      <p className="text-sm font-semibold truncate text-gray-800 dark:text-white">
                        {p.name ?? p.productName ?? `Product ${i + 1}`}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {p.status ?? "active"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No products returned from API.
                </p>
              )}
            </div>
          )}

          {/* Revenue preview (for 'revenue' feature) */}
          {activeFeature === "revenue" && (
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Priority Products by Revenue
              </h3>
              {statsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : topPriority?.length ? (
                <div className="space-y-2">
                  {topPriority.slice(0, 6).map((p: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; monthlyRevenue: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; }, i: Key | null | undefined) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800"
                    >
                      <span
                        className="w-6 h-6 rounded-full text-xs font-black text-white flex items-center justify-center shrink-0"
                        style={{ backgroundColor: active.color }}
                      >
                        {Number(i ?? 0) + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-gray-800 dark:text-white">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-400">{p.status}</p>
                      </div>
                      <p
                        className="text-sm font-bold"
                        style={{ color: active.color }}
                      >
                        ₦{p.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No revenue data available.
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Quick stats footer — powered by real API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-6">
          <QuickStat
            icon={Globe}
            label="Products"
            value={String(productCount)}
            color="#3B82F6"
            loading={productsLoading}
          />
          <QuickStat
            icon={DollarSign}
            label="Monthly Revenue"
            value={monthlyRevenue}
            color="#22C55E"
            loading={statsLoading}
          />
          <QuickStat
            icon={Users}
            label="Team Members"
            value={String(teamSize)}
            color="#A855F7"
            loading={statsLoading}
          />
          <QuickStat
            icon={Target}
            label="Target Achievement"
            value={targetAchievement}
            color="#F97316"
            loading={statsLoading}
          />
        </div>
      </div>
    </div>
  );
}

function useHubProducts(): { data: any; loading: boolean } {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const result = await response.json();
        setData(Array.isArray(result) ? result : result.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { data, loading };
}

