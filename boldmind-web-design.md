# boldmind-web — Design Document + UX Upgrade Plan

Pillar: **Enablement** · Domain: `boldmind.ng` · Colors: primary `#2B4D87`, secondary `#E9A825`, accent `#5B8ADE`
Source of truth for routes/components: `boldmind-web-project-tree.md`. Source of truth for endpoints: `boldmind-service-canonical.md` §4.4–4.6, §4.16–4.18.

---

## Part 1 — Design Document

## 1. Overview

- **Purpose:** the SSO issuer and ecosystem gateway — one account, one dashboard, access to PlanAI/AmeboGist/EduCenter/VillageCircle, wallet, referrals, admin, and the developer portal.
- **Personas:** founders/business owners managing subscriptions across tools; admins running the ecosystem; third-party developers consuming the enterprise API.
- **Primary goals:** log in once, see what you have access to, top up/manage the wallet, generate referral links, and (for admins) manage users/payments/logs.

## 2. Page/Routing Map

**Public** (`app/(public)/`): `/`, `/about`, `/contact`, `/ecosystem`, `/pricing`, `/privacy`, `/terms`, `/start`, `/status`, `/changelog`, `/changelog/[version]`, `/developers`, `/developers/docs`, `/developers/keys`, `/developers/webhooks`
**Auth** (`app/(auth)/`): `/login`, `/register`, `/forgot-password`, `/onboarding`, `/change-password`, `/verify-email`
**Dashboard** (`app/(dashboard)/`, protected): `/dashboard`, `/dashboard/analytics`, `/dashboard/announcements`, `/dashboard/features`, `/dashboard/notifications`, `/dashboard/products`, `/dashboard/revenue`, `/dashboard/roadmap`, `/dashboard/subscriptions`, `/dashboard/team`, `/dashboard/wallet`, `/account`, `/referrals`, `/settings`
**Admin** (`app/(admin)/admin/`, `role: admin`+): `/admin`, `/admin/dashboard`, `/admin/users`
**API routes:** `app/api/auth/google/callback`, `app/api/auth/logout`, `app/api/auth/sso/relay`, `app/sso/route.ts`

`/developers/keys` and `/developers/webhooks` render against the ⚡-missing `api` module (canonical §4.17) — build the pages against mocked responses now, wire live once `src/modules/api/` ships.
`/dashboard/wallet` renders against the ⚡-missing `wallet` module (canonical §4.6) — same treatment.

## 3. Layout Architecture

```text
app/layout.tsx              → root: ThemeProvider, PostHog init, ErrorBoundary, ClientAuthProvider
app/boldmindLayout.tsx       → FontProvider + SuperNavbar + SuperFooter (marketing shell)
app/(public)/PublicLayout.tsx→ wraps public routes in boldmindLayout
app/(dashboard)/.../ProtectedLayout.tsx → sidebar shell, gated by useUser()
app/(admin)/admin/layout.tsx → admin-only gate, role check via usePermissions('users:read')
app/sso/route.ts             → SSO relay exchange: receives ?token=, calls exchangeSsoToken,
                                sets local refresh cookie, redirects into app
```

`boldmind.ng` and `planai.boldmind.ng`/`marketplace.boldmind.ng` share the `.boldmind.ng` parent cookie automatically; every other ecosystem domain requires the relay-token flow through `app/sso/route.ts`.

## 4. State Management

- **Auth:** `authStore` (Zustand, in-memory only) from `@boldmindng/auth`, hydrated by `ClientAuthProvider`.
- **Server state:** TanStack Query wrapping `@boldmindng/api-client` — `hubApi`, `walletApi`, `paymentApi`, `developerApi`, `adminApi`.
- **Hooks in active use:** `useUser`, `usePermissions`, `useWallet` (from `@boldmindng/wallet`), `useLocalStorage` (draft state on `/onboarding`), `useInstallPrompt`.
- **URL state:** `/changelog/[version]`, `/admin/users?page=&search=`.

