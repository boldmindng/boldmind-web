/**
 * lib/api/index.ts
 *
 * All API calls used by boldmind-web.
 * Base URL: https://api.boldmind.ng/api/v1
 * Set in NEXT_PUBLIC_API_URL env var.
 */

import { apiFetch, qs } from "@boldmindng/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  userStats: {
    totals: { users: number; activeProducts: number; admins: number };
    growth: {
      trend: "up" | "down" | "stable";
      percentage: number;
      currentMonth: number;
    };
    topProducts: Array<{
      productSlug: string;
      productName: string;
      userCount: number;
    }>;
  };
  ecosystemOverview: {
    totalMonthlyRevenue: number;
    totalTeamSize: number;
    liveProducts: number;
    buildingProducts: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    createdAt: string;
    user: { fullName?: string; email: string };
  }>;
  systemHealth: Array<{
    name: string;
    status: "healthy" | "degraded" | "unhealthy";
    responseTime?: number;
  }>;
}

export interface EcosystemUser {
  id: string;
  email: string;
  name: string;
  role: string;
  ecosystemRole?: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  subscriptions: Array<{
    productSlug: string;
    tier: string;
    currentPeriodEnd: string;
  }>;
  profile?: {
    displayName?: string;
    state?: string;
    referralCode?: string;
    activeProducts?: string[];
    onboardingDone?: boolean;
  };
}

export interface ReferralStats {
  code: string;
  totalReferrals: number;
  totalEarnings: number;
  thisMonth: number;
  referrals: Array<{
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    productSlug: string;
    status: "active" | "churned";
  }>;
}

export interface WalletData {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  transactions: Array<{
    id: string;
    type: "credit" | "debit" | "pending";
    amount: number;
    description: string;
    createdAt: string;
  }>;
}

export interface PillarStats {
  amebogist: { users: string; revenue: number; posts: number };
  villagecircle: { drops: number; waitlists: number; patrons: number };
  educenter: { students: string; revenue: number; examsPracticed: number };
  planai: { businesses: string; revenue: number; toolsUsed: number };
}

// ─── Dashboard (regular Hub user, NOT admin) ──────────────────────────────────

export const dashboardApi = {
  getStats: () => apiFetch<{ data: DashboardStats }>("/hub/dashboard/stats"),
  getPillarStats: () =>
    apiFetch<{ data: PillarStats }>("/hub/dashboard/pillars"),
};

// ─── Referrals ────────────────────────────────────────────────────────────────

export const referralApi = {
  getStats: () => apiFetch<{ data: ReferralStats }>("/hub/referrals"),
  generateLink: (productSlug: string) =>
    apiFetch<{ data: { url: string } }>("/hub/referrals/link", {
      method: "POST",
      body: JSON.stringify({ productSlug }),
    }),
};

// ─── Wallet ───────────────────────────────────────────────────────────────────

export const walletApi = {
  getBalance: () => apiFetch<{ data: WalletData }>("/hub/wallet"),
  requestPayout: (amount: number, bankDetails: object) =>
    apiFetch<{ data: { reference: string } }>("/hub/wallet/payout", {
      method: "POST",
      body: JSON.stringify({ amount, bankDetails }),
    }),
};

// ─── Admin (confirmed against admin.controller.ts) ────────────────────────────

export const adminApi = {
  /** GET /admin/stats — the correct source for the admin overview page, not dashboardApi.getStats() */
  getStats: () => apiFetch<{ data: DashboardStats }>("/admin/stats"),

  getUsers: (params: {
    page?: number;
    pageSize?: number;
    role?: string;
    search?: string;
  }) =>
    apiFetch<{
      data: EcosystemUser[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/admin/users${qs(params)}`),

  /** No GET /admin/users/:id exists — single-user fetch lives on /users/:id (user.controller.ts) */
  getUser: (id: string) => apiFetch<{ data: EcosystemUser }>(`/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    apiFetch<{ data: EcosystemUser }>(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  /**
   * No status-toggle route exists on any uploaded controller — the closest
   * is DELETE /users/:id/ban, which is ban-only (no unban). Left unimplemented
   * rather than pointed at a route that doesn't exist. AdminUsersPage's
   * status toggle needs a backend decision before this can work.
   */
  // toggleUserStatus: not implemented — see comment above

  getRevenue: (period: "week" | "month" | "quarter" | "year" = "month") =>
    apiFetch<{ data: unknown }>(`/admin/revenue${qs({ period })}`),

  getWaitlist: (productSlug?: string) =>
    apiFetch<{ data: unknown }>(`/admin/waitlist${qs({ productSlug })}`),

  /** Body is `{ count }`, NOT `{ emails }` — admin.controller.ts's invite() reads @Body('count'). */
  inviteFromWaitlist: (productSlug: string, count = 10) =>
    apiFetch<{ data: unknown }>(`/admin/waitlist/${productSlug}/invite`, {
      method: "POST",
      body: JSON.stringify({ count }),
    }),

  getActivityLogs: (params: { page?: number; limit?: number } = {}) =>
    apiFetch<{ data: DashboardStats["recentActivity"]; total: number }>(
      `/admin/logs${qs(params)}`,
    ),
};

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const subscriptionApi = {
  getMySubscriptions: () =>
    apiFetch<{
      data: Array<{
        productSlug: string;
        tier: string;
        currentPeriodEnd: string;
        status: string;
      }>;
    }>("/subscriptions/me"),
  initializePayment: (productSlug: string, tier: string) =>
    apiFetch<{ data: { authorizationUrl: string; reference: string } }>(
      "/subscriptions/initialize",
      {
        method: "POST",
        body: JSON.stringify({ productSlug, tier }),
      },
    ),
  cancelSubscription: (subscriptionId: string) =>
    apiFetch<{ data: { success: boolean } }>(
      `/subscriptions/${subscriptionId}/cancel`,
      { method: "POST" },
    ),
};

// ─── Profile — moved to /user/*, was pointing at nonexistent /auth/* routes ───

export const profileApi = {
  update: (patch: Partial<{ name: string; profile: object }>) =>
    apiFetch<{ data: EcosystemUser }>("/user/profile", {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  // No avatar upload endpoint exists on any uploaded controller — removed
  // rather than left pointing at a route that doesn't exist. Add back once
  // media.controller.ts's upload flow is confirmed to support avatars.
};

// ─── Onboarding — moved to /user/onboarding (matches user-me.controller.ts) ──

export const onboardingApi = {
  complete: (data: {
    businessType?: string;
    goals?: string[];
    tools?: string[];
  }) =>
    apiFetch<{ data: { success: boolean } }>("/user/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
