# BoldmindNG Hub (`boldmind-web`) — Proposed Structure, Design & Implementation Plan

**Scope:** This document covers `boldmind-web` (`boldmind.ng`) ONLY. It does not modify
`boldmind-service`, `planai-suite`, `amebogist-web`, `educenter-web`, `villagecircle-web`,
or any `@boldmindng/*` package source. Everywhere this plan depends on a package or backend
endpoint, it is called out explicitly under **Section 6 — Confirmations Needed**, so you can
verify/build that piece in its own repo and update context before we wire it up here.

Sources checked: `project-tree.md`, `boldmind-system-design-v2.md`,
`boldmind-service-canonical_Reference.md`, `products.ts`, `pricing.ts`, `colors.ts`.

---

## 0. Stack Baseline (per v2 §1.2 + memory)

- Next.js 16.2 (App Router only — no `getStaticProps`/pages router)
- React 19.2
- TypeScript 5.9
- Tailwind CSS v4 (PostCSS-based, no legacy `tailwind.config.ts` content scanning needed)
- Zustand, Framer Motion, Lucide React, Sonner
- Auth via `@boldmindng/auth`, API via `@boldmindng/api-client`, UI via `@boldmindng/ui`

---

## 1. Current State Snapshot (from `project-tree.md`)

| Area                                                        | Status                      | Notes                                                                                          |
| ----------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| Route groups `(public)`, `(auth)`, `(dashboard)`, `(admin)` | ✅ present                  | Correct App Router convention — groups don't affect URL                                        |
| `app/sso/route.ts`, `app/api/auth/*`                        | ✅ present                  | Inbound + outbound SSO relay scaffolding exists                                                |
| `middleware.ts`                                             | ❌ **missing**              | v2 §B5 requires this for `/dashboard/*`, `/admin/*` — currently nothing enforces it            |
| `tailwind.config.ts`                                        | ⚠️ present                  | Conflicts with memory note "Tailwind v4 — no `tailwind.config.ts`". Needs reconciling (see §3) |
| `next.config.mjs`, `postcss.config.js`                      | ⚠️ present, in-progress     | Need Tailwind v4 PostCSS plugin wiring                                                         |
| `proxy.ts` (root)                                           | ❓ unknown purpose          | Flagged in §6                                                                                  |
| `system.md` (root)                                          | ❓ unknown purpose          | Likely AI-assistant context for "Ask BoldmindNG" — flagged in §6                               |
| `app/example.tsx`                                           | 🧹 cleanup candidate        | Looks like a scaffold leftover                                                                 |
| `app/(dashboard)/dashboard/wallet/page.tsx`                 | ✅ present, but **blocked** | `@boldmindng/api-client` has no `wallet.ts` yet (canonical ref §6)                             |
| Changelog / Status / Ecosystem / Developer portal pages     | ❌ missing                  | v2 §9 and §8.5 say these belong in `boldmind-web`                                              |

---

## 2. Proposed Standard Structure (annotated)

