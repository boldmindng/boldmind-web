/**
 * lib/hooks/index.ts — custom hooks for boldmind-web
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@boldmindng/auth';
import {
  dashboardApi,
  referralApi,
  walletApi,
  subscriptionApi,
  adminApi,
  type DashboardStats,
  type ReferralStats,
  type WalletData,
} from '../api';

// ─── Generic fetch hook ───────────────────────────────────────────────────────

function useFetch<T>(fetcher: () => Promise<{ data: T }>, deps: unknown[] = []) {
  const [data, setData]     = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<Error | null>(null);
  const mountedRef           = useRef(true);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => { mountedRef.current = false; };
  }, [run]);

  return { data, loading, error, refresh: run };
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

export function useAdminUsers(params: { page?: number; pageSize?: number; role?: string; search?: string } = {}) {
  const [page, setPage]     = useState(params.page ?? 1);
  const [search, setSearch] = useState(params.search ?? '');

  const { data, loading, error, refresh } = useFetch(
    () => adminApi.getUsers({ ...params, page, search }),
    [page, search],
  );

  return { data, loading, error, refresh, page, setPage, search, setSearch };
}

// ─── Auth selectors ───────────────────────────────────────────────────────────

export function useAuth() {
  const { user, status, session } = useAuthStore();
  return {
    user,
    status,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    accessToken: session?.accessToken ?? null,
  };
}

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === 'super_admin' || user?.role === 'admin';
}

// ─── Clipboard ───────────────────────────────────────────────────────────────

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    }
  }, [timeout]);

  return { copied, copy };
}

// ─── Local storage ───────────────────────────────────────────────────────────

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {/* ignore */}
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}