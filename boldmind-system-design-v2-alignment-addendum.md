# BoldmindNG — System Design v2 Alignment Addendum
**Purpose:** Close every gap between `boldmind-system-design-v2.md`,
`boldmind-service-canonical.md`, and `boldmind-shared-export-reference.md`.
**Read this alongside, not instead of, system-design-v2.md.**
**Stack: Next.js 16.2 · React 19.2 · pnpm 10.34.1 · Node 22.22.3**

> This document was produced by comparing the three source-of-truth files and
> adding everything present in the canonical/shared docs that was missing or
> imprecise in the v2 system design. Sections are numbered to match the parent
> document so you can locate additions quickly.

---

## Gap Index

| # | What Was Missing / Misaligned | Where Fixed |
|---|---|---|
| 1 | `packages/pwa` and `packages/deploy-config` not in v2 | §A — New Packages |
| 2 | Full `api-client` file list (wallet, developer, polymind, lms, school) | §B — api-client Alignment |
| 3 | `client.ts` dual-auth mode (JWT + X-API-Key) not specified | §B |
| 4 | `@boldmindng/pwa` complete export contract | §C |
| 5 | `@boldmindng/deploy-config` complete export contract | §D |
| 6 | Missing queue constants (`WALLET_CREDIT`, `WEBHOOK_DELIVERY`, `SMS_OTP`, `POLYMIND_QUERY`) | §E |
| 7 | `redis.service.ts` exact rewrite not in v2 (only described) | §F |
| 8 | `queues.ts` exact rewrite not in v2 | §F |
| 9 | Missing modules table (which Wave builds what) | §G |
| 10 | Full API reference for all 18 groups not in v2 (only high level) | §H — see canonical |
| 11 | `packages/ui` — `InstallPromptBanner` component not in v2 | §C |
| 12 | Cross-app usage matrix absent from v2 | §I |
| 13 | Tooling packages (`eslint-config`, `tailwind-config`, `tsconfig`) not in v2 | §J |
| 14 | Audit checklists per package absent from v2 | Throughout |
| 15 | `kolo-ai` schema file named `translation.schema.ts` (probable misnaming) flagged | §K |
| 16 | Referral module wiring to User module absent from v2 | §G |
| 17 | `VAPID_PUBLIC_KEY` needed in both service AND frontend envs not stated in v2 | §L |
| 18 | Full env variable checklist (all 8 groups) not captured in v2 | §L |
| 19 | NDPA erasure cron + `ndpa-erasure` queue not listed as queue in v2 | §E |
| 20 | Changeset workflow detail not in v2 (only mentioned) | §M |

---

## §A — Two Additional Packages for boldmind-shared

The canonical `boldmind-shared-export-reference.md` adds **two packages** not present in `system-design-v2.md`:

### `packages/pwa` ✨

```
boldmind-shared/packages/pwa/
├── CHANGELOG.md
├── package.json
├── src/
│   ├── index.ts
│   ├── manifest.ts          ← generateManifest(product) → WebAppManifest
│   ├── service-worker.ts    ← registerServiceWorker(swUrl?)
│   ├── sw-template.ts       ← SW_TEMPLATE string helper (precache + runtime cache)
│   ├── offline-cache.ts     ← cacheStrategies: networkFirst, cacheFirst, staleWhileRevalidate
│   ├── install-prompt.tsx   ← useInstallPrompt() hook + InstallPromptBanner component
│   ├── push.ts              ← subscribeToPush(vapidPublicKey), unsubscribeFromPush()
│   ├── twa.ts               ← generateTwaConfig(product) → BubblewrapTwaManifest
│   └── types.ts
├── tsconfig.json             ← extends react-library.json (DOM + React JSX)
└── tsup.config.ts
```

**Package identity:**
```json
{
  "name": "@boldmindng/pwa",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": { "build": "tsup", "dev": "tsup --watch" },
  "dependencies": { "react": "19.2.x" },
  "devDependencies": { "tsup": "^8.x", "typescript": "^5.x" }
}
```

**Full export contract:**

| Export | File | Signature | Used in |
|---|---|---|---|
| `generateManifest` | `manifest.ts` | `(product: Product, opts?: { startUrl?: string, scope?: string }) => WebAppManifest` | Each app's `app/manifest.ts` (Next.js Metadata API) |
| `registerServiceWorker` | `service-worker.ts` | `(swUrl = '/sw.js') => void` — client-side, no-op in dev | Root layout `'use client'` component |
| `SW_TEMPLATE` | `sw-template.ts` | string template / build helper — produces `public/sw.js` per app | `turbo.json` `build:sw` task for apps with `twa` |
| `cacheStrategies` | `offline-cache.ts` | `{ networkFirst(routes), cacheFirst(routes), staleWhileRevalidate(routes) }` | EduCenter (`cacheFirst`), AmeboGist (`staleWhileRevalidate`) |
| `useInstallPrompt` | `install-prompt.tsx` | `() => { isInstallable, isInstalled, promptInstall: () => Promise<void> }` | `InstallPromptBanner` |
| `InstallPromptBanner` | `install-prompt.tsx` | `{ productSlug: string, dismissible?: boolean }` | Re-exported via `@boldmindng/ui`, root layouts |
| `subscribeToPush` | `push.ts` | `(vapidPublicKey: string) => Promise<PushSubscriptionJSON>` | Settings "Enable notifications" toggle |
| `unsubscribeFromPush` | `push.ts` | `() => Promise<void>` | Settings "Disable notifications" |
| `generateTwaConfig` | `twa.ts` | `(product: Product) => BubblewrapTwaManifest` | TWA build scripts for 4 products |
| Types | `types.ts` | `WebAppManifest`, `BubblewrapTwaManifest`, `CacheStrategyConfig` | — |