```
boldmind-web/
├── middleware.ts                                🆕 NEW — route protection (see §3.4)
├── next.config.mjs                              🔄 UPDATE — images, headers (see §3.1)
├── postcss.config.js                            🔄 UPDATE — Tailwind v4 plugin (see §3.2)
├── tailwind.config.ts                           ❌ REMOVE — superseded by @theme in globals.css (see §3.3)
├── proxy.ts                                     ❓ CONFIRM purpose (see §6)
├── system.md                                    ❓ CONFIRM purpose (see §6)
│
├── app/
│   ├── layout.tsx                               🔄 UPDATE — FontProvider/DyslexiaToggle wiring
│   ├── globals.css                              🔄 UPDATE — Tailwind v4 @theme tokens (see §3.3)
│   ├── boldmindLayout.tsx                       ✅ keep — SuperNavbar/SuperFooter shell
│   ├── manifest.ts / robots.ts / sitemap.ts     ✅ keep
│   ├── example.tsx                              ❌ remove (scaffold leftover)
│   │
│   ├── sso/route.ts                             ✅ keep — GET /sso/exchange (inbound relay)
│   ├── api/auth/
│   │   ├── google/callback/route.ts             🔄 UPDATE — relay-token fix (see §4.5)
│   │   ├── logout/route.ts                      ✅ keep
│   │   └── sso/relay/route.ts                   ✅ keep — POST /sso/relay (outbound relay)
│   │
│   ├── components/
│   │   ├── AnalyticsInit.tsx                    ✅ keep
│   │   ├── ClientAuthProvider.tsx               ✅ keep — wraps @boldmindng/auth provider
│   │   └── ClientErrorBoundary.tsx              ✅ keep — wraps @boldmindng/ui ErrorBoundary
│   │
│   ├── (public)/
│   │   ├── PublicLayout.tsx                     ✅ keep
│   │   ├── page.tsx + HomeContent.tsx           ✅ keep
│   │   ├── about/page.tsx                       ✅ keep
│   │   ├── contact/page.tsx                     ✅ keep
│   │   ├── pricing/page.tsx                     🔄 UPDATE — drive from BOLDMIND_PRICING (see §4.1)
│   │   ├── privacy/page.tsx, terms/page.tsx     ✅ keep
│   │   ├── start/page.tsx                       ✅ keep
│   │   ├── ecosystem/page.tsx                   🆕 NEW — GET /hub/ecosystem (see §4.1)
│   │   ├── changelog/
│   │   │   ├── page.tsx                         🆕 NEW — v2 §9.2
│   │   │   └── [version]/page.tsx               🆕 NEW
│   │   ├── status/page.tsx                      🆕 NEW — v2 §9.3, polls GET /health
│   │   └── developers/
│   │       ├── page.tsx
│   │       ├── docs/page.tsx
│   │       ├── keys/page.tsx
│   │       └── webhooks/page.tsx
│   │
│   ├── (auth)/
│   │   ├── layout.tsx                           ✅ keep
│   │   ├── login/page.tsx                       ✅ keep — POST /auth/login
│   │   ├── register/page.tsx                    ✅ keep — POST /auth/register
│   │   ├── forgot-password/page.tsx             ✅ keep — POST /auth/forgot-password
│   │   ├── change-password/page.tsx             ✅ keep — POST /auth/reset-password
│   │   ├── verify-email/page.tsx                ✅ keep — POST /auth/verify-email
│   │   └── onboarding/page.tsx                  ✅ keep — PATCH /users/me/profile (first run)
│   │
│   ├── (dashboard)/
│   │   ├── StatCard.tsx                         ✅ keep
│   │   ├── account/page.tsx                     🔄 UPDATE — add 2FA section (see §4.3)
│   │   ├── referral/page.tsx                    ✅ keep — /hub/referral/*
│   │   ├── components/
│   │   │   ├── layout/ProtectedLayout.tsx       ✅ keep — pairs with middleware.ts
│   │   │   ├── dashboard/HubDashboardPage.tsx   ✅ keep — GET /hub/dashboard
│   │   │   ├── FlywheelMetrics.tsx              ✅ keep — getRevenueByPillar() from products.ts
│   │   │   ├── CommunityFeed.tsx                ✅ keep
│   │   │   ├── IdentitySection.tsx              ✅ keep
│   │   │   └── BusinessDiscovery.tsx            ✅ keep
│   │   └── dashboard/
│   │       ├── layout.tsx                       🔄 UPDATE — wraps ProtectedLayout
│   │       ├── page.tsx                         ✅ keep — renders HubDashboardPage
│   │       ├── products/page.tsx                🔄 UPDATE — GET /hub/products + ProductCard render (see §4.2)
│   │       ├── subscriptions/page.tsx           ✅ keep — GET /subscriptions
│   │       ├── wallet/page.tsx                  ⛔ BLOCKED — needs api-client `wallet.ts` (see §6)
│   │       ├── revenue/page.tsx                 🔄 UPDATE — cross-product revenue rollup
│   │       ├── analytics/page.tsx               ✅ keep
│   │       ├── notifications/page.tsx           ✅ keep — GET /users/me/notifications
│   │       ├── announcements/page.tsx           🔄 UPDATE — GET /hub/changelog
│   │       ├── roadmap/page.tsx                 🔄 UPDATE — getUpcomingReleases() from products.ts
│   │       ├── features/page.tsx                ✅ keep
│   │       └── team/page.tsx                    ❓ CONFIRM scope (see §6)
│   │
│   └── (admin)/admin/
│       ├── layout.tsx                           🔄 UPDATE — role guard via usePermissions
│       ├── page.tsx, dashboard/page.tsx         ✅ keep — GET /admin/dashboard
│       ├── AdminOverviewClient.tsx              ✅ keep
│       └── users/page.tsx                       ✅ keep — GET /admin/users
│
└── lib/
    ├── api/index.ts                             🔄 UPDATE — client singleton + module exports (see §5)
    ├── hooks/index.ts                           🔄 UPDATE — React Query hooks per domain (see §5)
    └── user-api-adapter.ts                      ✅ keep — normalizes /users/me response
```

