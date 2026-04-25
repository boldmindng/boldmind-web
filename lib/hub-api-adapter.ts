

import {
  hubAPI,
  adminAPI,
  notificationAPI,
  type DashboardStats,
} from './api';

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductFilter {
  status?: string;
  category?: string;
}

export interface HubProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  status: string;
  category?: string;
  monthlyRevenue?: number;
  priority?: number;
  [key: string]: unknown;
}

async function getProducts(filter?: ProductFilter): Promise<HubProduct[]> {
  const res = await hubAPI.getProducts();
  let products = (res.data ?? []) as HubProduct[];

  if (filter?.status) {
    products = products.filter(p => p.status === filter.status);
  }
  if (filter?.category) {
    products = products.filter(p => p.category === filter.category);
  }
  return products;
}

async function deleteProduct(id: string): Promise<void> {
  // Hub product delete goes through adminAPI
  await adminAPI.users.delete(id);
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role: string;
  avatarUrl?: string;
  avatar?: string;
  productsCount?: number;
  isActive?: boolean;
  [key: string]: unknown;
}

async function getTeamMembers(): Promise<TeamMember[]> {
  const res = await hubAPI.team.list();
  return (res ?? []) as TeamMember[];
}

async function inviteTeamMember(data: {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}): Promise<unknown> {
  const res = await hubAPI.team.invite(data);
  return res.data;
}

async function removeTeamMember(userId: string): Promise<void> {
  await hubAPI.team.remove(userId);
}

// ─── Revenue ──────────────────────────────────────────────────────────────────

export interface RevenueAnalytics {
  totalRevenue: number;
  growthMoM: string;
  arr: number;
  topProducts: Array<{
    id: string;
    name: string;
    status: string;
    revenue: number;
    percentage?: number;
  }>;
  monthlyTrend?: Array<{ month: string; revenue: number }>;
}

async function getRevenueAnalytics(): Promise<RevenueAnalytics> {
  const stats = await hubAPI.getDashboardStats();

  const totalRevenue = stats.ecosystemOverview?.totalMonthlyRevenue ?? 0;
  const topPriority  = stats.ecosystemOverview?.topPriorityProducts ?? [];

  // Derive month-over-month growth from userStats growth (proxy until a
  // dedicated /hub/revenue endpoint exists)
  const growth = stats.userStats?.growth;
  const growthMoM =
    growth
      ? `${growth.trend === 'up' ? '+' : growth.trend === 'down' ? '-' : ''}${Math.abs(growth.percentage)}%`
      : '0%';

  return {
    totalRevenue,
    growthMoM,
    arr: totalRevenue * 12,
    topProducts: topPriority.map((p, i) => ({
      id: String(i),
      name: p.name,
      status: p.status,
      revenue: p.monthlyRevenue,
      percentage: totalRevenue > 0
        ? Math.round((p.monthlyRevenue / totalRevenue) * 100)
        : 0,
    })),
  };
}

// ─── Dashboard stats (pass-through) ──────────────────────────────────────────

async function getDashboardStats(): Promise<DashboardStats> {
  return hubAPI.getDashboardStats();
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  totalRevenue: number;
  revenueChange: number;          // percentage
  activeUsers: number;
  activeUsersChange: number;
  churnRate: number;
  churnChange: number;
  conversionRate: number;
  conversionChange: number;
  topProductsByRevenue: Array<{ name: string; revenue: number; percentage: number }>;
  recentActivity: Array<{ text: string; time: string }>;
}

async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  // Try the admin analytics endpoint first; fall back to dashboard stats
  let adminData: unknown = null;
  try {
    adminData = await adminAPI.analytics.overview();
  } catch {
    // endpoint may not be live yet
  }

  const stats = await hubAPI.getDashboardStats();
  const totalRevenue   = stats.ecosystemOverview?.totalMonthlyRevenue  ?? 0;
  const activeUsers    = stats.userStats?.totals?.users                ?? 0;
  const growth         = stats.userStats?.growth;
  const topPriority    = stats.ecosystemOverview?.topPriorityProducts  ?? [];

  const recentActivity = (stats.recentActivity ?? []).slice(0, 5).map(act => ({
    text: `${act.user?.fullName ?? 'System'} ${act.action} (${act.entityType})`,
    time: relativeTime(act.createdAt),
  }));

  return {
    totalRevenue,
    revenueChange: growth?.percentage ?? 0,
    activeUsers,
    activeUsersChange: growth?.percentage ?? 0,
    churnRate: 0,          // not yet in API — replace when endpoint exists
    churnChange: 0,
    conversionRate: 0,
    conversionChange: 0,
    topProductsByRevenue: topPriority.map(p => ({
      name: p.name,
      revenue: p.monthlyRevenue,
      percentage: totalRevenue > 0
        ? Math.round((p.monthlyRevenue / totalRevenue) * 100)
        : 0,
    })),
    recentActivity,
  };
}

// ─── Announcements ────────────────────────────────────────────────────────────
// The NestJS server does not yet have an /announcements endpoint.
// These functions hit a stub that returns an empty list and logs a warning
// until the endpoint is registered. Swap the path below when ready.

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
}

const ANNOUNCEMENTS_STUB: Announcement[] = [];

async function getAnnouncements(): Promise<Announcement[]> {
  // TODO: replace with apiFetch('/hub/announcements') when endpoint is ready
  console.warn('[hubAPIAdapter] getAnnouncements: endpoint not yet registered, returning stub.');
  return ANNOUNCEMENTS_STUB;
}

async function createAnnouncement(data: {
  title: string;
  content: string;
  priority: string;
}): Promise<Announcement> {
  // TODO: replace with apiFetch('/hub/announcements', { method: 'POST', body: JSON.stringify(data) })
  console.warn('[hubAPIAdapter] createAnnouncement: endpoint not yet registered, returning optimistic stub.');
  const stub: Announcement = {
    id:        crypto.randomUUID(),
    title:     data.title,
    content:   data.content,
    priority:  data.priority as Announcement['priority'],
    createdAt: new Date().toISOString(),
  };
  ANNOUNCEMENTS_STUB.unshift(stub);
  return stub;
}

// ─── Notifications (pass-through) ────────────────────────────────────────────

async function getNotifications(page = 1, limit = 20) {
  return notificationAPI.list(page, limit);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  <  1) return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── Exported adapter object ──────────────────────────────────────────────────

export const hubAPIAdapter = {
  // Products
  getProducts,
  deleteProduct,

  // Team
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember,

  // Revenue / analytics
  getRevenueAnalytics,
  getAnalyticsOverview,
  getDashboardStats,

  // Announcements
  getAnnouncements,
  createAnnouncement,

  // Notifications
  getNotifications,
} as const;