**Rules:**
- `generateManifest` must guard: only run for products where `product.twa !== undefined` — use `getProductsWithTWA()` from `@boldmindng/utils`
- `registerServiceWorker` is a no-op in dev (`NODE_ENV !== 'production'`) — prevents stale-cache dev issues
- `generateTwaConfig` output must be validated against Bubblewrap CLI schema before each TWA build
- VAPID keys must live in **both** `boldmind-service` env **AND** each frontend env:
  - Service: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
  - Frontend: `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (public only, for `subscribeToPush`)

**TWA products (4 confirmed from products.ts `twa` field):**
```
project-manager-twa   → ng.boldmind.projects   (boldmind.ng/projects)
boldmind-fitness-twa  → ng.boldmind.fit         (boldmind.ng/fitness)
amebogist-twa         → ng.amebogist.app        (amebogist.ng)
educenter-twa         → ng.educenter.app        (educenter.com.ng)
```

---

### `packages/deploy-config` ✨

```
boldmind-shared/packages/deploy-config/
├── CHANGELOG.md
├── package.json
├── src/
│   ├── index.ts
│   ├── env-schema.ts         ← APP_ENV_SCHEMAS, validateEnv()
│   ├── vercel-config.ts      ← generateVercelConfig(appName)
│   ├── health-check.ts       ← createHealthCheckRoute()
│   ├── cors.ts               ← getCorsOrigins()
│   ├── domains.ts            ← DOMAIN_CONFIG
│   └── security-headers.ts   ← securityHeaders()
├── tsconfig.json             ← extends node-library.json
└── tsup.config.ts
```

**Full export contract:**

| Export | File | Signature | Used in |
|---|---|---|---|
| `APP_ENV_SCHEMAS` | `env-schema.ts` | `Record<AppName, ZodSchema>` — one schema per app, listing all required env vars | CI validate step |
| `validateEnv` | `env-schema.ts` | `(appName: AppName, env: Record<string, string \| undefined>) => { valid, missing, errors }` | Each app's `instrumentation.ts` `register()` hook — fails fast on misconfiguration |
| `getCorsOrigins` | `cors.ts` | `() => string[]` — reads `FRONTEND_URLS`, splits on comma, falls back to `getAllDomains()` from products.ts | `boldmind-service` `main.ts` |
| `DOMAIN_CONFIG` | `domains.ts` | `Record<CoreDomain, { app, vercelProject, envPrefix }>` — from `CORE_DOMAINS + getAllSubdomains()` | Deployment scripts, CI matrix |
| `generateVercelConfig` | `vercel-config.ts` | `(appName: AppName) => VercelConfig` — SSO rewrites, security headers, legacy redirects | Each app's `vercel.json` (generated, not hand-written) |
| `securityHeaders` | `security-headers.ts` | `() => HeaderEntry[]` — HSTS, X-Content-Type-Options, Referrer-Policy, CSP | `generateVercelConfig`, `next.config.mjs` `headers()` |
| `createHealthCheckRoute` | `health-check.ts` | `() => RouteHandler` — `GET /api/health` → `{ status, app, uptime, version }` | Each app's `app/api/health/route.ts` |
| Types | — | `AppName`, `VercelConfig`, `HeaderEntry` | — |

**`APP_ENV_SCHEMAS` apps covered:**
```typescript
type AppName =
  | 'boldmind-web'
  | 'planai-suite'
  | 'amebogist-web'
  | 'educenter-web'
  | 'villagecircle-web'
  | 'boldmind-service'
  | 'polymind-extension';
```

**CSP rules for `securityHeaders`:**
- `connect-src`: must include `https://api.boldmind.ng`, Paystack endpoints, PostHog
- Must NOT expose Redis/Upstash URLs (server-only)
- `generateVercelConfig` rewrites must preserve `?sso_token=` query param — don't let Vercel strip it

**Usage — each Next.js app `next.config.mjs`:**
```typescript
import { securityHeaders } from '@boldmindng/deploy-config';

const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders() }];
  },
};
export default nextConfig;
```

---

## §B — api-client Package Alignment

### Current State vs Required State

| File | Status | Notes |
|---|---|---|
| `src/admin.api.ts` | ✅ Exists | Covers admin endpoints §4.16 |
| `src/amebogist.api.ts` | ✅ Exists | Covers §4.12 |
| `src/analytics.api.ts` | ✅ Exists | Covers §4.9 |
| `src/auth.api.ts` | ✅ Exists | Covers §4.1 + §4.2 |
| `src/automation.api.ts` | ✅ Exists | Covers §4.11 |
| `src/client.ts` | ✅ Exists | **Needs dual-auth update — see below** |
| `src/educenter.api.ts` | ✅ Exists | Covers CBT + courses (existing) |
| `src/fitness.api.ts` | ✅ Exists | Covers planai fitness tool |
| `src/hub.api.ts` | ✅ Exists | Covers §4.4 |
| `src/interceptors.ts` | ✅ Exists | 401 retry + token refresh |
| `src/media.api.ts` | ✅ Exists | Covers §4.7 |
| `src/n8n-client.ts` | ✅ Exists | n8n trigger |
| `src/notifications.api.ts` | ✅ Exists | Covers §4.8 |
| `src/os.api.ts` | ✅ Exists | Project manager / OS profile |
| `src/payment.api.ts` | ✅ Exists | Covers §4.5 |
| `src/planai.api.ts` | ✅ Exists | Suite + all 13 tool endpoints |
| `src/users.api.ts` | ✅ Exists | Covers §4.3 |
| `src/vibecoders.api.ts` | ✅ Exists | Application pipeline |
| `src/villagecircle.api.ts` | ✅ Exists | Sub-modules |
| `src/wallet.api.ts` | ⚡ **MISSING** | Create — §4.6 |
| `src/developer.api.ts` | ⚡ **MISSING** | Create — §4.17 |
| `src/polymind.api.ts` | ⚡ **MISSING** | Create — §4.18 |
| `src/educenter-lms.api.ts` | ⚡ **MISSING** | Create — LMS builder endpoints |
| `src/educenter-school.api.ts` | ⚡ **MISSING** | Create — school portal endpoints |

### `client.ts` — Required Dual-Auth Update

```typescript
// packages/api-client/src/client.ts
// CURRENT: only Bearer JWT
// REQUIRED: also support X-API-Key for enterprise routes + polymind-extension

export type AuthMode = 'jwt' | 'apikey';

export interface ApiClientConfig {
  baseUrl:        string;
  mode:           AuthMode;
  getToken?:      () => string | null;   // for mode: 'jwt'
  apiKey?:        string;                // for mode: 'apikey' (polymind-extension)
  onUnauthorized?: () => void;           // called on 401 — triggers re-auth flow
}

function buildHeaders(config: ApiClientConfig): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.mode === 'jwt') {
    const token = config.getToken?.();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  if (config.mode === 'apikey' && config.apiKey) {
    headers['X-API-Key'] = config.apiKey;
  }
  return headers;
}

// All frontends use mode: 'jwt'
// polymind-extension uses mode: 'apikey'
// boldmind-service does NOT use api-client (it IS the API)
```

### New File: `src/wallet.api.ts`