---

## 3. Foundation Layer — Implementation

### 3.1 `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" }, // media uploads
      { protocol: "https", hostname: "imagedelivery.net" }, // Cloudflare Images/Stream thumbs
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google OAuth avatars
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

> CONFIRM: should `rewrites()` proxy `/api/v1/*` → `https://api.boldmind.ng/api/v1/*`,
> or does `@boldmindng/api-client` always call the absolute URL directly (and `proxy.ts`
> handles local dev only)? See §6.

### 3.2 `postcss.config.js` (Tailwind v4)

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### 3.3 `app/globals.css` — Tailwind v4 `@theme`, replacing `tailwind.config.ts`

Tokens below are taken directly from `colors.ts` (`BOLDMIND_COLOR_SCHEMES['boldmind-hub']`)
and `products.ts` (`BOLDMIND_FONT_CONFIG`, override for `boldmind-hub`).

```css
@import "tailwindcss";

@theme {
  /* Brand palette — colors.ts: BOLDMIND_COLOR_SCHEMES['boldmind-hub'] */
  --color-primary: #2b4d87;
  --color-primary-dark: #1e3a6e;
  --color-secondary: #e9a825;
  --color-accent: #5b8ade;
  --color-background: #fafaf9;
  --color-foreground: #1a202c;
  --color-muted: #e7e5e4;
  --color-success: #38a169;
  --color-warning: #dd6b20;
  --color-error: #c53030;
  --color-info: #3182ce;

  /* Typography — products.ts: BOLDMIND_FONT_CONFIG.overrides['boldmind-hub'] */
  --font-body: "OpenDyslexic", "Plus Jakarta Sans", sans-serif;
  --font-heading: "OpenDyslexic", "Plus Jakarta Sans", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}

/* Dyslexia-friendly mode — toggled by @boldmindng/ui <DyslexiaToggle/>,
   which should add/remove this class on <html>.
   Values match products.ts: BOLDMIND_FONT_CONFIG.dyslexiaSpacing */
.dyslexia-mode {
  letter-spacing: 0.12em;
  word-spacing: 0.25em;
  line-height: 1.8;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-foreground);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-heading);
}

code,
pre {
  font-family: var(--font-mono);
}
```

**Why remove `tailwind.config.ts`:** the Hub's identity colors/fonts already live in
`colors.ts` / `products.ts` as the single source of truth. Duplicating them into a Tailwind
config creates drift risk. Tailwind v4's PostCSS plugin auto-detects classes across the
project (including `colors.ts`, which contains `generateThemeClasses()` returning strings
like `bg-[#2B4D87]`), so no `content` array is required.

When rendering **other products'** cards (e.g. on `dashboard/products/page.tsx`), apply
that product's scheme as scoped inline CSS variables via `generateCSSVariables(getColorScheme(slug))`
on the card's wrapper element — this must NOT overwrite the global `--color-*` tokens above,
which represent the Hub's own brand identity.

