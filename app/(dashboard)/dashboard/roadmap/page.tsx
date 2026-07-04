'use client';

import { motion } from 'framer-motion';
import { Target, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { SuperNavbar } from '@boldmindng/ui';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'building' | 'planned' | 'concept' | 'live';

interface Milestone {
  name: string;
  quarter: string;
  progress: number;   // 0–100
  status: Status;
}

// ─── Static data (replace with API call when endpoint is available) ───────────

const MILESTONES: Milestone[] = [
  { name: 'EmailScraper Pro', quarter: 'Q2 2026', progress: 65, status: 'building' },
  { name: 'Naija FitHer',     quarter: 'Q2 2026', progress: 45, status: 'building' },
  { name: 'PlanAI Suite',     quarter: 'Q3 2026', progress: 20, status: 'planned'  },
  { name: 'SAFE AI',          quarter: 'Q4 2026', progress: 10, status: 'concept'  },
  { name: 'StoreForge',       quarter: 'Q4 2026', progress:  5, status: 'concept'  },
];

const SUMMARY = {
  totalPlanned: 31,
  q2Launches:   8,
  inProgress:   12,
  completed:    5,
};

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<Status, string> = {
  building: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  planned:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  concept:  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  live:     'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const PROGRESS_COLOR: Record<Status, string> = {
  building: 'bg-amber-500',
  planned:  'bg-blue-500',
  concept:  'bg-purple-500',
  live:     'bg-green-500',
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  const palette: Record<string, string> = {
    blue:    'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400',
    amber:   'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400',
    green:   'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40 text-green-600 dark:text-green-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400',
  };
  return (
    <div className={`rounded-2xl border p-6 ${palette[color] ?? palette['blue']}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-white/60 dark:bg-black/20 rounded-xl">
          <Icon size={20} />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

// ─── Progress row ─────────────────────────────────────────────────────────────

function MilestoneRow({ item, index }: { item: Milestone; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="space-y-2.5"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{item.quarter}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 tabular-nums">
            {item.progress}%
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[item.status]}`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${PROGRESS_COLOR[item.status]}`}
          initial={{ width: 0 }}
          animate={{ width: `${item.progress}%` }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.06 + 0.1 }}
        />
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoadmapDashboard() {
  const byQuarter = MILESTONES.reduce<Record<string, Milestone[]>>((acc, m) => {
    if (!acc[m.quarter]) acc[m.quarter] = [];
    acc[m.quarter].push(m);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <DashboardSidebar  />

      <div className="flex-1 flex flex-col">
        <SuperNavbar logoSrc="/logo.png" user={{ name: 'Bobby', role: 'Founder' }} links={[
          { href: '/dashboard',         label: 'Dashboard' },
          { href: '/dashboard/revenue', label: 'Revenue' },
          { href: '/dashboard/roadmap', label: 'Roadmap' },
        ]} />

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Roadmap</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Upcoming launches and development progress
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <StatCard icon={Target}      label="Total Planned" value={String(SUMMARY.totalPlanned)} color="blue"    />
              <StatCard icon={Calendar}    label="Q2 2026"       value={String(SUMMARY.q2Launches)}   color="amber"   />
              <StatCard icon={Clock}       label="In Progress"   value={String(SUMMARY.inProgress)}   color="green"   />
              <StatCard icon={CheckCircle2} label="Completed"    value={String(SUMMARY.completed)}    color="emerald" />
            </div>

            {/* Milestones by quarter */}
            <div className="space-y-8">
              {Object.entries(byQuarter).map(([quarter, items]) => (
                <div key={quarter}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300">
                      {quarter}
                    </span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                    <span className="text-xs text-gray-400">{items.length} product{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-6">
                    {items.map((item, i) => (
                      <MilestoneRow key={item.name} item={item} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Placeholder note */}
            <p className="text-xs text-gray-300 dark:text-gray-600 text-center pb-4">
              Data is static until <code>/hub/roadmap</code> endpoint is registered in NestJS.
              Add <code>getRoadmap()</code> to <code>hub-api-adapter.ts</code> to make it live.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}