```typescript
// packages/api-client/src/wallet.api.ts

import { client } from './client';

export const walletApi = {
  /** GET /wallet — balance, tier, lock status */
  getBalance: () =>
    client.get<WalletBalanceDto>('/wallet'),

  /** GET /wallet/ledger — paginated transaction history */
  getLedger: (page = 1, pageSize = 20) =>
    client.get<PaginatedResult<WalletLedgerDto>>('/wallet/ledger', {
      params: { page, pageSize },
    }),

  /** POST /wallet/upgrade — upgrade to Tier 2 with BVN hash */
  upgradeTier: (bvnHash: string) =>
    client.post<{ tier: 'TIER2' }>('/wallet/upgrade', { bvnHash }),

  /** POST /wallet/topup/initiate — start Paystack top-up flow */
  initiateTopup: (amountNGN: number) =>
    client.post<{ authorizationUrl: string; reference: string }>(
      '/wallet/topup/initiate',
      { amountNGN }
    ),
};

export interface WalletBalanceDto {
  balanceKobo:  number;
  balanceNaira: string;   // pre-formatted: "₦12,500"
  tier:         'TIER1' | 'TIER2';
  isLocked:     boolean;
  lockReason:   string | null;
}

export interface WalletLedgerDto {
  id:          string;
  type:        'CREDIT' | 'DEBIT';
  amountKobo:  number;
  balanceAfter: number;
  description: string;
  reference:   string | null;
  source:      WalletSource;
  createdAt:   string;
}

export type WalletSource =
  | 'REFERRAL_COMMISSION'
  | 'AFFILIATE_EARNING'
  | 'SUBSCRIPTION_REFUND'
  | 'ADMIN_CREDIT'
  | 'PROMOTIONAL_BONUS'
  | 'MARKETPLACE_PAYOUT'
  | 'SUBSCRIPTION_PAYMENT'
  | 'MARKETPLACE_PURCHASE'
  | 'WITHDRAWAL';
```

### New File: `src/developer.api.ts`

```typescript
// packages/api-client/src/developer.api.ts

import { client } from './client';

export const developerApi = {
  /** POST /developer/keys — create API key (full key shown ONCE) */
  createKey: (name: string, scopes: string[], expiresAt?: string) =>
    client.post<{ key: string; prefix: string; scopes: string[] }>(
      '/developer/keys',
      { name, scopes, expiresAt }
    ),

  /** GET /developer/keys — list all keys (no full key) */
  listKeys: () =>
    client.get<ApiKeyDto[]>('/developer/keys'),

  /** DELETE /developer/keys/:id — revoke key */
  revokeKey: (id: string) =>
    client.delete<{ revoked: true }>(`/developer/keys/${id}`),

  /** GET /developer/keys/validate — validate a key (uses X-API-Key mode) */
  validateKey: () =>
    client.get<{ valid: true; scopes: string[]; tier: ApiTier }>(
      '/developer/keys/validate'
    ),

  /** POST /developer/webhooks — subscribe to events */
  createWebhook: (url: string, events: string[], secret: string) =>
    client.post<WebhookSubscriptionDto>('/developer/webhooks', { url, events, secret }),

  /** GET /developer/webhooks — list subscriptions */
  listWebhooks: () =>
    client.get<WebhookSubscriptionDto[]>('/developer/webhooks'),

  /** DELETE /developer/webhooks/:id — unsubscribe */
  deleteWebhook: (id: string) =>
    client.delete<{ deleted: true }>(`/developer/webhooks/${id}`),
};

export type ApiTier = 'STARTER' | 'GROWTH' | 'ENTERPRISE';

export interface ApiKeyDto {
  id:          string;
  name:        string;
  prefix:      string;      // e.g. "bm_live_" — for display
  scopes:      string[];
  tier:        ApiTier;
  isActive:    boolean;
  rateLimit:   number;
  lastUsedAt:  string | null;
  expiresAt:   string | null;
  createdAt:   string;
}

export interface WebhookSubscriptionDto {
  id:        string;
  url:       string;
  events:    string[];
  isActive:  boolean;
  createdAt: string;
}
```

### New File: `src/polymind.api.ts`

```typescript
// packages/api-client/src/polymind.api.ts
// NOTE: This client is used in apikey mode (polymind-extension)
// Frontend apps do not call polymind endpoints

import { client } from './client';

export type PolyMindProvider = 'openai' | 'claude' | 'gemini' | 'groq' | 'mistral';

export interface PolyMindQueryOpts {
  systemPrompt?: string;
  maxTokens?:    number;
  temperature?:  number;
}

export interface PolyMindResponse {
  content:    string;
  model:      string;      // e.g. "gpt-4o", "claude-3-5-sonnet-20241022"
  tokensUsed: number;
  latencyMs:  number;
  error?:     string;      // set if provider failed, content = ""
}

export const polymindApi = {
  /** POST /polymind/:provider — single-model query */
  query: (provider: PolyMindProvider, prompt: string, opts?: PolyMindQueryOpts) =>
    client.post<PolyMindResponse>(`/polymind/${provider}`, { prompt, ...opts }),

  /** Query all providers in parallel (client-side fan-out) */
  queryAll: (
    providers: PolyMindProvider[],
    prompt:    string,
    opts?:     PolyMindQueryOpts
  ): Promise<Array<{ provider: PolyMindProvider; result: PolyMindResponse | null }>> =>
    Promise.allSettled(
      providers.map((p) =>
        client.post<PolyMindResponse>(`/polymind/${p}`, { prompt, ...opts })
      )
    ).then((results) =>
      results.map((r, i) => ({
        provider: providers[i]!,
        result:   r.status === 'fulfilled' ? r.value : null,
      }))
    ),

  /** GET /polymind/history — past comparisons */
  history: (page = 1, pageSize = 20) =>
    client.get('/polymind/history', { params: { page, pageSize } }),
};
```

### New File: `src/educenter-lms.api.ts`

```typescript
// packages/api-client/src/educenter-lms.api.ts

import { client } from './client';

export const educenterLmsApi = {
  // Courses
  createCourse:   (data: CreateCourseDto) => client.post('/educenter/lms/courses', data),
  listMyCourses:  (page = 1, pageSize = 20) =>
    client.get('/educenter/lms/courses', { params: { page, pageSize } }),
  getCourse:      (id: string) => client.get(`/educenter/lms/courses/${id}`),
  updateCourse:   (id: string, data: Partial<CreateCourseDto>) =>
    client.patch(`/educenter/lms/courses/${id}`, data),
  publishCourse:  (id: string) => client.post(`/educenter/lms/courses/${id}/publish`, {}),

  // Lessons
  addLesson:    (courseId: string, data: CreateLessonDto) =>
    client.post(`/educenter/lms/courses/${courseId}/lessons`, data),
  updateLesson: (id: string, data: Partial<CreateLessonDto>) =>
    client.patch(`/educenter/lms/lessons/${id}`, data),
  deleteLesson: (id: string) => client.delete(`/educenter/lms/lessons/${id}`),

  // Students & earnings
  getCourseStudents: (courseId: string, page = 1, pageSize = 20) =>
    client.get(`/educenter/lms/courses/${courseId}/students`, { params: { page, pageSize } }),
  getCourseEarnings: (courseId: string, from?: string, to?: string) =>
    client.get(`/educenter/lms/courses/${courseId}/earnings`, { params: { from, to } }),

  // AI generator
  generateCourse: (data: GenerateCourseDto) =>
    client.post<{ jobId: string }>('/educenter/lms/generate', data),
};
```