> If any Tailwind **plugins** (typography, forms, etc.) are currently registered in
> `tailwind.config.ts`, list them — Tailwind v4 supports plugins via `@plugin "..."` in CSS,
> so nothing is lost, but I need to know which ones exist before deleting the file.

### 3.4 `middleware.ts` (new file)

```ts
import { createAuthMiddleware } from "@boldmindng/auth";

/**
 * Route protection for boldmind-web.
 * Per v2 §B5: dashboard/*, admin/* (and here also account/*, referral/*,
 * which currently live at top-level routes, not under /dashboard).
 */
export const middleware = createAuthMiddleware({
  ssoCookieName: "boldmind_sso",
  loginPath: "/login",
  protectedPaths: ["/dashboard", "/admin", "/account", "/referral"],
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/account/:path*",
    "/referral/:path*",
  ],
};
```

> CONFIRM with `@boldmindng/auth`: exact export name/signature for `createAuthMiddleware`
> (option names `ssoCookieName` / `loginPath` / `protectedPaths` are assumed from v2 §B2–B5
> wording — verify against the package source). See §6.

### 3.5 `app/layout.tsx` — font + provider wiring (sketch)

```tsx
import "./globals.css";
import { FontProvider } from "@boldmindng/ui";
import { ClientErrorBoundary } from "./components/ClientErrorBoundary";
import { ClientAuthProvider } from "./components/ClientAuthProvider";
import { AnalyticsInit } from "./components/AnalyticsInit";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientErrorBoundary>
          <ClientAuthProvider>
            <FontProvider slug="boldmind-hub">
              <AnalyticsInit />
              {children}
            </FontProvider>
          </ClientAuthProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
```

> CONFIRM: does `@boldmindng/ui`'s `FontProvider` accept a `slug` prop and internally call
> `getProductFont`/`generateFontCSS` from `products.ts`? If it instead expects raw CSS or a
> font string, adjust accordingly.

---

## 4. Route-by-Route Design

### 4.1 Public Routes

