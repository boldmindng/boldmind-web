/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * lib/hooks/index.ts — custom hooks for boldmind-web
 */

"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuthStore, authAPI } from "@boldmindng/auth";
import {
  dashboardApi,
  referralApi,
  walletApi,
  subscriptionApi,
  adminApi,
  type DashboardStats,
  type ReferralStats,
  type WalletData,
} from "../api";

// ─── Generic fetch hook (GET-style, runs on mount) ─────────────────────────────

function useFetch<T>(fetcher: () => Promise<{ data: T }>, deps?: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  // const depsList = useMemo(() => deps ?? [], [deps]);

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
    // include fetcher plus any user-supplied deps
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

// ─── Generic mutation hook (POST/PATCH-style, caller-triggered) ────────────────
//
// NEW — this was missing, which is why `useForgotPassword`/`useResetPassword`
// didn't exist. Unlike useFetch, `execute()` re-throws the error after storing
// it in state, so a caller can safely do:
//
//   try {
//     await mutation.execute(...);
//     // success
//   } catch (err) {
//     // failure — err and mutation.error carry the same Error
//   }
//
// without racing React's state batching (the bug in the original
// forgot-password/change-password pages, which read `mutation.error`
// immediately after `await execute()` in the same closure).

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

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useFetch<DashboardStats>(dashboardApi.getStats);
}

export function usePillarStats() {
  return useFetch(dashboardApi.getPillarStats);
}

// ─── Referrals ────────────────────────────────────────────────────────────────

export function useReferralStats() {
  return useFetch<ReferralStats>(referralApi.getStats);
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export function useWallet() {
  return useFetch<WalletData>(walletApi.getBalance);
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export function useMySubscriptions() {
  return useFetch(subscriptionApi.getMySubscriptions);
}

// ─── Admin users ─────────────────────────────────────────────────────────────

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
//
// NEW. Routed through `authAPI` from `@boldmindng/auth` — the same package
// login/page.tsx and register/page.tsx already use for `authAPI.login`,
// `authAPI.register`, `authAPI.me` — rather than lib/api's `apiFetch`, since
// password reset is an auth-package concern, not a hub-domain one.
//
// Confirmed against packages/auth/src/api.ts:
//   authAPI.forgotPassword({ email })
//   authAPI.resetPassword({ token, password })   — NOTE: no `email` field.
// resetPassword identifies the user from the token alone; passing an email
// here would be an excess-property TS error against ResetPasswordPayload.

export function useForgotPassword() {
  return useMutation((email: string) => authAPI.forgotPassword({ email }));
}

export function useResetPassword() {
  return useMutation((email: string, code: string, newPassword: string) =>
    authAPI.resetPassword({ email, code, newPassword }),
  );
}

// ─── Auth selectors ───────────────────────────────────────────────────────────

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

// ─── Clipboard ───────────────────────────────────────────────────────────────

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

// ─── Local storage ───────────────────────────────────────────────────────────

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
