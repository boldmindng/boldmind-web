Boldmind-web
├── proxy.ts ← createAuthMiddleware({ isExternalDomain: false })
├── app/
│ ├── layout.tsx ← AuthProvider, global nav
│ ├── boldmindLayout.tsx
│ ├── global.css
│ ├── robots.ts ← public landing (/, hero + ecosystem overview)
│ ├── manifest.ts ← public landing (/, hero + ecosystem overview)
│ ├── sitemap.ts ← public landing (/, hero + ecosystem overview)←
│ │
│ ├── (public)/ ← no auth required
│ │ ├── about/page.tsx
│ │ ├── pricing/page.tsx
│ │ ├── contact/page.tsx
│ │ ├── privacy/page.tsx
│ │ ├── terms/page.tsx
│ │ ├── blog/
│ │ │ ├── page.tsx ← blog index
│ │ │ └── [slug]/page.tsx
│ │ └── ecosystem/page.tsx ← flywheel overview, links to all 5 pillars
│ │ ├── HomeContent.tsx
│ │ ├── Layout.tsx
│ │ ├── page.tsx
│ │
│ ├── (auth)/ ← unauthenticated only (redirects away if logged in)
│ │ ├── login/page.tsx ← email/password + Google OAuth
│ │ ├── register/page.tsx
│ │ ├── forgot-password/page.tsx
│ │ ├── change-password/page.tsx
│ │ ├── reset-password/page.tsx ← /reset-password?code=OTP
│ │ ├── layout.tsx ← /reset-password?code=OTP
│ │ └── verify-email/page.tsx
│ │
│ ├── (protected)/ ← requires valid .boldmind.ng SSO cookie
│ │ ├── dashboard/
│ │ │ └── page.tsx ← unified hub dashboard
│ │ │ — subscriptions summary
│ │ │ — active products (from user.profile.activeProducts)
│ │ │ — cross-pillar CTAs (uses CrossPillarLink with SSO relay)
│ │ │ — ecosystem health score
│ │ │ — recent activity feed
│ │ ├── account/
│ │ │ ├── page.tsx ← profile, avatar, dyslexia toggle
│ │ │ ├── subscriptions/page.tsx ← all active plans across ecosystem
│ │ │ └── security/page.tsx ← change password, sessions, 2FA
│ │ ├── settings/
│ │ │ └── page.tsx ← preferences, notifications, referral code
│ │ ├── community/
│ │ │ ├── page.tsx ← founder feed
│ │ │ ├── leaderboard/page.tsx
│ │ │ └── circles/[id]/page.tsx
│ │ ├── wallet/
│ │ │ └── page.tsx ← BoldmindNG wallet, affiliate earnings
│ │ └── onboarding/
│ │ └── page.tsx ← post-registration wizard
│ │
│ ├── auth/
│ │ ├── google/route.ts ← GET — redirects to api.boldmind.ng/auth/google
│ │ └── google/callback/route.ts ← GET — handles OAuth return from api.boldmind.ng
│ │
│ └── api/
│ └── auth/
│ ├── sso/
│ │ └── relay/route.ts ← POST — proxy to api.boldmind.ng/auth/sso/relay
│ └── logout/route.ts ← POST — calls api + clearSsoCookie + broadcastLogout
