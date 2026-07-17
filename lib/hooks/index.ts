/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore, authAPI } from "@boldmindng/auth";
import {
  dashboardApi,
  statsApi,
  adminOverviewApi,
  referralApi,
  walletApi,
  subscriptionApi,
  adminApi,
  analyticsApi,
  isPersonalStats,
  isEcosystemStats,
  type HubStatsResponse,
  type ReferralStats,
  type WalletBalanceResponse,
  type AnalyticsOverview,
} from "../api";

// ─── Generic fetch hook ─────────────────────────────────────────────────────

function useFetch<T>(fetcher: () => Promise<{ data: T }>, deps?: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      if (mountedRef.current) setData(res.data);
    } catch (err) {
      if (mountedRef.current) setError(err as Error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    mountedRef.current = true;
    Promise.resolve().then(run);
    return () => {
      mountedRef.current = false;
    };
  }, [run]);

  return { data, loading, error, refresh: run };
}

function useMutation<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<{ data: TResult }>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TResult | null>(null);

  const execute = useCallback(async (...args: TArgs): Promise<TResult> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      setData(res.data);
      return res.data;
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Request failed");
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, loading, error, data, reset };
}

// ─── Hub stats (role-aware — the real backer for both dashboard pages) ──────
// FIXED: HubDashboardPage.tsx and AdminOverviewClient.tsx both read
// userStats/ecosystemOverview/systemHealth — that's HubEcosystemStats, which
// only comes back from GET /hub/stats for admin/super_admin. The old
// useDashboardStats() pointed at GET /hub/dashboard, a different shape
// entirely ({ subscriptions, productAccess, recentActivity, wallet }), so
// every field those pages read was silently undefined.
//
// useDashboardStats is kept as the exported name (both pages already import
// it) but now correctly resolves to /hub/stats. Components narrow the union
// with isPersonalStats/isEcosystemStats.

export function useDashboardStats() {
  return useFetch<HubStatsResponse>(statsApi.getOverview);
}

// Explicit alias, same endpoint — use this name in new code.
export function useHubStats() {
  return useFetch<HubStatsResponse>(statsApi.getOverview);
}

// GET /hub/dashboard — subscriptions/productAccess/wallet widget, separate
// from the stats cards above.
export function useHubDashboardWidget() {
  return useFetch(dashboardApi.getDashboard);
}

export function usePillarStats() {
  return useFetch(dashboardApi.getPillarStats);
}

// Admin-controller shape — GET /admin/dashboard. Only for pages that
// specifically want the admin.controller.ts response, not /hub/stats.
export function useAdminOverview() {
  return useFetch(adminOverviewApi.getStats);
}

export function useAnalyticsOverview() {
  return useFetch<AnalyticsOverview>(
    () => analyticsApi.getOverview().then((data) => ({ data })),
  );
}

// ─── Referrals ────────────────────────────────────────────────────────────

export function useReferralStats() {
  return useFetch<ReferralStats>(referralApi.getStats);
}

// ─── Wallet ───────────────────────────────────────────────────────────────
// FIXED: was `useFetch<WalletData>`, a type that was never exported anywhere
// — WalletBalanceResponse is the real shape from wallet.api.ts.

export function useWallet() {
  return useFetch<WalletBalanceResponse>(walletApi.getBalance);
}

export function useWalletLedger(page = 1, pageSize = 20) {
  return useFetch(() => walletApi.getLedger(page, pageSize), [page, pageSize]);
}

// ─── Subscriptions ────────────────────────────────────────────────────────

export function useMySubscriptions() {
  return useFetch(subscriptionApi.getMySubscriptions);
}

// ─── Admin users ─────────────────────────────────────────────────────────

export function useAdminUsers(
  params: {
    page?: number;
    pageSize?: number;
    role?: string;
    search?: string;
  } = {},
) {
  const [page, setPage] = useState(params.page ?? 1);
  const [search, setSearch] = useState(params.search ?? "");

  const { data, loading, error, refresh } = useFetch(
    () => adminApi.getUsers({ ...params, page, search }),
    [page, search],
  );

  return { data, loading, error, refresh, page, setPage, search, setSearch };
}

// ─── Password reset flow ────────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation((email: string) => authAPI.forgotPassword({ email }));
}

export function useResetPassword() {
  return useMutation((email: string, code: string, newPassword: string) =>
    authAPI.resetPassword({ email, code, newPassword }),
  );
}

// ─── Auth selectors ───────────────────────────────────────────────────────

export function useAuth() {
  const { user, status, session } = useAuthStore();
  return {
    user,
    status,
    session,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    accessToken: session?.accessToken ?? null,
  };
}

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === "super_admin" || user?.role === "admin";
}

// ─── Clipboard ───────────────────────────────────────────────────────────

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      }
    },
    [timeout],
  );

  return { copied, copy };
}

// ─── Local storage ─────────────────────────────────────────────────────────

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch {
        /* ignore */
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}

export { isPersonalStats, isEcosystemStats };