| Route                                      | Backend source                                   | Design notes                                                                                                                                                                                                                           |
| ------------------------------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` (`HomeContent.tsx`)                    | `products.ts` (pillar metadata)                  | Hero + 4-pillar flywheel summary, links to each pillar domain                                                                                                                                                                          |
| `/about`, `/contact`, `/privacy`, `/terms` | static                                           | No change                                                                                                                                                                                                                              |
| `/pricing`                                 | `pricing.ts` → `BOLDMIND_PRICING`                | Render via `@boldmindng/ui` `PricingContent`, filtered to `pillar: 'enablement'` for Hub-native tiers, with `CrossLink` cards to other pillar pricing pages                                                                            |
| `/start`                                   | —                                                | Existing onboarding CTA funnel; no structural change                                                                                                                                                                                   |
| `/ecosystem` 🆕                            | `GET /hub/ecosystem`                             | Renders the full `BOLDMIND_PRODUCTS` map grouped by `PILLAR_METADATA` — 4 pillar cards (awareness/conviction/education/enablement), each linking to its domain. Use `getPillarSummary()` shape client-side as fallback while API loads |
| `/changelog`, `/changelog/[version]` 🆕    | `packages/api-docs` changelog data (per v2 §9.2) | Static RSC, `revalidate: 3600`. **Blocked** until `packages/api-docs/src/changelog.ts` exists — see §6                                                                                                                                 |
| `/status` 🆕                               | `GET /health`                                    | Simple uptime/incident page per v2 §9.3                                                                                                                                                                                                |
| `/developers/*` 🔜                         | `boldmind-service /developer/*`, `/public/*`     | Entire backend `api/` module is listed MISSING in canonical ref §2 (Wave 4). Defer until that module exists                                                                                                                            |

### 4.2 `dashboard/products/page.tsx`

- Calls `GET /hub/products` → `ProductCard[]` (products the user has access to).
- For each card: render `name`, `description`, `status` badge (`StatusBadge` from `@boldmindng/ui`),
  and apply `generateCSSVariables(getColorScheme(product.slug))` scoped to the card wrapper
  so each product tile uses its own brand color from `colors.ts`.
- Price display: look up `BOLDMIND_PRICING.find(p => p.productSlug === product.slug)` and show
  the "Most Popular" tier badge + monthly price (NGN by default, per user location).
- Link target: `getProductWebsiteUrl(product)` equivalent — for products on external pillar
  domains (`amebogist.ng`, `educenter.com.ng`, `villagecircle.ng`), the link must go through
  the outbound relay flow (`app/api/auth/sso/relay/route.ts` → `?relay=TOKEN`), not a plain `<a href>`.

### 4.3 `account/page.tsx` — add 2FA section

Add a "Security" tab/section that calls:

- `POST /auth/enable-2fa` → show QR code (`secret`, `qrCode` from response)
- `POST /auth/verify-2fa` → confirm enrollment
- `POST /auth/send-phone-otp` + `POST /auth/verify-phone` for phone verification (WhatsApp-first per v2 §5)

This keeps 2FA inside the existing account page rather than adding a new route.

### 4.4 `dashboard/wallet/page.tsx`

Per canonical reference §4.6, the backend endpoints exist (`GET /wallet`, `GET /wallet/ledger`,
`POST /wallet/topup/initiate`, `POST /wallet/upgrade`) but `packages/api-client/src/api/wallet.ts`
is listed as **MISSING**. Page design (once unblocked):

- Balance hero card: `balanceNaira`, `tier` badge, `isLocked` warning banner
- "Top Up" button → `POST /wallet/topup/initiate` → redirect to Paystack `authorizationUrl`
- Tier upgrade CTA (visible only if `tier === 'TIER1'`) → BVN flow → `POST /wallet/upgrade`
- Paginated ledger table (`GET /wallet/ledger`) — credit/debit, `source` label, `description`, date (Lagos time)

### 4.5 `app/api/auth/google/callback/route.ts` — relay token fix

Per memory: "Hub must detect if `return_url` is on an external pillar domain and create a
relay token before redirecting." On the **frontend** side, this route's job is:

1. Forward the OAuth `code` + `return_url` query param to the backend
   `GET /auth/google/callback` (which, per the SSO design in `boldmind-system-design-v2.md`
   §2.1, now owns the `isExternalDomain` / `buildCrossDomainUrl` / `safeRedirectUrl` logic
   that was restored in `auth.controller.ts`).
2. Pass through the `Set-Cookie` header for `boldmind_sso` from the backend response.
3. Redirect the browser to whatever final URL the backend returns (which will already
   include `?relay=TOKEN` if `return_url` was external).

```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/auth/google/callback${search}`,
    {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      redirect: "manual",
    },
  );

  const location = backendRes.headers.get("location") ?? "/dashboard";
  const response = NextResponse.redirect(location);

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) response.headers.set("set-cookie", setCookie);

  return response;
}
```

> CONFIRM: does the backend `/auth/google/callback` already return a `302` with `Location`
> (including `?relay=TOKEN` when needed) and `Set-Cookie`, as assumed above? If it instead
> returns JSON, this route needs different handling — this is a `boldmind-service` detail,
> please confirm there and update context.

---

## 5. Data Layer (`lib/`)

```
lib/
├── api/index.ts        — singleton @boldmindng/api-client instance + re-exports
├── hooks/index.ts       — React Query hooks per domain
└── user-api-adapter.ts  — normalizes GET /users/me (+ profile) into a `HubUser` type
```

**`lib/api/index.ts`** — proposed shape:

```ts
import { createClient } from "@boldmindng/api-client";

export const apiClient = createClient(process.env.NEXT_PUBLIC_API_URL!, {
  mode: "jwt",
  // token resolved at call time from @boldmindng/auth store
});

export * from "@boldmindng/api-client/api/hub";
export * from "@boldmindng/api-client/api/payment";
export * from "@boldmindng/api-client/api/users";
export * from "@boldmindng/api-client/api/admin";
// export * from '@boldmindng/api-client/api/wallet';  // ⛔ add once it exists — see §6
```

**`lib/hooks/index.ts`** — one React Query hook per page above, e.g.:

```ts
export const useHubDashboard = () =>
  useQuery({ queryKey: ["hub", "dashboard"], queryFn: hubApi.getDashboard });
export const useHubProducts = () =>
  useQuery({ queryKey: ["hub", "products"], queryFn: hubApi.getProducts });
export const useHubEcosystem = () =>
  useQuery({ queryKey: ["hub", "ecosystem"], queryFn: hubApi.getEcosystem });
export const useReferralStats = () =>
  useQuery({ queryKey: ["hub", "referral"], queryFn: hubApi.getReferralStats });
export const useChangelog = (page = 1) =>
  useQuery({
    queryKey: ["hub", "changelog", page],
    queryFn: () => hubApi.getChangelog(page),
  });
export const useNotifications = () =>
  useQuery({
    queryKey: ["user", "notifications"],
    queryFn: usersApi.getNotifications,
  });
// useWallet — add once wallet.ts exists in api-client
```

**`lib/user-api-adapter.ts`** — keep existing role, but ensure it surfaces:
`{ id, name, email, avatarUrl, ecosystemRole, dyslexiaMode, prefersPidgin, walletBalanceKobo? }`
so `ProtectedLayout`, `FontProvider`/`DyslexiaToggle`, and `IdentitySection` all read from one shape.

---

## 6. Confirmations Needed (you check these, then update context)

### `@boldmindng/auth`

- Confirm exact export + option names for the route-protection middleware helper used in §3.4
  (`createAuthMiddleware` is assumed per v2 §B5 wording).
- Confirm `use-user.ts` return shape (`user`, `isLoading`, `ecosystemRole`, etc.) and
  `use-permissions.ts` signature for the admin role guard in `(admin)/admin/layout.tsx`.
- Confirm the SSO cookie name is `boldmind_sso` (used in middleware + relay routes).

### `@boldmindng/api-client`

- Confirm `api/hub.ts` exposes: `getDashboard`, `getProducts`, `getEcosystem`,
  `generateReferral`, `getReferralStats`, `getChangelog`, `getStatus`.
- `api/wallet.ts` is listed **MISSING** in the canonical reference (§6) — `dashboard/wallet/page.tsx`
  is blocked until this exists on the `boldmind-service` + `api-client` side. Please confirm
  whether this has been built since the canonical reference was last updated.
- Confirm `createClient(baseUrl, { mode, token })` signature matches §5.

### `@boldmindng/ui`

- Confirm component list/props for: `SuperNavbar`, `SuperFooter`, `PricingContent`,
  `StatusBadge`, `DyslexiaToggle`, `FontProvider`, `CrossLink`, `Logo`, `SocialLinks`.
  In particular: does `PricingContent` accept a `ProductPricing` object straight from
  `pricing.ts`, or does it need a transformed shape?
- Confirm `DyslexiaToggle` toggles a class on `<html>` (assumed `dyslexia-mode` in §3.3)
  vs. setting a CSS variable directly.

### `@boldmindng/utils`

- Confirm `formatNaira(kobo)` and `formatLagosDate(date)` exist with these names
  (used across wallet, ledger, changelog dates).

### `@boldmindng/analytics`

- Confirm `tracker.ts` exposes an `init()`/default export consumed by `AnalyticsInit.tsx`.

### `packages/api-docs` (for `/changelog`)

- Confirm whether `packages/api-docs/src/changelog.ts` exists yet (v2 §6.3 lists it as a
  package to add). `/changelog` and `/changelog/[version]` are blocked until it does.

### `boldmind-service`

- Confirm `/auth/google/callback` response shape (302 redirect w/ `Location` + `Set-Cookie`,
  per §4.5) — needed to finalize the relay-token fix on this side.
- Confirm `GET /hub/ecosystem`, `GET /hub/changelog`, `GET /health` are live (canonical
  reference §4.4 and §4.16 list them as existing, just confirming no signature drift).

### Root-level files

- `proxy.ts` — purpose unclear. If it's a local-dev API proxy, it may be replaceable by
  `next.config.mjs` `rewrites()` (§3.1) — or it may need to stay for another reason. Please clarify.
- `system.md` — appears to be AI-assistant context (possibly for the "Ask BoldmindNG"
  cross-product assistant feature). No action proposed unless you indicate otherwise.
- `dashboard/team/page.tsx` — no corresponding "team management" endpoint exists in the
  canonical API reference for the Hub (PlanAI's `/planai/projects/workspaces` is
  suite-specific, different app). Please clarify what this page should show — placeholder,
  redirect to a PlanAI deep link, or a new Hub-level team endpoint to be designed.

---

## 7. Step Plan — Updating `boldmind-system-design-v2.md`

1. **New Section 16 — "boldmind-web Frontend Reference."** Insert the annotated tree from
   §2 of this document, plus the route tables from §4, as the canonical frontend
   counterpart to the canonical API reference (mirrors the style of
   `boldmind-service-canonical_Reference.md` §1–4 but for the Hub frontend).

2. **Update §2 (Architecture Diagram).** Add `middleware.ts` to the `boldmind-web` box,
   and note the SSO route trio (`app/sso/route.ts`, `app/api/auth/sso/relay/route.ts`,
   `app/api/auth/google/callback/route.ts`) explicitly, since the diagram currently only
   shows `app/sso/route.ts`.

3. **Update §A1 (Master Checklist — Stack Versions).** Add a Tailwind v4 standard:
   _"No `tailwind.config.ts`. Brand tokens defined via `@theme` in `app/globals.css`,
   sourced from `colors.ts` / `products.ts`. Per-product color overrides applied via
   scoped `generateCSSVariables()` inline styles, never global token overrides."_

4. **Update §B5 (Protected Routes).** Replace the generic `middleware.ts` bullet with the
   confirmed matcher list for `boldmind-web`: `/dashboard/*`, `/admin/*`, `/account/*`,
   `/referral/*` (§3.4), once the `@boldmindng/auth` export is confirmed.

5. **Update §9.2/§9.3 (Changelog & Status pages).** Mark these as "Option A — confirmed,
   implemented in `boldmind-web` at `/changelog`, `/changelog/[version]`, `/status`" and
   note the blocking dependency on `packages/api-docs/src/changelog.ts` (§6).

6. **Update §6 (api-client alignment table).** Add a row noting that `dashboard/wallet/page.tsx`
   in `boldmind-web` is blocked on `api/wallet.ts`, so this row's priority should be elevated
   if the Hub wallet page is on the near-term roadmap.

7. **Add "Wave 0.5 — boldmind-web Foundation"** to §14 (Migration Wave Update), before
   Wave 1, containing: middleware.ts, Tailwind v4 config (next.config.mjs / postcss.config.js /
   globals.css, removal of tailwind.config.ts), Google OAuth callback relay fix (§4.5),
   and the three new public pages (`/ecosystem`, `/changelog`, `/status`).

8. **Open-items appendix.** Add a short "Pending Confirmations" list referencing §6 of this
   document verbatim, so the next person picking up `boldmind-web` work knows which
   package/backend pieces were unverified at time of writing.

---

## Next Steps

Once you've checked the items in §6 (especially `@boldmindng/auth` middleware signature and
`@boldmindng/ui` component props), I can implement the foundation layer (§3) for real —
`middleware.ts`, `next.config.mjs`, `postcss.config.js`, `app/globals.css`, and the Google
OAuth callback fix — followed by the new public pages (`/ecosystem`, `/status`, then
`/changelog` once `packages/api-docs` is confirmed), then the `dashboard/products` and
`account` (2FA) updates.
