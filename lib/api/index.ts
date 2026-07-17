import {
  hubAPI,
  walletAPI,
  paymentAPI,
  adminAPI,
  userMeAPI,
  usersAPI,
  type HubDashboardStats,
  type HubStatsResponse,
  type HubPersonalStats,
  type HubEcosystemStats,
  type ReferralStats,
  type WalletBalanceResponse,
} from "@boldmindng/api-client";
import { getPillarSummary, type PillarSummary } from "@boldmindng/utils";

export type DashboardStats = HubDashboardStats;
export type {
  HubStatsResponse,
  HubPersonalStats,
  HubEcosystemStats,
  ReferralStats,
  WalletBalanceResponse,
};

// ─── Dashboard (subscriptions/activity/wallet widget) ───────────────────────
// GET /hub/dashboard — unchanged, still the right route for the dashboard
// home page's activity feed + subscription list.

export const dashboardApi = {
  getStats: hubAPI.getDashboard,
  getPillarStats: async (): Promise<{ data: PillarSummary[] }> => ({
    data: getPillarSummary(),
  }),
};

// ─── Stats overview — the new role-aware endpoint ────────────────────────────
// GET /hub/stats — replaces the old split between a broken "hub" call and
// adminAPI.dashboard(). One call, server decides personal vs ecosystem
// shape based on the JWT's role. Use `res.data.scope` to discriminate.

export const statsApi = {
  getOverview: hubAPI.getStats,
};

// adminOverviewApi kept for anywhere that specifically wants the raw
// admin.controller.ts shape (e.g. the (admin)/admin dashboard, which is a
// separate, more detailed view than the Hub's own role-aware /hub/stats).
export const adminOverviewApi = {
  getStats: adminAPI.dashboard,
};

export const adminApi = {
  getStats: adminOverviewApi.getStats,
  getUsers: adminAPI.users.list,
  getUser: (id: string) => usersAPI.get(id),
  updateUserRole: adminAPI.users.updateRole,
  getRevenue: adminAPI.revenue,
  getWaitlist: adminAPI.waitlist.list,
  inviteFromWaitlist: adminAPI.waitlist.invite,
  getActivityLogs: adminAPI.logs,
};

// ─── Referrals ────────────────────────────────────────────────────────────

export const referralApi = {
  getStats: hubAPI.getReferralStats,
  generate: hubAPI.generateReferral,
};

// ─── Wallet ───────────────────────────────────────────────────────────────

export const walletApi = {
  getBalance: walletAPI.getBalance,
  getLedger: walletAPI.getLedger,
  initiateTopUp: walletAPI.initiateTopUp,
  upgradeTier: walletAPI.upgradeTier,
};

// ─── Subscriptions ──────────────────────────────────────────────────────────

export const subscriptionApi = {
  getMySubscriptions: paymentAPI.subscriptions,
  initializePayment: (productSlug: string, tier: string) =>
    paymentAPI.initialize({ productSlug, tier }),
};

// ─── Profile / onboarding ─────────────────────────────────────────────────

export const profileApi = { update: userMeAPI.updateProfile };
export const onboardingApi = { complete: userMeAPI.onboarding };

// ─── Analytics overview — now sourced from GET /hub/stats ───────────────────
// FIXED again: this used to hit adminAPI.dashboard() unconditionally, which
// 403s for a regular (non-admin) user. /hub/stats is role-aware, so the
// same call now works for every authenticated user and the UI branches on
// `scope` instead of assuming ecosystem-wide numbers.

export interface AnalyticsOverview {
  scope: "personal" | "ecosystem";
  totalRevenue: number | null;
  activeUsers: number | null;
  revenueChange: number | null;
  activeUsersChange: number | null;
  churnRate: number | null;
  churnChange: number | null;
  conversionRate: number | null;
  conversionChange: number | null;
  topProductsByRevenue: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
  recentActivity: Array<{ text: string; time: string }>;
  // personal-only fields
  personal?: {
    spendNaira: string;
    walletBalanceNaira: string;
    activeProducts: string[];
    referralEarnings: number;
  };
}

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const res = await statsApi.getOverview();
    const stats = res.data;

    if (stats.scope === "personal") {
      return {
        scope: "personal",
        totalRevenue: null,
        activeUsers: null,
        revenueChange: null,
        activeUsersChange: null,
        churnRate: null,
        churnChange: null,
        conversionRate: null,
        conversionChange: null,
        topProductsByRevenue: [],
        recentActivity: [],
        personal: {
          spendNaira: stats.spend.totalNaira,
          walletBalanceNaira: stats.wallet.balanceNaira,
          activeProducts: stats.products.slugs,
          referralEarnings: stats.referrals.totalEarnings,
        },
      };
    }

    // ecosystem scope — admin/super_admin
    return {
      scope: "ecosystem",
      totalRevenue: stats.ecosystemOverview.totalMonthlyRevenue,
      activeUsers: stats.userStats.totals.users,
      revenueChange: null,
      activeUsersChange: stats.userStats.growth.percentage ?? null,
      churnRate: null,
      churnChange: null,
      conversionRate: null,
      conversionChange: null,
      topProductsByRevenue: stats.userStats.topProducts
        .map((p) => ({ name: p.productName, revenue: 0, percentage: 0 }))
        .slice(0, 6),
      recentActivity: stats.recentActivity.map((a) => ({
        text: `${a.user.fullName ?? a.user.email} ${a.action}`,
        time: new Date(a.createdAt).toLocaleString("en-NG"),
      })),
    };
  },
};