### New File: `src/educenter-school.api.ts`

```typescript
// packages/api-client/src/educenter-school.api.ts

import { client } from './client';

export const educenterSchoolApi = {
  registerSchool:      (data: RegisterSchoolDto) =>
    client.post('/educenter/schools/register', data),
  getMySchool:         () => client.get('/educenter/schools/me'),
  bulkEnrollStudents:  (students: { email: string; name: string }[]) =>
    client.post('/educenter/schools/me/students', { students }),
  getMyStudents:       (page = 1, pageSize = 20, search?: string) =>
    client.get('/educenter/schools/me/students', { params: { page, pageSize, search } }),
  getClassPerformance: (examType?: string, subject?: string) =>
    client.get('/educenter/schools/me/performance', { params: { examType, subject } }),
  createAssignment:    (data: CreateAssignmentDto) =>
    client.post('/educenter/schools/me/assignments', data),
};
```

### `index.ts` — Barrel Exports to Add

```typescript
// packages/api-client/src/index.ts — ADD these exports:
export * from './wallet.api';
export * from './developer.api';
export * from './polymind.api';
export * from './educenter-lms.api';
export * from './educenter-school.api';
```

---

## §C — `@boldmindng/ui` — InstallPromptBanner Addition

The shared-export reference adds `InstallPromptBanner` to the `ui` package:

```
packages/ui/components/InstallPromptBanner.tsx   ✨ NEW
```

This component is a re-export wrapper around `@boldmindng/pwa`'s `InstallPromptBanner`:

```typescript
// packages/ui/components/InstallPromptBanner.tsx
// Re-export from pwa package — keeps import path clean for app consumers

export { InstallPromptBanner } from '@boldmindng/pwa';
```

**Usage in app root layouts:**

```typescript
// e.g. educenter-web/app/layout.tsx
import { InstallPromptBanner } from '@boldmindng/ui';
import { getProductBySlug } from '@boldmindng/utils';

const product = getProductBySlug('educenter');

// Render only for products with twa defined:
// product.twa !== undefined
{product?.twa && <InstallPromptBanner productSlug="educenter" dismissible />}
```

**Which apps show the banner:**
```
boldmind-web    → TWA: boldmind-hub (themeColor: #00143C) — show on mobile
amebogist-web   → TWA: ng.amebogist.app               — show on mobile
educenter-web   → TWA: ng.educenter.app                — show on mobile
planai-suite    → project-manager TWA                  — show only on /projects
```

---

## §D — `@boldmindng/ui` — `AppLayout` Provider Addition

The shared doc confirms `AppLayout` in `packages/ui/providers/AppLayout.tsx`. This wraps all apps:

```typescript
// packages/ui/providers/AppLayout.tsx
// Composes: FontProvider + theme-provider + ErrorBoundary + AuthProvider + CookieConsent

interface AppLayoutProps {
  productSlug: string;
  children:    React.ReactNode;
}

export function AppLayout({ productSlug, children }: AppLayoutProps) {
  return (
    <ThemeProvider attribute="data-product" defaultTheme={productSlug}>
      <FontProvider slug={productSlug}>
        <ErrorBoundary>
          <AuthProvider>
            <CookieConsent />
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </FontProvider>
    </ThemeProvider>
  );
}
```

**Usage in each app root layout.tsx:**
```typescript
// e.g. amebogist-web/app/amebogistLayout.tsx (confirmed in tree)
import { AppLayout } from '@boldmindng/ui';

export default function AmebogistLayout({ children }) {
  return <AppLayout productSlug="amebogist">{children}</AppLayout>;
}
```

---

## §E — Queue Constants — Full Updated File

The canonical doc adds 4 new queue constants. Here is the **complete** `queues.ts` replacement:

```typescript
// boldmind-service/src/common/constants/queues.ts — FULL FILE

export const QUEUES = {
  // ── Communication ──────────────────────────────────────────────
  EMAIL_NOTIFICATIONS: 'email-notifications',    // Via Resend, 3× exp retry
  SMS_OTP:             'sms-otp',               // WhatsApp → SMS fallback, HIGH priority

  // ── Content & Social ───────────────────────────────────────────
  SOCIAL_PUBLISHING:   'social-publishing',     // Delayed BullMQ jobs
  AI_GENERATION:       'ai-generation',         // Provider fallback chain
  IMAGE_GENERATION:    'image-generation',      // fal.ai → DALL-E fallback

  // ── Business Operations ────────────────────────────────────────
  PAYROLL_PROCESSING:  'payroll-processing',    // Idempotent, HIGH, 0 retries
  MEDIA_PROCESSING:    'media-processing',      // R2 upload + virus scan

  // ── Payments & Wallet ──────────────────────────────────────────
  PAYMENT_WEBHOOK:     'payment-webhook',       // CRITICAL, 5× with 10s backoff
  WALLET_CREDIT:       'wallet-credit',         // HIGH, must never fail, 3× retry

  // ── Background Intelligence ────────────────────────────────────
  TREND_ANALYSIS:      'trend-analysis',        // Cron every 2h, LOW priority
  KOLO_REMINDERS:      'kolo-reminders',        // WhatsApp reminders

  // ── Enterprise & Extensions ────────────────────────────────────
  POLYMIND_QUERY:      'polymind-query',        // PolyMind fan-out AI calls
  WEBHOOK_DELIVERY:    'webhook-delivery',      // Enterprise webhook delivery, 3× exp

  // ── Data Hygiene ───────────────────────────────────────────────
  NDPA_ERASURE:        'ndpa-erasure',          // Cron: daily midnight Lagos, 0 retries
  SEO_SITEMAP:         'seo-sitemap',           // Cron: nightly, 0 retries
} as const;

export type QueueName = typeof QUEUES[keyof typeof QUEUES];
```

**Priority assignments (use these in `new Queue(name, { defaultJobOptions: { priority } })`)**:

