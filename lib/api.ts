

const API_BASE =
  process.env['NEXT_PUBLIC_API_URL']?.replace(/\/$/, '') ?? 'http://localhost:4001/api/v1';

// ─── Fetch wrapper ────────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  /** Next.js cache config — pass for Server Component calls */
  next?: { revalidate?: number | false; tags?: string[] };
}

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    credentials: 'include', // send boldmind_sso cookie with every request
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    let code = 'UNKNOWN_ERROR';
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      code = body.code ?? code;
      message = body.message ?? message;
    } catch {
      /* ignore parse error */
    }
    throw new ApiError(res.status, code, message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json();
}

// ─── Generic response wrappers ────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Matches the ResponseInterceptor envelope: { success, data, message?, timestamp } */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// AUTH  (/auth/*)
// ═════════════════════════════════════════════════════════════════════════════

/** Token pair returned by login / register / refresh */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds (900 = 15 min)
}

/** Full user object returned by GET /auth/me */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
  ecosystemRole?: string;
  permissions: string[];
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  profile?: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    state?: string;
    prefersPidgin?: boolean;
    dyslexiaMode?: boolean;
    activeProducts?: string[];
    onboardingDone: boolean;
    referralCode?: string;
    examTarget?: string;
  };
  subscriptions?: Array<{
    productSlug: string;
    tier: string;
    currentPeriodEnd: string;
  }>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export const authAPI = {
  /** POST /auth/login — sets boldmind_sso httpOnly cookie; returns TokenPair */
  login: (payload: LoginPayload) =>
    apiFetch<ApiResponse<TokenPair>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** POST /auth/register — sets boldmind_sso httpOnly cookie; returns TokenPair */
  register: (payload: RegisterPayload) =>
    apiFetch<ApiResponse<TokenPair>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        name: payload.name ?? ([payload.firstName, payload.lastName].filter(Boolean).join(' ') || payload.email.split('@')[0]),
      }),
    }),

  /** GET /auth/me — returns current user from SSO cookie */
  me: () =>
    apiFetch<ApiResponse<AuthUser>>('/auth/me', {
      next: { revalidate: 0 },
    }),

  /** POST /auth/logout — revokes refresh token, clears boldmind_sso cookie */
  logout: (refreshToken: string) =>
    apiFetch<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  /** POST /auth/refresh — rotates tokens; requires stored refresh token in body */
  refresh: (refreshToken: string) =>
    apiFetch<ApiResponse<TokenPair>>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  /** POST /auth/forgot-password — sends OTP email; always 204 */
  forgotPassword: (email: string) =>
    apiFetch<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  /** POST /auth/reset-password — verifies OTP then updates password; 204 */
  resetPassword: (email: string, code: string, newPassword: string) =>
    apiFetch<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    }),

  /** POST /auth/verify-email — verifies 6-digit OTP */
  verifyEmail: (email: string, code: string) =>
    apiFetch<ApiResponse<{ verified: boolean }>>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code, purpose: 'email_verify' }),
    }),
};

// ═════════════════════════════════════════════════════════════════════════════
// HUB  (/hub/*)
// ═════════════════════════════════════════════════════════════════════════════

export interface DashboardStats {
  userStats: {
    totals: { users: number; admins: number; activeProducts: number };
    growth: { currentMonth: number; previousMonth: number; percentage: number; trend: 'up' | 'down' | 'stable' };
    recentUsers: Array<{ id: string; email: string; fullName?: string; role: string; createdAt: string }>;
    topProducts: Array<{ productSlug: string; userCount: number; productName: string }>;
  };
  productStats: {
    total: number;
    byStatus: Record<string, number>;
    projectedRevenue: number;
  };
  systemHealth: Array<{
    name: string;
    status: 'healthy' | 'unhealthy' | 'unknown';
    responseTime?: number;
    lastChecked: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    createdAt: string;
    user?: { id: string; email: string; fullName?: string };
  }>;
  ecosystemOverview: {
    totalMonthlyRevenue: number;
    totalTeamSize: number;
    topPriorityProducts: Array<{ name: string; priority: number; status: string; monthlyRevenue: number }>;
  };
}

