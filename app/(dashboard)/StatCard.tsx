"use client";

import { LucideIcon } from 'lucide-react';
import { cn } from '@boldmind-tech/ui';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br rounded-2xl border p-6 transition-all hover:shadow-lg",
        `from-${color}-50 to-${color}-100 dark:from-${color}-950/30 dark:to-${color}-900/20`,
        `border-${color}-200 dark:border-${color}-800`,
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 bg-${color}-500/10 rounded-xl`}>
          <Icon className={`text-${color}-600 dark:text-${color}-400`} size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}