```typescript
// Priority: 1 = highest, 10 = lowest (BullMQ convention)
export const QUEUE_PRIORITIES: Record<QueueName, number> = {
  [QUEUES.PAYMENT_WEBHOOK]:    1,   // Critical — never delay Paystack
  [QUEUES.WALLET_CREDIT]:      2,   // High — financial integrity
  [QUEUES.SMS_OTP]:            2,   // High — user is waiting
  [QUEUES.PAYROLL_PROCESSING]: 3,   // High — time-sensitive
  [QUEUES.EMAIL_NOTIFICATIONS]:5,   // Normal
  [QUEUES.SOCIAL_PUBLISHING]:  5,   // Normal (may be delayed jobs)
  [QUEUES.AI_GENERATION]:      5,   // Normal
  [QUEUES.IMAGE_GENERATION]:   5,   // Normal
  [QUEUES.MEDIA_PROCESSING]:   5,   // Normal
  [QUEUES.KOLO_REMINDERS]:     5,   // Normal
  [QUEUES.POLYMIND_QUERY]:     5,   // Normal
  [QUEUES.WEBHOOK_DELIVERY]:   5,   // Normal
  [QUEUES.TREND_ANALYSIS]:     8,   // Low
  [QUEUES.SEO_SITEMAP]:        9,   // Low
  [QUEUES.NDPA_ERASURE]:       9,   // Low
};
```

---

## §F — `redis.service.ts` — Complete File

```typescript
// boldmind-service/src/database/redis.service.ts
// REPLACES the single-instance Redis service

import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  /**
   * SESSION — SSO relay tokens, JWT refresh families, OTP codes,
   *           rate limit counters, feature flags.
   * Upstash config: 256MB, AOF persistence, max-memory-policy=noeviction
   */
  readonly session: Redis;

  /**
   * QUEUE — BullMQ ONLY. Never use for reads/writes directly.
   * Upstash config: 1GB+, RDB persistence, max-memory-policy=noeviction
   */
  readonly queue: Redis;

  /**
   * CACHE — ALOC questions, exchange rates, computed stats, feature flags.
   * Upstash config: 512MB, no persistence, max-memory-policy=allkeys-lru
   */
  readonly cache: Redis;

  constructor(private config: ConfigService) {
    this.session = this.createClient('REDIS_SESSION_URL', 'session');
    this.queue   = this.createClient('REDIS_QUEUE_URL',   'queue');
    this.cache   = this.createClient('REDIS_CACHE_URL',   'cache');
  }

  private createClient(envKey: string, label: string): Redis {
    const url = this.config.getOrThrow<string>(envKey);
    const client = new Redis(url, {
      maxRetriesPerRequest: null,   // required by BullMQ
      lazyConnect: false,
      reconnectOnError: (err) => {
        this.logger.error(`Redis [${label}] error: ${err.message}`);
        return true;
      },
    });

    client.on('connect',  () => this.logger.log(`Redis [${label}] connected`));
    client.on('error',    (e) => this.logger.error(`Redis [${label}] error`, e.message));
    client.on('close',    () => this.logger.warn(`Redis [${label}] connection closed`));

    return client;
  }

  onModuleDestroy(): void {
    this.logger.log('Closing Redis connections...');
    this.session.quit();
    this.queue.quit();
    this.cache.quit();
  }
}
```

**`app.module.ts` BullMQ update:**

```typescript
// boldmind-service/src/app.module.ts — BullModule config
BullModule.forRootAsync({
  inject:      [RedisService],
  useFactory:  (redis: RedisService) => ({
    connection: redis.queue,   // ← QUEUE instance ONLY
    defaultJobOptions: {
      removeOnComplete: { count: 1000 },  // keep last 1000 completed
      removeOnFail:     { age: 7 * 24 * 3600 }, // keep failed for 7 days
    },
  }),
}),
```

---

## §G — Missing Modules Table (Complete)

From the canonical `boldmind-service-canonical.md` §2:

| Module | Path in boldmind-service | Wave | Prisma Changes Needed | Notes |
|---|---|---|---|---|
| **Redis split** | `src/database/redis.service.ts` | **0 — IMMEDIATE** | none | Rewrite existing to 3 instances |
| **Queue constants** | `src/common/constants/queues.ts` | **0 — IMMEDIATE** | none | Add 4 new constants |
| **Wallet** | `src/modules/wallet/` | 1 | `Wallet`, `WalletLedger`, 3 enums | Full CRUD + ledger |
| **Referrals** | `src/modules/user/referral.service.ts` | 1 | `Referral`, `AffiliateEarning` | Attach to UserModule |
| **OTP WhatsApp chain** | `src/modules/notification/notification.service.ts` | 1 | none | Upgrade existing `sendOTP()` |
| **SMS OTP queue processor** | `src/modules/notification/` | 1 | none | New BullMQ processor |
| **EduCenter LMS** | `src/modules/educenter/lms/` | 3 | none (Course models exist) | New sub-controller |
| **EduCenter School** | `src/modules/educenter/school/` | 3 | `School` model | New sub-controller |
| **Prompt Library schemas** | `src/modules/educenter/schemas/` | 3 | MongoDB only | `PromptTemplate`, `Playbook` |
| **Vibe Coders Classroom** | Extend `villagecircle/vibecoders/` | 3 | `VibeCoderProjectSubmission`, `VibeCoderAttendance` | Extend existing controller |
| **API Keys** | `src/modules/api/api-key/` | 4 | `ApiKey`, `ApiTier` enum | Enterprise Developer API |
| **Webhooks** | `src/modules/api/webhook/` | 4 | `WebhookSubscription` + MongoDB delivery log | |
| **Enterprise routes** | `src/modules/api/enterprise/` | 4 | none | Public scoped API |
| **PolyMind proxy** | `src/modules/polymind/` | 4 | none | MongoDB comparison history |
| **Changelog page data** | `src/modules/hub/hub.service.ts` | 4 | `SystemStatus` (lightweight) | Feeds `/hub/changelog` endpoint |
| **Developer docs** | `boldmind-web` (not service) | 4 | none | `/developers/*` pages |

**Note on `kolo-ai/translation.schema.ts`:** The canonical doc flags this schema filename as probably incorrect — it should be `kolo-group.schema.ts`. When building the KoloAI Wave 5 feature, rename it and update all imports in the module.

---

## §H — API Reference Cross-Reference

The `boldmind-service-canonical.md` contains the **full API reference** for all 18 endpoint groups. The system-design-v2 only summarises. When generating code for any endpoint, use the canonical doc as the source of truth for:

- Exact request body shape
- Exact response shape
- Auth requirement
- Side effects (what BullMQ jobs fire, what notifications send)