export const hubAPI = {
  /** GET /hub/dashboard — admin dashboard stats */
  getDashboardStats: () =>
    apiFetch<DashboardStats>('/hub/dashboard', {
      next: { revalidate: 60, tags: ['dashboard'] },
    }),

  /** GET /hub/pricing — live pricing data for all products */
  getPricing: () =>
    apiFetch<ApiResponse<unknown[]>>('/hub/pricing', {
      next: { revalidate: 3600, tags: ['pricing'] },
    }),

  /** GET /hub/products — all ecosystem products */
  getProducts: () =>
    apiFetch<ApiResponse<unknown[]>>('/hub/products', {
      next: { revalidate: 300, tags: ['products'] },
    }),

  team: {
    /** GET /hub/team */
    list: () => apiFetch<unknown[]>('/hub/team'),

    /** POST /hub/team/invite */
    invite: (data: { email: string; role: string; firstName?: string; lastName?: string }) =>
      apiFetch<ApiResponse<unknown>>('/hub/team/invite', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    /** DELETE /hub/team/:userId */
    remove: (userId: string) =>
      apiFetch<void>(`/hub/team/${userId}`, { method: 'DELETE' }),
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// USER  (/user/*)
// ═════════════════════════════════════════════════════════════════════════════

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
}

export const userAPI = {
  /** GET /user/profile */
  getProfile: () =>
    apiFetch<ApiResponse<AuthUser>>('/user/profile', {
      next: { revalidate: 0 },
    }),

  /** PATCH /user/profile */
  updateProfile: (payload: UpdateProfilePayload) =>
    apiFetch<ApiResponse<AuthUser>>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  /** DELETE /user/account */
  deleteAccount: () =>
    apiFetch<void>('/user/account', { method: 'DELETE' }),

  /** GET /user/products — which products the user has active */
  getMyProducts: () =>
    apiFetch<ApiResponse<unknown[]>>('/user/products', {
      next: { revalidate: 60 },
    }),
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN  (/admin/*)
// ═════════════════════════════════════════════════════════════════════════════

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}

export const adminAPI = {
  users: {
    /** GET /admin/users */
    list: (params?: AdminUserListParams) => {
      const qs = new URLSearchParams();
      if (params?.page)     qs.set('page',   String(params.page));
      if (params?.limit)    qs.set('limit',  String(params.limit));
      if (params?.role)     qs.set('role',   params.role);
      if (params?.isActive !== undefined) qs.set('isActive', String(params.isActive));
      if (params?.search)   qs.set('search', params.search);
      return apiFetch<PaginatedResponse<unknown>>(`/admin/users?${qs}`);
    },

    /** GET /admin/users/:id */
    get: (id: string) => apiFetch<ApiResponse<unknown>>(`/admin/users/${id}`),

    /** POST /admin/users */
    create: (data: unknown) =>
      apiFetch<ApiResponse<unknown>>('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    /** PATCH /admin/users/:id */
    update: (id: string, data: unknown) =>
      apiFetch<ApiResponse<unknown>>(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    /** DELETE /admin/users/:id */
    delete: (id: string) =>
      apiFetch<void>(`/admin/users/${id}`, { method: 'DELETE' }),

    /** PATCH /admin/users/:id/role */
    updateRole: (id: string, role: string) =>
      apiFetch<ApiResponse<unknown>>(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
  },

  analytics: {
    /** GET /admin/analytics/overview */
    overview: () =>
      apiFetch<ApiResponse<unknown>>('/admin/analytics/overview', {
        next: { revalidate: 300 },
      }),
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// AMEBOGIST  (/amebogist/*)
// ═════════════════════════════════════════════════════════════════════════════

export interface ArticleListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}

export const amebogistAPI = {
  /** GET /amebogist/categories */
  getCategories: () =>
    apiFetch<ApiResponse<unknown[]>>('/amebogist/categories', {
      next: { revalidate: 3600, tags: ['amebo-categories'] },
    }),

  articles: {
    /** GET /amebogist/articles */
    list: (params?: ArticleListParams) => {
      const qs = new URLSearchParams();
      if (params?.page)     qs.set('page',     String(params.page));
      if (params?.limit)    qs.set('limit',    String(params.limit));
      if (params?.category) qs.set('category', params.category);
      if (params?.search)   qs.set('search',   params.search);
      if (params?.featured) qs.set('featured', 'true');
      return apiFetch<PaginatedResponse<unknown>>(`/amebogist/articles?${qs}`, {
        next: { revalidate: 60, tags: ['amebo-articles'] },
      });
    },

    /** GET /amebogist/articles/trending */
    getTrending: (limit = 8) =>
      apiFetch<ApiResponse<unknown[]>>(`/amebogist/articles/trending?limit=${limit}`, {
        next: { revalidate: 300, tags: ['amebo-trending'] },
      }),

    /** GET /amebogist/articles/:slug */
    getBySlug: (slug: string) =>
      apiFetch<ApiResponse<unknown>>(`/amebogist/articles/${slug}`, {
        next: { revalidate: 60, tags: [`amebo-article-${slug}`] },
      }),

    /** POST /amebogist/articles — create (auth required) */
    create: (data: unknown) =>
      apiFetch<ApiResponse<unknown>>('/amebogist/articles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    /** PATCH /amebogist/articles/:id */
    update: (id: string, data: unknown) =>
      apiFetch<ApiResponse<unknown>>(`/amebogist/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    /** POST /amebogist/articles/:id/react */
    react: (id: string, reaction: string) =>
      apiFetch<ApiResponse<unknown>>(`/amebogist/articles/${id}/react`, {
        method: 'POST',
        body: JSON.stringify({ reaction }),
      }),
  },

  comments: {
    /** GET /amebogist/articles/:articleId/comments */
    list: (articleId: string, page = 1) =>
      apiFetch<PaginatedResponse<unknown>>(
        `/amebogist/articles/${articleId}/comments?page=${page}`,
      ),

    /** POST /amebogist/articles/:articleId/comments */
    create: (articleId: string, content: string) =>
      apiFetch<ApiResponse<unknown>>(`/amebogist/articles/${articleId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),

    /** POST /amebogist/comments/:commentId/react */
    react: (commentId: string, reaction: string) =>
      apiFetch<ApiResponse<unknown>>(`/amebogist/comments/${commentId}/react`, {
        method: 'POST',
        body: JSON.stringify({ reaction }),
      }),
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// PAYMENT  (/payment/*)
// ═════════════════════════════════════════════════════════════════════════════

export const paymentAPI = {
  /** POST /payment/initialize — start Paystack checkout */
  initialize: (data: { productSlug: string; plan: string; email: string; callbackUrl: string }) =>
    apiFetch<ApiResponse<{ authorizationUrl: string; reference: string }>>('/payment/initialize', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** GET /payment/verify/:reference */
  verify: (reference: string) =>
    apiFetch<ApiResponse<{ status: string; plan: string }>>(`/payment/verify/${reference}`),

  /** GET /payment/subscriptions — user's active subscriptions */
  getSubscriptions: () =>
    apiFetch<ApiResponse<unknown[]>>('/payment/subscriptions', {
      next: { revalidate: 0 },
    }),
};

// ═════════════════════════════════════════════════════════════════════════════
// NOTIFICATION  (/notification/*)
// ═════════════════════════════════════════════════════════════════════════════

export const notificationAPI = {
  /** GET /notifications — paginated user notifications */
  list: (page = 1, limit = 20) =>
    apiFetch<PaginatedResponse<unknown>>(`/notifications?page=${page}&limit=${limit}`, {
      next: { revalidate: 0 },
    }),

  /** POST /notifications/read — mark notifications as read (pass ids or omit for all) */
  markRead: (ids?: string[]) =>
    apiFetch<void>('/notifications/read', {
      method: 'POST',
      body: JSON.stringify(ids ? { ids } : {}),
    }),

  /** DELETE /notifications/:id — delete a notification */
  delete: (id: string) =>
    apiFetch<void>(`/notifications/${id}`, { method: 'DELETE' }),

  push: {
    /** POST /notifications/push/subscribe */
    subscribe: (subscription: PushSubscription) =>
      apiFetch<void>('/notifications/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
      }),

    /** POST /notifications/push/unsubscribe */
    unsubscribe: (endpoint: string) =>
      apiFetch<void>('/notifications/push/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ endpoint }),
      }),
  },

  admin: {
    /** POST /notifications/broadcast/push — admin */
    broadcastPush: (data: { title: string; body: string; url?: string }) =>
      apiFetch<ApiResponse<void>>('/notifications/broadcast/push', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    /** POST /notifications/broadcast/email — admin */
    broadcastEmail: (data: { subject: string; html: string; userIds?: string[] }) =>
      apiFetch<ApiResponse<void>>('/notifications/broadcast/email', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// MEDIA  (/media/*)
// ═════════════════════════════════════════════════════════════════════════════

export const mediaAPI = {
  /** POST /media/upload — multipart form upload */
  upload: async (file: File, folder?: string): Promise<ApiResponse<{ url: string; key: string }>> => {
    const form = new FormData();
    form.append('file', file);
    if (folder) form.append('folder', folder);

    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      credentials: 'include',
      body: form,
      // Don't set Content-Type — browser sets it with boundary for multipart
    });

    if (!res.ok) throw new ApiError(res.status, 'UPLOAD_FAILED', 'Upload failed');
    return res.json();
  },

  /** DELETE /media/:key */
  delete: (key: string) =>
    apiFetch<void>(`/media/${key}`, { method: 'DELETE' }),
};

// ═════════════════════════════════════════════════════════════════════════════
// ANALYTICS  (/analytics/*)
// ═════════════════════════════════════════════════════════════════════════════

export const analyticsAPI = {
  /** POST /analytics/track (public) */
  track: (event: string, properties?: Record<string, unknown>) =>
    apiFetch<void>('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event, properties }),
    }),

  /** POST /analytics/pageview (public) */
  pageview: (path: string, referrer?: string) =>
    apiFetch<void>('/analytics/pageview', {
      method: 'POST',
      body: JSON.stringify({ path, referrer }),
    }),

  /** GET /analytics/me */
  me: () =>
    apiFetch<ApiResponse<unknown>>('/analytics/me', { next: { revalidate: 0 } }),

  /** GET /analytics/dashboard — admin */
  dashboard: () =>
    apiFetch<ApiResponse<unknown>>('/analytics/dashboard', { next: { revalidate: 300 } }),

  /** GET /analytics/products — admin */
  products: () =>
    apiFetch<ApiResponse<unknown[]>>('/analytics/products', { next: { revalidate: 300 } }),
};

// ─── Re-export ApiError so consumers can instanceof check ────────────────────
export { ApiError };