## 5. Data Flow (representative)

```text
Login  → POST /auth/login → { user, accessToken, refreshToken }
       → authStore.setAuth() → redirect to /dashboard

Dashboard → GET /hub/dashboard → { subscriptions, recentActivity, productAccess[], walletBalance }
          → StatCard components render each slice

Wallet → GET /wallet → balance/tier/lock → GET /wallet/ledger?page= → paginated table
       → "Top Up" → POST /wallet/topup/initiate → Paystack redirect → webhook credits wallet
       → useWallet().invalidate() on return

Developer key → POST /developer/keys → key shown ONCE → GET /developer/keys → list (prefix only)

Cross-domain link (e.g. "Open PlanAI") → createSsoRelay('boldmind.ng','planai')
       → POST /sso/relay → relay token → https://planai.boldmind.ng/api/auth/sso/relay?token=...
```

## 6. Key Components

| Component                                 | Responsibility                                                                     |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `SuperNavbar` / `SuperFooter`             | ecosystem-wide nav/footer, product data from `BOLDMIND_PRODUCTS`                   |
| `StatCard.tsx`                            | dashboard KPI card primitive                                                       |
| `FlywheelMetrics.tsx`                     | visualizes pillar-to-pillar conversion (awareness→conviction→education→enablement) |
| `CommunityFeed.tsx`                       | builder community feed on dashboard                                                |
| `BusinessDiscovery.tsx`                   | verified business directory widget                                                 |
| `IdentitySection.tsx`                     | profile/ecosystem-role display                                                     |
| `dashboard/HubDashboardPage.tsx`          | composes the `/dashboard` route                                                    |
| `layout/ProtectedLayout.tsx`              | sidebar + auth gate                                                                |
| `AdminOverviewClient.tsx`                 | admin dashboard client shell                                                       |
| `InstallPromptBanner` (`@boldmindng/pwa`) | PWA install nudge                                                                  |

## 7. Dependencies

`@boldmindng/{ui, auth, api-client, utils, analytics, wallet, pwa, api-docs, deploy-config}`. `wallet`, `api-docs`, and `pwa` are boldmind-web-exclusive among the 5 apps.

## 8. Environment Variables

Common: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_HUB_URL`, `NEXT_PUBLIC_POSTHOG_KEY/HOST`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
App-specific: `NEXT_PUBLIC_APP_URL=https://boldmind.ng`, `NEXT_PUBLIC_PRODUCT_SLUG=boldmind-hub`.
Server-only: `SSO_EXCHANGE_URL`. Validate all via `validateEnv('boldmind-web', env)` from `deploy-config`.

## 9. Testing Strategy

- Unit: Jest + RTL on `StatCard`, `FlywheelMetrics`, formatters.
- Integration: mock `api-client` responses for dashboard/wallet/admin flows.
- E2E (Playwright) critical paths: register → onboarding wizard → dashboard; SSO relay round-trip to `planai.boldmind.ng`; wallet top-up (Paystack test mode); admin ban/unban user.

## 10. Performance

- ISR on `/changelog` and `/developers/docs` (revalidate 3600s, per system design §H2).
- `next/image` everywhere; dynamic import on `AdminOverviewClient` and chart-heavy `/dashboard/analytics`.
- Lighthouse target: ≥90 performance on `/`, ≥85 on `/dashboard`.

## 11. Deployment

Vercel project `boldmind-web`, `vercel.json` generated via `generateVercelConfig('boldmind-web')` (preserves `?sso_token=` through rewrites). Build: `pnpm turbo build --filter=boldmind-web`. Env groups: `production`, `preview`.

---

## Part 2 — UX Upgrade Plan

## 1. UX Audit