Quick lookup:

| Section | Groups Covered |
|---|---|
| §4.1 | Auth (register, login, refresh, logout, verify, reset, 2FA, Google OAuth) |
| §4.2 | SSO (relay, exchange, verify, logout-all) |
| §4.3 | User / Me (admin user mgmt + self-service) |
| §4.4 | Hub (dashboard, products, ecosystem, referral, waitlist, changelog) |
| §4.5 | Payment & Subscription |
| §4.6 | Wallet ⚡ MISSING |
| §4.7 | Media |
| §4.8 | Notification (push, email, OTP) |
| §4.9 | Analytics |
| §4.10 | AI (generate, image, social caption, trends) |
| §4.11 | Automation (social schedule, email campaigns, n8n) |
| §4.12 | Amebogist (posts, reactions, comments, creator) |
| §4.13 | EduCenter (CBT, courses, LMS, school, prompts, playbooks) |
| §4.14 | PlanAI (all 13 tools — social, ads, brand, intelligence, investor, marketing, directory, agent, projects, CRM, HR, fitness, marketplace) |
| §4.15 | VillageCircle (waitlist, vibecoders pipeline, kolo, remit, receipts, safeai, farmgate, gig) |
| §4.16 | Admin |
| §4.17 | Developer / Enterprise API ⚡ MISSING |
| §4.18 | PolyMind Proxy ⚡ MISSING |

---

## §I — Cross-App Package Usage Matrix

This matrix was in `boldmind-shared-export-reference.md` but absent from `system-design-v2.md`. Add it to Section 6 of v2:

| Package | boldmind-web | planai-suite | amebogist-web | educenter-web | villagecircle-web | boldmind-service | polymind-extension |
|---|---|---|---|---|---|---|---|
| `@boldmindng/utils` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (products/pricing only) | ➖ |
| `@boldmindng/ui` | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ (own React UI) |
| `@boldmindng/auth` | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ |
| `@boldmindng/api-client` | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ✅ (apikey mode) |
| `@boldmindng/analytics` | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ | ➖ |
| `@boldmindng/email` | ➖ | ➖ | ➖ | ➖ | ➖ | ✅ only | ➖ |
| `@boldmindng/payments` | ➖ | ➖ | ➖ | ➖ | ➖ | ✅ only | ➖ |
| `@boldmindng/sms` | ➖ | ➖ | ➖ | ➖ | ➖ | ✅ only | ➖ |
| `@boldmindng/wallet` | ✅ | ➖ | ➖ | ➖ | ➖ | ➖ (Prisma directly) | ➖ |
| `@boldmindng/api-docs` | ✅ (changelog + docs) | ➖ | ➖ | ➖ | ➖ | ➖ (source of OpenAPI) | ➖ |
| `@boldmindng/pwa` | ✅ | ➖ | ✅ (TWA) | ✅ (TWA) | ➖ | ➖ | ➖ |
| `@boldmindng/deploy-config` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |

**Key rules from this matrix:**
- `email`, `payments`, `sms` are **server-side only** — never import in frontend repos
- `wallet` is **client-side helper only** — never talks to DB (uses api-client internally)
- `polymind-extension` uses `api-client` in `apikey` mode — no other shared packages
- `boldmind-service` uses `utils` only for `BOLDMIND_PRODUCTS` / `BOLDMIND_PRICING` constants — never imports `ui` or `auth`

---

## §J — Tooling Packages

These three tooling packages exist in `boldmind-shared/tooling/` and are consumed by every repo:

### `@boldmindng/eslint-config` (`tooling/eslint-config/`)

```javascript
// tooling/eslint-config/index.js
// Extends: next/core-web-vitals, turbo
// Custom rules:
//   - Ban localStorage/sessionStorage in packages/ui, packages/auth, packages/pwa
//     (enforces CRITICAL_BROWSER_STORAGE rule from system design)
//   - Require data-product attribute on root layout elements

// Usage in each repo:
// eslint.config.js: export default require('@boldmindng/eslint-config')
```

### `@boldmindng/tailwind-config` (`tooling/tailwind-config/`)

```typescript
// tooling/tailwind-config/src/preset.ts
// Derives Tailwind colors FROM colors.ts BOLDMIND_COLOR_SCHEMES (never hardcode hex)
// Adds font families: jakarta, inter, playfair, lora, dyslexic, mono
// Adds screens: mobile (375px), sm, md, lg, xl, 2xl

// Usage in each repo:
// tailwind.config.js: { presets: [require('@boldmindng/tailwind-config').preset] }
```

### `@boldmindng/tsconfig` (`tooling/tsconfig/`)

| File | Extends | Used by |
|---|---|---|
| `base.json` | — | Root `tsconfig.json` of all repos |
| `node-library.json` | `base.json` | `api-client`, `payments`, `sms`, `wallet`, `api-docs`, `deploy-config` |
| `react-library.json` | `base.json` | `ui`, `pwa` (DOM + React JSX) |

```jsonc
// Usage in each package's tsconfig.json:
{
  "extends": "@boldmindng/tsconfig/react-library.json"
}
```

---

## §K — Known Issues / Flags from Canonical Docs

These items are flagged in the canonical docs and must be addressed:

### 1. `kolo-ai/translation.schema.ts` — Probable Misnaming
```
Current file: src/modules/villagecircle/kolo-ai/translation.schema.ts
Expected:     src/modules/villagecircle/kolo-ai/kolo-group.schema.ts
```
When building Wave 5 KoloAI feature: rename file, update import in `kolo-ai.module.ts`.

### 2. Google OAuth Bug in `auth.controller.ts` — Must Fix Before Going Live
The uploaded `auth.controller.ts` has a double-call bug on Google OAuth callback:

```typescript
// ❌ CURRENT (BUG — wrong args):
const relayToken = await this.ssoService.createRelayToken(user.id, accessToken);
const relayUrl   = await this.ssoService.createRelayToken(returnUrl, relayToken); // ← WRONG

// ✅ FIX — use buildSsoRelayUrl:
const relayUrl = await this.ssoService.buildSsoRelayUrl(
  user.id,
  accessToken,
  returnUrl,
  {}, // empty UTM on OAuth redirect
);
return res.redirect(relayUrl);
```

### 3. `os.api.ts` — Legacy Alias
`packages/api-client/src/os.api.ts` is a legacy alias re-exporting `planaiApi.projects` (Project Manager was formerly "BoldMind OS"). New code should use `planaiApi.projects` directly. The file is kept for backward compatibility only.

### 4. `fitness.api.ts` — Legacy Alias
Same pattern: `fitness.api.ts` re-exports `planaiApi.fitness`. New code: use `planaiApi.fitness` directly.

