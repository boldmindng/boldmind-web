/**
 * lib/api/index.ts
 *
 * All API calls used by boldmind-web.
 * Base URL: https://api.boldmind.ng/api/v1 (CORRECTED — not /v1, not boldmind.ng/api)
 * Set in NEXT_PUBLIC_API_URL env var.
 *
 * This file exports typed fetch wrappers on top of @boldmindng/api-client.
 * Components import from here — never call apiFetch directly from components.
 */

import { apiFetch, qs } from '@boldmindng/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  userStats: {
    totals: {
      users: number;
      activeProducts: number;
      admins: number;
    };
    growth: {
      trend: 'up' | 'down' | 'stable';
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
    status: 'healthy' | 'degraded' | 'unhealthy';
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
  subscriptions: Array<{ productSlug: string; tier: string; currentPeriodEnd: string }>;
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
    status: 'active' | 'churned';
  }>;
}

export interface WalletData {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  transactions: Array<{
    id: string;
    type: 'credit' | 'debit' | 'pending';
    amount: number;
    description: string;
    createdAt: string;
  }>;
}

export interface PillarStats {
  amebogist:    { users: string; revenue: number; posts: number };
  villagecircle:{ drops: number; waitlists: number; patrons: number };
  educenter:    { students: string; revenue: number; examsPracticed: number };
  planai:       { businesses: string; revenue: number; toolsUsed: number };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () =>
    apiFetch<{ data: DashboardStats }>('/hub/dashboard/stats'),

  getPillarStats: () =>
    apiFetch<{ data: PillarStats }>('/hub/dashboard/pillars'),
};

// ─── Referrals ────────────────────────────────────────────────────────────────

export const referralApi = {
  getStats: () =>
    apiFetch<{ data: ReferralStats }>('/hub/referrals'),

  generateLink: (productSlug: string) =>
    apiFetch<{ data: { url: string } }>('/hub/referrals/link', {
      method: 'POST',
      body: JSON.stringify({ productSlug }),
    }),
};

// ─── Wallet ───────────────────────────────────────────────────────────────────

export const walletApi = {
  getBalance: () =>
    apiFetch<{ data: WalletData }>('/hub/wallet'),

  requestPayout: (amount: number, bankDetails: object) =>
    apiFetch<{ data: { reference: string } }>('/hub/wallet/payout', {
      method: 'POST',
      body: JSON.stringify({ amount, bankDetails }),
    }),
};

// ─── Users (admin) ────────────────────────────────────────────────────────────

export const adminApi = {
  getUsers: (params: { page?: number; pageSize?: number; role?: string; search?: string }) =>
    apiFetch<{ data: EcosystemUser[]; total: number; page: number; totalPages: number }>(
      `/admin/users${qs(params)}`,
    ),

  getUser: (id: string) =>
    apiFetch<{ data: EcosystemUser }>(`/admin/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    apiFetch<{ data: EcosystemUser }>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  toggleUserStatus: (id: string, isActive: boolean) =>
    apiFetch<{ data: { success: boolean } }>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  getStats: () =>
    apiFetch<{ data: DashboardStats }>('/admin/stats'),

  getActivityLogs: (params: { page?: number; userId?: string; action?: string }) =>
    apiFetch<{ data: DashboardStats['recentActivity']; total: number }>(
      `/admin/logs${qs(params)}`,
    ),
};

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const subscriptionApi = {
  getMySubscriptions: () =>
    apiFetch<{ data: Array<{ productSlug: string; tier: string; currentPeriodEnd: string; status: string }> }>(
      '/subscriptions/me',
    ),

  initializePayment: (productSlug: string, tier: string) =>
    apiFetch<{ data: { authorizationUrl: string; reference: string } }>(
      '/subscriptions/initialize',
      { method: 'POST', body: JSON.stringify({ productSlug, tier }) },
    ),

  cancelSubscription: (subscriptionId: string) =>
    apiFetch<{ data: { success: boolean } }>(`/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    }),
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileApi = {
  update: (patch: Partial<{ name: string; profile: object }>) =>
    apiFetch<{ data: EcosystemUser }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  uploadAvatar: (form: FormData) =>
    apiFetch<{ data: { avatarUrl: string } }>('/auth/profile/avatar', {
      method: 'POST',
      body: form,
    }),
};

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const onboardingApi = {
  complete: (data: { businessType?: string; goals?: string[]; tools?: string[] }) =>
    apiFetch<{ data: { success: boolean } }>('/hub/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};