| Issue                                                       | Page                       | Impact                                                           |
| ----------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------- |
| Wallet card is generic white `shadow-lg`, not on hub tokens | `/dashboard/wallet`        | Feels bolted-on, not native to the hub                           |
| No quick top-up amounts, full Paystack flow for any amount  | `/dashboard/wallet`        | Extra friction for the ₦2k–₦10k range most users actually top up |
| Dashboard is 6 flat metric cards, no next-action framing    | `/dashboard`               | Users see numbers, not what to do next                           |
| Notifications are a plain read/unread list                  | `/dashboard/notifications` | Low engagement, actionable notifications get ignored             |
| Onboarding is a long single form                            | `/onboarding`              | High drop-off risk                                               |
| Developer keys page shows no scope explainer inline         | `/developers/keys`         | Devs guess at scope meaning, mis-scope keys                      |
| No visible PWA install prompt                               | all                        | Missed install opportunity                                       |

## 2. User Journey Map (Founder persona)

`/` (value prop) → `/register` → `/onboarding` → `/dashboard` (wants: what do I have access to, what's my wallet, what's due) → `/dashboard/wallet` (wants: top up fast) → cross-link into PlanAI/EduCenter via SSO relay.

**Friction points:** onboarding length, wallet top-up depth, dashboard lacking "next action" framing.

## 3. Page-by-Page Recommendations

### 3.1 `/onboarding`

- **Now:** single long form.
- **Upgrade:** 3-step wizard — Profile → Product interests (grid from `BOLDMIND_PRODUCTS`, filtered to `pillar: enablement` + top picks per other pillar) → Preferences (Pidgin, dyslexia, exam target). Step indicator top, `useLocalStorage` for draft persistence between steps.
- **Tokens:** enablement-shell restraint — no marketing-shell particle effects here, this is already inside the app.

### 3.2 `/dashboard`

- **Now:** flat metric grid.
- **Upgrade:** cockpit-style widget grid — "Your Top 3 Products" (from subscriptions, with SSO CrossLinks out), "Wallet Balance" (tabular-nums, right-aligned, `#2B4D87` primary token), "Next Payment Due" with inline pay CTA, "Recent Activity" feed, unread notification count badge on `SuperNavbar`.

### 3.3 `/dashboard/wallet`

- **Now:** balance + full ledger.
- **Upgrade:** balance hero (tier badge, tabular-nums amount dominating the card, comparison pill states its axis — "vs last 30 days"), a top-up modal with preset amounts (₦1k/₦5k/₦10k/custom) → bottom sheet on mobile, mini-ledger (last 5) with "View all," flat `secondary` (`#E9A825`) icon fill not a gradient, skeleton shape-matched to the final layout (wide bar for amount, small bar for comparison pill).

### 3.4 `/dashboard/notifications`

- **Upgrade:** each notification becomes a card with type icon, title, body, timestamp, and a **contextual action button** (Verify Email / Pay Invoice / Join Session) — not a bare read toggle. Border-left color keyed to type.

### 3.5 `/developers/keys`