### 5. `@boldmindng/payments` — Server-Only Warning
This package must **never** be imported in Next.js frontend repos. It contains secret payment SDK clients. If you see it in a frontend `package.json`, remove it immediately. Frontends interact with payments via `paymentApi` from `@boldmindng/api-client`.

---

## §L — Environment Variables — Complete Checklist

This is the **complete** env var checklist from `boldmind-service-canonical.md §8`. The system-design-v2 was missing several groups.

```env
# ─── DATABASE ─────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://...                # Neon PostgreSQL (Prisma)
MONGODB_URI=mongodb+srv://...               # MongoDB Atlas (Mongoose)

# ─── REDIS (3 INSTANCES — all required after Wave 0) ─────────────────────────
REDIS_SESSION_URL=redis://default:<pw>@<host>:6379   # SSO, OTP, rate limits
REDIS_QUEUE_URL=redis://default:<pw>@<host>:6379     # BullMQ ONLY
REDIS_CACHE_URL=redis://default:<pw>@<host>:6379     # ALOC, rates, stats
# Upstash recommended:
#   SESSION: 256MB, AOF, noeviction
#   QUEUE:   1GB+, RDB, noeviction
#   CACHE:   512MB, no persistence, allkeys-lru

# ─── AUTH ─────────────────────────────────────────────────────────────────────
JWT_SECRET=<64-char hex>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://api.boldmind.ng/api/v1/auth/google/callback

# ─── PAYMENTS ─────────────────────────────────────────────────────────────────
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_WEBHOOK_SECRET=

# ─── AI PROVIDERS ─────────────────────────────────────────────────────────────
OPENAI_API_KEY=                             # GPT-4o (primary)
ANTHROPIC_API_KEY=                          # Claude (PolyMind proxy)
GOOGLE_GEMINI_API_KEY=                      # Gemini (PolyMind proxy)
GROQ_API_KEY=                               # Groq/LLaMA (PolyMind proxy)
CLOUDFLARE_AI_TOKEN=                        # Cloudflare Workers AI
CLOUDFLARE_ACCOUNT_ID=
FAL_API_KEY=                                # fal.ai FLUX image generation
OLLAMA_BASE_URL=http://localhost:11434      # Local Ollama (dev only)

# ─── COMMUNICATIONS ───────────────────────────────────────────────────────────
RESEND_API_KEY=                             # Email via Resend
TERMII_API_KEY=                             # SMS fallback via Termii
TERMII_SENDER_ID=BOLDMIND                   # NCC-registered sender ID
META_WHATSAPP_PHONE_NUMBER_ID=              # WhatsApp Business OTP (primary)
META_WHATSAPP_ACCESS_TOKEN=                 # Meta Cloud API access token
META_VERIFY_TOKEN=                          # Meta webhook verification token

# ─── STORAGE ──────────────────────────────────────────────────────────────────
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_ENDPOINT=                    # https://<accountid>.r2.cloudflarestorage.com
CLOUDFLARE_STREAM_TOKEN=                   # Cloudflare Stream (video)

# ─── INTEGRATIONS ─────────────────────────────────────────────────────────────
ALOC_API_KEY=                              # EduCenter exam questions
ALOC_BASE_URL=

# ─── WEB PUSH / PWA ───────────────────────────────────────────────────────────
VAPID_PUBLIC_KEY=                          # Also needed as NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:hello@boldmind.ng

# ─── ENTERPRISE API ───────────────────────────────────────────────────────────
API_KEY_ENCRYPTION_SECRET=<32-char hex>    # Used in ApiKeyGuard SHA-256 hash
WEBHOOK_DELIVERY_TIMEOUT_MS=5000

# ─── APP ──────────────────────────────────────────────────────────────────────
PORT=3001
NODE_ENV=production
API_VERSION=v1
FRONTEND_URLS=https://boldmind.ng,https://planai.boldmind.ng,https://educenter.com.ng,https://villagecircle.ng,https://amebogist.ng
CORS_ORIGINS=                              # Same as FRONTEND_URLS
HUB_URL=https://boldmind.ng               # Used in auth.controller.ts post-login redirect
```

**Frontend env vars (add to all Next.js apps — values vary per app):**

```env
# Common across ALL 5 Next.js apps:
NEXT_PUBLIC_API_URL=https://api.boldmind.ng/api/v1
NEXT_PUBLIC_HUB_URL=https://boldmind.ng            # Same for all apps
NEXT_PUBLIC_POSTHOG_KEY=ph_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=                      # For subscribeToPush() in @boldmindng/pwa

# Per-app values:
NEXT_PUBLIC_APP_URL=https://boldmind.ng            # change per app
NEXT_PUBLIC_PRODUCT_SLUG=boldmind-hub              # change per app

# Server-side only (not prefixed NEXT_PUBLIC_):
SSO_EXCHANGE_URL=https://api.boldmind.ng/api/v1/auth/sso/exchange
```

---

## §M — Changeset Workflow Detail

The `boldmind-shared` monorepo uses `@changesets/cli`. Here is the exact workflow:

```bash
# 1. Make changes to any package(s)

# 2. Create a changeset describing what changed:
pnpm changeset
# → Prompts: which packages changed? major/minor/patch? summary?
# → Creates .changeset/<random-name>.md

# 3. In CI or before release — bump versions:
pnpm changeset version
# → Reads all .changeset/*.md files
# → Bumps package.json versions accordingly
# → Updates each package's CHANGELOG.md
# → Deletes the .changeset/*.md files

# 4. Publish to GitHub Packages:
pnpm changeset publish
# → Runs `pnpm build` per changed package
# → Runs `pnpm publish --no-git-checks`
# → Tags the release in git

# CI triggers (`.github/workflows/release.yml`):
# - On merge to main → run `pnpm changeset version` + commit
# - On release tag → run `pnpm changeset publish`
```

**Each `CHANGELOG.md` must reference which `BOLDMIND_PRODUCTS` slugs were affected:**

```markdown
## 0.3.0 — 2026-06-14

### Minor Changes

- `@boldmindng/api-client`: Added `wallet.api.ts` and `developer.api.ts`
  - Products affected: `boldmind-hub`, `planai`

- `@boldmindng/sms`: Added `WhatsAppProvider` for OTP primary delivery
  - Products affected: all (auth flows)
```

This enables `packages/api-docs/src/changelog.ts` to deep-link entries to affected product pages on the `/changelog` page in `boldmind-web`.

---

## §N — Implementation Priority Summary (Combined View)

