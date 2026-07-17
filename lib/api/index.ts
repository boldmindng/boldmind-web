import {
  hubAPI,
  isPersonalStats,
  isEcosystemStats,
  walletAPI,
  paymentAPI,
  adminAPI,
  userMeAPI,
  usersAPI,
  notificationsAPI,
  type HubDashboardStats,
  type HubStatsResponse,
  type HubPersonalStats,
  type HubEcosystemStats,
  type ReferralStats,
  type WalletBalanceResponse,
  type Notification,
  type PaginatedResponse,
} from "@boldmindng/api-client";
import { getPillarSummary, type PillarSummary } from "@boldmindng/utils";

export type {
  HubDashboardStats,
  HubStatsResponse,
  HubPersonalStats,
  HubEcosystemStats,
  ReferralStats,
  WalletBalanceResponse,
  Notification,
};

export { isPersonalStats, isEcosystemStats };

// ─── Hub dashboard widget — GET /hub/dashboard ───────────────────────────────
// Subscriptions, per-product access, recent activity, wallet snapshot.
// NOT what HubDashboardPage.tsx / AdminOverviewClient.tsx actually render —
// they want the ecosystem/personal numbers, which live on /hub/stats below.
// Kept here for whatever future widget wants the subscription-list view.

export const dashboardApi = {
  getDashboard: hubAPI.getDashboard,
  getPillarStats: async (): Promise<{ data: PillarSummary[] }> => ({
    data: getPillarSummary(),
  }),
};

// ─── Role-aware stats — GET /hub/stats ───────────────────────────────────────
// FIXED: this is the endpoint HubDashboardPage.tsx and AdminOverviewClient.tsx
// actually need — HubService.getStats() returns HubEcosystemStats for
// admin/super_admin (userStats/ecosystemOverview/recentActivity/systemHealth,
// exactly what both components read) or HubPersonalStats otherwise. There is
// NO `scope` field on the response — narrow with isPersonalStats/isEcosystemStats.

export const statsApi = {
  getOverview: hubAPI.getStats,
};

// ─── Admin (raw admin.controller.ts shape, distinct from /hub/stats) ────────
// Kept separate since AdminStats' exact shape isn't confirmed against a real
// admin.service.ts — don't assume it matches HubEcosystemStats.

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

// ─── Notifications — GET/POST/DELETE /notifications/* ───────────────────────
// Mirrors notification.controller.ts. The `admin.*` sends (email/whatsapp/
// broadcast/otp) are deliberately NOT re-exported here — they're gated by
// RolesGuard('admin','super_admin') on the backend and have no caller yet in
// boldmind-web. Add them under adminApi if/when an admin broadcast UI exists,
// rather than exposing them from the general notification surface.

export interface NotificationListResult extends PaginatedResponse<Notification> {
  unread: number;
}

export const notificationApi = {
  /** GET /notifications */
  list: notificationsAPI.list as (params?: {
    page?: number;
    limit?: number;
  }) => Promise<{ data: NotificationListResult }>,
  /** POST /notifications/read — omit ids to mark everything read */
  markRead: notificationsAPI.markRead,
  /** DELETE /notifications/:id */
  delete: notificationsAPI.delete,
  push: {
    getVapidKey: notificationsAPI.push.getVapidPublicKey,
    subscribe: notificationsAPI.push.subscribe,
    unsubscribe: notificationsAPI.push.unsubscribe,
  },
};

// ─── Profile / onboarding ─────────────────────────────────────────────────

export const profileApi = { update: userMeAPI.updateProfile };
export const onboardingApi = { complete: userMeAPI.onboarding };

// ─── Analytics overview — GET /hub/stats, key-presence narrowed ─────────────

export interface AnalyticsOverview {
  scope: "personal" | "ecosystem";
  totalRevenue: number | null;
  activeUsers: number | null;
  topProductsByRevenue: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
  recentActivity: Array<{ text: string; time: string }>;
  personal?: {
    spendNGN: number;
    walletBalanceNaira: string;
    activeProducts: string[];
    referralEarnings: number;
  };
}

export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const res = await statsApi.getOverview();
    const stats = res.data;

    if (isPersonalStats(stats)) {
      return {
        scope: "personal",
        totalRevenue: null,
        activeUsers: null,
        topProductsByRevenue: [],
        recentActivity: [],
        personal: {
          spendNGN: stats.spend.totalPaidNGN,
          walletBalanceNaira: `₦${(stats.wallet.balanceKobo / 100).toLocaleString("en-NG")}`,
          activeProducts: stats.products.active.map((p) => p.productSlug),
          referralEarnings: stats.referrals.totalEarnings,
        },
      };
    }

    return {
      scope: "ecosystem",
      totalRevenue: stats.ecosystemOverview.totalMonthlyRevenue,
      activeUsers: stats.userStats.totals.users,
      topProductsByRevenue: stats.userStats.topProducts
        .map((p) => ({ name: p.productName, revenue: 0, percentage: 0 }))
        .slice(0, 6),
      recentActivity: stats.recentActivity.map((a) => ({
        text: `${a.user.fullName} ${a.action}`,
        time: new Date(a.createdAt).toLocaleString("en-NG"),
      })),
    };
  },
};
