

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  authAPI,
  hubAPI,
  userAPI,
  adminAPI,
  amebogistAPI,
  paymentAPI,
  notificationAPI,
  mediaAPI,
  ApiError,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  type UpdateProfilePayload,
  type DashboardStats,
  type AdminUserListParams,
  type ArticleListParams,
  type PaginatedResponse,
  type ApiResponse,
} from '../api';

const REFRESH_TOKEN_KEY = 'bm_rt';

function saveRefreshToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function clearRefreshToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface UseQueryState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refresh: () => void;
}

export interface UseMutationState<TData, TArgs extends unknown[] = []> {
  data: TData | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: TArgs) => Promise<TData | null>;
  reset: () => void;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseQueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const counter = useRef(0);

  const run = useCallback(async () => {
    const id = ++counter.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (id === counter.current) setData(result);
    } catch (e) {
      if (id === counter.current)
        setError(e instanceof ApiError ? e : new ApiError(0, 'UNKNOWN', String(e)));
    } finally {
      if (id === counter.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refresh: run };
}

function useMutation<TData, TArgs extends unknown[] = []>(
  mutator: (...args: TArgs) => Promise<TData>,
): UseMutationState<TData, TArgs> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(async (...args: TArgs): Promise<TData | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutator(...args);
      setData(result);
      return result;
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError(0, 'UNKNOWN', String(e));
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

// ═════════════════════════════════════════════════════════════════════════════
// AUTH HOOKS
// ═════════════════════════════════════════════════════════════════════════════

/** Fetch the current authenticated user (auto-runs). */
export function useCurrentUser() {
  return useQuery(() => authAPI.me().then(r => r.data));
}

/**
 * Login mutation.
 * On success: saves refresh token to localStorage, returns the AuthUser from /auth/me.
 */
export function useLogin() {
  return useMutation(async (payload: LoginPayload): Promise<AuthUser> => {
    const res = await authAPI.login(payload);
    saveRefreshToken(res.data.refreshToken);
    const userRes = await authAPI.me();
    return userRes.data;
  });
}

/**
 * Register mutation.
 * On success: saves refresh token to localStorage, returns the AuthUser from /auth/me.
 */
export function useRegister() {
  return useMutation(async (payload: RegisterPayload): Promise<AuthUser> => {
    const res = await authAPI.register(payload);
    saveRefreshToken(res.data.refreshToken);
    const userRes = await authAPI.me();
    return userRes.data;
  });
}

/** Logout mutation — revokes the stored refresh token and clears localStorage. */
export function useLogout() {
  return useMutation(async () => {
    const rt = getRefreshToken();
    if (rt) {
      try {
        await authAPI.logout(rt);
      } catch {
        // Server may already have revoked it — proceed regardless
      }
      clearRefreshToken();
    }
  });
}

/** Forgot-password mutation — sends OTP email; always succeeds (204). */
export function useForgotPassword() {
  return useMutation((email: string) => authAPI.forgotPassword(email));
}

/** Reset-password mutation — verifies OTP then sets new password. */
export function useResetPassword() {
  return useMutation((email: string, code: string, newPassword: string) =>
    authAPI.resetPassword(email, code, newPassword),
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HUB HOOKS
// ═════════════════════════════════════════════════════════════════════════════

/** Dashboard statistics — auto-fetches. */
export function useDashboardStats(): UseQueryState<DashboardStats> {
  return useQuery(() => hubAPI.getDashboardStats());
}

/** Hub pricing data — auto-fetches. */
export function useHubPricing() {
  return useQuery(() => hubAPI.getPricing().then(r => r.data));
}

/** All ecosystem products — auto-fetches. */
export function useHubProducts() {
  return useQuery(() => hubAPI.getProducts().then(r => r.data));
}

/** Team list — auto-fetches. */
export function useTeamList() {
  return useQuery(() => hubAPI.team.list());
}

/** Invite team member mutation. */
export function useTeamInvite() {
  return useMutation(
    (data: { email: string; role: string; firstName?: string; lastName?: string }) =>
      hubAPI.team.invite(data).then(r => r.data),
  );
}

/** Remove team member mutation. */
export function useTeamRemove() {
  return useMutation((userId: string) => hubAPI.team.remove(userId));
}

// ═════════════════════════════════════════════════════════════════════════════
// USER HOOKS
// ═════════════════════════════════════════════════════════════════════════════

/** Current user profile — auto-fetches. */
export function useUserProfile() {
  return useQuery(() => userAPI.getProfile().then(r => r.data));
}

/** Update profile mutation. */
export function useUpdateProfile() {
  return useMutation((payload: UpdateProfilePayload) =>
    userAPI.updateProfile(payload).then(r => r.data),
  );
}

/** Delete own account mutation. */
export function useDeleteAccount() {
  return useMutation(() => userAPI.deleteAccount());
}

/** Fetch the user's active products. */
export function useMyProducts() {
  return useQuery(() => userAPI.getMyProducts().then(r => r.data));
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN HOOKS
// ═════════════════════════════════════════════════════════════════════════════

/** Paginated admin user list. Pass params to filter/paginate. */
export function useAdminUsers(params?: AdminUserListParams) {
  return useQuery(
    () => adminAPI.users.list(params),
    [params?.page, params?.limit, params?.role, params?.isActive, params?.search],
  );
}

/** Fetch a single admin user by id. */
export function useAdminUser(id: string) {
  return useQuery(() => adminAPI.users.get(id).then(r => r.data), [id]);
}

/** Create admin user mutation. */
export function useAdminCreateUser() {
  return useMutation((data: unknown) =>
    adminAPI.users.create(data).then(r => r.data),
  );
}

/** Update admin user mutation. */
export function useAdminUpdateUser() {
  return useMutation((id: string, data: unknown) =>
    adminAPI.users.update(id, data).then(r => r.data),
  );
}

/** Delete admin user mutation. */
export function useAdminDeleteUser() {
  return useMutation((id: string) => adminAPI.users.delete(id));
}

/** Update admin user role mutation. */
export function useAdminUpdateRole() {
  return useMutation((id: string, role: string) =>
    adminAPI.users.updateRole(id, role).then(r => r.data),
  );
}

/** Admin analytics overview — auto-fetches. */
export function useAdminAnalytics() {
  return useQuery(() => adminAPI.analytics.overview().then(r => r.data));
}

// ═════════════════════════════════════════════════════════════════════════════
// AMEBOGIST HOOKS
// ═════════════════════════════════════════════════════════════════════════════

/** All article categories — auto-fetches. */
export function useAmeboCategories() {
  return useQuery(() => amebogistAPI.getCategories().then(r => r.data));
}

/** Paginated article list. */
export function useAmeboArticles(params?: ArticleListParams) {
  return useQuery(
    () => amebogistAPI.articles.list(params),
    [params?.page, params?.limit, params?.category, params?.search, params?.featured],
  );
}

/** Trending articles — auto-fetches. */
export function useAmeboTrending(limit = 8) {
  return useQuery(
    () => amebogistAPI.articles.getTrending(limit).then(r => r.data),
    [limit],
  );
}

/** Single article by slug. */
export function useAmeboArticle(slug: string) {
  return useQuery(
    () => amebogistAPI.articles.getBySlug(slug).then(r => r.data),
    [slug],
  );
}

/** Create article mutation. */
export function useAmeboCreateArticle() {
  return useMutation((data: unknown) =>
    amebogistAPI.articles.create(data).then(r => r.data),
  );
}

/** React to an article mutation. */
export function useAmeboReactArticle() {
  return useMutation((id: string, reaction: string) =>
    amebogistAPI.articles.react(id, reaction).then(r => r.data),
  );
}

/** Comments for an article. */
export function useAmeboComments(articleId: string, page = 1) {
  return useQuery(
    () => amebogistAPI.comments.list(articleId, page),
    [articleId, page],
  );
}

/** Create comment mutation. */
export function useAmeboCreateComment() {
  return useMutation((articleId: string, content: string) =>
    amebogistAPI.comments.create(articleId, content).then(r => r.data),
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAYMENT HOOKS
// ═════════════════════════════════════════════════════════════════════════════

/** Initialize a payment (Paystack checkout). */
export function useInitializePayment() {
  return useMutation(
    (data: { productSlug: string; plan: string; email: string; callbackUrl: string }) =>
      paymentAPI.initialize(data).then(r => r.data),
  );
}

/** Verify a payment by reference. */
export function useVerifyPayment(reference: string) {
  return useQuery(
    () => paymentAPI.verify(reference).then(r => r.data),
    [reference],
  );
}

/** Current user's active subscriptions — auto-fetches. */
export function useSubscriptions() {
  return useQuery(() => paymentAPI.getSubscriptions().then(r => r.data));
}

// ═════════════════════════════════════════════════════════════════════════════
// NOTIFICATION HOOKS
// ═════════════════════════════════════════════════════════════════════════════

/** Paginated notification list. */
export function useNotifications(page = 1, limit = 20) {
  return useQuery(
    () => notificationAPI.list(page, limit),
    [page, limit],
  );
}

/** Unread notification count — auto-fetches. */
export function useUnreadCount() {
  return useQuery(() => notificationAPI.unreadCount().then(r => r.data));
}

/** Mark a single notification read. */
export function useMarkRead() {
  return useMutation((id: string) => notificationAPI.markRead(id));
}

/** Mark all notifications read. */
export function useMarkAllRead() {
  return useMutation(() => notificationAPI.markAllRead());
}

// ═════════════════════════════════════════════════════════════════════════════
// MEDIA HOOKS
// ═════════════════════════════════════════════════════════════════════════════

/** Upload a file. Returns { url, key } on success. */
export function useMediaUpload() {
  return useMutation((file: File, folder?: string) =>
    mediaAPI.upload(file, folder).then(r => r.data),
  );
}

/** Delete a media file by key. */
export function useMediaDelete() {
  return useMutation((key: string) => mediaAPI.delete(key));
}