Merging `system-design-v2.md` Wave plan with `boldmind-service-canonical.md` §Summary:

### 🔴 Do First (Wave 0 — before any feature work)

| Task | File | Owner |
|---|---|---|
| Rewrite Redis to 3 instances | `src/database/redis.service.ts` | backend |
| Update BullMQ connection | `src/app.module.ts` | backend |
| Add 4 queue constants | `src/common/constants/queues.ts` | backend |
| Provision 3 Upstash Redis instances | Upstash dashboard | devops |

### 🔴 Wave 1 (Weeks 1–3)

| Task | File | Owner |
|---|---|---|
| Prisma migration: Wallet + Referral + AffiliateEarning | `prisma/schema.prisma` | backend |
| Build Wallet module | `src/modules/wallet/` | backend |
| Wire wallet credit to Paystack webhook | `payment.service.ts` | backend |
| Upgrade OTP to WhatsApp-first | `notification.service.ts` | backend |
| Build `@boldmindng/sms` package | `packages/sms/` | shared |
| Create `wallet.api.ts` | `packages/api-client/src/` | shared |
| Fix Google OAuth bug | `auth.controller.ts` | backend |

### 🟡 Wave 2 (Weeks 3–7)

| Task | File | Owner |
|---|---|---|
| CRM full CRUD + WhatsApp sync | `plan-crm.service.ts` | backend |
| HR & Payroll full flow | `hr-payroll.service.ts` | backend |
| AI Business Agent | `biz-agent.service.ts` | backend |
| Marketplace escrow | `marketplace.service.ts` | backend |

### 🟡 Wave 3 (Weeks 5–9)

| Task | File | Owner |
|---|---|---|
| LMS Builder API | `src/modules/educenter/lms/` | backend |
| School Management API | `src/modules/educenter/school/` | backend |
| Prisma: School + VibeCoderClassroom models | `prisma/schema.prisma` | backend |
| Prompt Library + Playbook MongoDB schemas | `src/modules/educenter/schemas/` | backend |
| Vibe Coders classroom endpoints | `villagecircle/vibecoders/` | backend |
| LMS frontend routes | `educenter-web/app/(dashboard)/lms/` | frontend |
| School frontend routes | `educenter-web/app/(dashboard)/school/` | frontend |
| Prompt Library frontend | `educenter-web/app/prompts/` | frontend |
| Create `educenter-lms.api.ts` + `educenter-school.api.ts` | `packages/api-client/src/` | shared |

### 🔵 Wave 4 (Weeks 8–12)

| Task | File | Owner |
|---|---|---|
| Prisma: ApiKey + WebhookSubscription | `prisma/schema.prisma` | backend |
| Enterprise API module | `src/modules/api/` | backend |
| PolyMind proxy module | `src/modules/polymind/` | backend |
| Developer portal pages | `boldmind-web/app/(public)/developers/` | frontend |
| Changelog page | `boldmind-web/app/(public)/changelog/` | frontend |
| Build `@boldmindng/api-docs` | `packages/api-docs/` | shared |
| Create `developer.api.ts` + `polymind.api.ts` | `packages/api-client/src/` | shared |
| `polymind-extension` repo scaffold | new repo | extension |

### 🔵 Wave 5+ (Weeks 10–16)

VillageCircle concept graduation — one at a time per product status change in `products.ts`.

---

## §O — Audit Checklists Per Package

These are the per-package audit checklists from `boldmind-shared-export-reference.md`. Run these every time a package is touched:

### `@boldmindng/utils`
- [ ] `src/constants/products.ts`, `pricing.ts`, `colors.ts` are **re-exports** of the source files — not copies. Any copy = drift risk.
- [ ] `formatNaira()` correctly divides by 100 and uses `toLocaleString('en-NG')`
- [ ] `useStorage` hook is not confused with Prisma/Redis — it's purely client-side

### `@boldmindng/ui`
- [ ] `SuperNavbar` / `SuperFooter` read product data from `@boldmindng/utils` helpers — no hardcoded nav arrays
- [ ] `InstallPromptBanner` only renders for products where `product.twa !== undefined`
- [ ] All components use CSS variables (`--product-primary` etc.) — no hex literals for product colors
- [ ] `PricingContent` reads from `BOLDMIND_PRICING` — no hardcoded prices

### `@boldmindng/auth`
- [ ] `createAuthMiddleware` path lists match B5 from checklist (per-app correct paths)
- [ ] `buildSsoRelayUrl` used (not two `createRelayToken` calls) per Google OAuth bug fix
- [ ] No `localStorage` anywhere in this package — Zustand in-memory + httpOnly cookies only

### `@boldmindng/api-client`
- [ ] Every function returns the **unwrapped** data shape (not `{ data: ... }` wrapper)
- [ ] All 5 new files exist: `wallet.ts`, `developer.ts`, `polymind.ts`, `educenter-lms.ts`, `educenter-school.ts`
- [ ] `client.ts` supports dual auth mode (`jwt` | `apikey`)

### `@boldmindng/sms`
- [ ] `boldmind_otp` WhatsApp template approved by Meta before going live
- [ ] `OTPService.send()` order: WhatsApp → Termii → email (email_verify only)
- [ ] Channel used is logged to `OTPVerification.metadata`

### `@boldmindng/wallet`
- [ ] `WalletSource` union matches Prisma enum exactly (9 values)
- [ ] `useWallet` invalidates on: payment success, referral conversion, marketplace payout

### `@boldmindng/api-docs`
- [ ] `@scalar/api-reference` is the consumer of `openapi.json` in `boldmind-web /developers/docs`
- [ ] `getChangelog` maps `products?` field using `BOLDMIND_PRODUCTS` slugs

### `@boldmindng/pwa`
- [ ] `generateManifest` guards on `product.twa !== undefined`
- [ ] `registerServiceWorker` is a no-op in `NODE_ENV !== 'production'`
- [ ] VAPID keys in both service env AND `NEXT_PUBLIC_VAPID_PUBLIC_KEY` in frontend envs

### `@boldmindng/deploy-config`
- [ ] `APP_ENV_SCHEMAS` for `boldmind-service` covers all 8 env groups in §L
- [ ] `DOMAIN_CONFIG` includes `planai.boldmind.ng` and `marketplace.boldmind.ng`
- [ ] CSP `connect-src` includes `https://api.boldmind.ng`
- [ ] `generateVercelConfig` rewrites preserve `?sso_token=` query param

---

*Alignment Addendum | June 2026*
*Read alongside: boldmind-system-design-v2.md, boldmind-service-canonical.md, boldmind-shared-export-reference.md*
*Attach all three + project-tree.md for each repo when generating code*