- **Upgrade:** inline scope table (from canonical §4.17's scope map) shown at key-creation time, not just in docs — checkbox list with one-line description per scope, so a dev doesn't over-scope a key.

### 3.6 PWA install

- **Upgrade:** `InstallPromptBanner` (from `@boldmindng/pwa`) as a dismissible bottom banner on `/` and `/dashboard`, gated by `useInstallPrompt().isInstallable`.

## 4. Accessibility

WCAG AA contrast check on `#2B4D87`/`#E9A825` against both light and the dark-navy `#1A3460` companion. Dyslexia-mode is the **default** render case (see boldmind-design skill) — verify no fixed-height text containers on `StatCard` or notification cards. Keyboard nav through the wizard and admin tables; visible focus rings.

## 5. Performance UX

Skeleton (shape-matched) on dashboard widgets and wallet card, not spinners. Optimistic UI on notification read/unread and Pidgin toggle — update locally, sync in background.

## 6. Mobile Experience

Touch targets ≥44px throughout. Wallet top-up modal → bottom sheet on mobile. Dashboard widgets: 1 col mobile / 2 col tablet / grid desktop. `SuperNavbar` collapses to hamburger, items grouped by pillar.

## 7. Implementation Plan

| Priority | Task                                                      | Page(s)                    | Effort | Owner                              |
| -------- | --------------------------------------------------------- | -------------------------- | ------ | ---------------------------------- |
| P0       | Onboarding wizard                                         | `/onboarding`              | 3d     | Frontend + Backend (draft save)    |
| P0       | Wallet quick top-up (blocked on `wallet` module shipping) | `/dashboard/wallet`        | 2d     | Frontend + Backend                 |
| P0       | Dashboard next-action widgets                             | `/dashboard`               | 3d     | Frontend                           |
| P1       | Notifications with contextual actions                     | `/dashboard/notifications` | 2d     | Frontend                           |
| P1       | Developer key scope explainer                             | `/developers/keys`         | 1d     | Frontend (blocked on `api` module) |
| P2       | PWA install banner                                        | `/`, `/dashboard`          | 1d     | Frontend                           |
| P2       | Accessibility + skeleton pass                             | all                        | 2d     | Frontend                           |

### Frontend Design Docs — Addendum v1

**Applies to:** `boldmind-web`, `planai-suite`, `amebogist-web`, `villagecircle-web` design docs.
**Not applied here:** `educenter-web` — see the full v2 rewrite (`educenter-web-design-doc-v2.md`), which got the larger LMS/School Portal priority update.

**Purpose of this addendum:** two things came out of reconciling the individual app docs against `boldmind-service-canonical.md` v1.3 and `boldmind-shared-monorepo-v1.1.md`: (1) a couple of route/module references had drifted or were left as open flags, and (2) none of the four docs below had an explicit "room for future pages" convention the way `/study-hub/*` implicitly has one in educenter — this addendum adds that pattern to each app, plus flags anything newly confirmed or newly gapped by the v1.3 service doc.

---

## boldmind-web

### Reconciliation against `boldmind-service-canonical.md` v1.3

- §2/§8's `/developers/keys` and `/dashboard/wallet` were flagged as blocked on "⚡-missing" `api`/`wallet` modules in the original doc. **Both are now confirmed live** per canonical v1.3 §2.2 (`WalletController` at `/wallet`, `ApiKeyController`/`EnterpriseController`/`WebhookController` under `/developer/*`/`/public/*`). Unblock these two implementation-plan items — the P0 wallet quick top-up task and the P1 developer key scope explainer no longer need to wait on backend.
- No new gaps introduced by the v1.3 Redis/queue hardening or the Social Media Management work (§27/Wave 7 of the master design) — those don't touch this app directly.

### Extensibility — reserving room for future pages

`app/(dashboard)/` currently has a flat list of ~10 routes (`analytics`, `announcements`, `features`, `notifications`, `products`, `revenue`, `roadmap`, `subscriptions`, `team`, `wallet`) plus `/account`, `/referrals`, `/settings`. Going forward:

- New dashboard widgets/sections should nest under an existing route (e.g. `/dashboard/wallet/upgrade` for the Tier-2 BVN upgrade flow) rather than adding new flat top-level routes, unless the feature is genuinely a peer of "wallet" or "team" in scope.
- Reserve `/dashboard/developers` as a likely future in-app mirror of the public `/developers/*` pages (key management without leaving the dashboard shell) — don't name anything else into that slot.
- `/admin/*` is thin (`/admin`, `/admin/dashboard`, `/admin/users`) relative to the admin surface implied by the master design (revenue, vibecoder applicants, logs — Master Design §6.2's Admin group). Reserve `/admin/vibecoders`, `/admin/revenue`, `/admin/logs` as the next additions rather than overloading `/admin/dashboard` with unrelated tables.

---
