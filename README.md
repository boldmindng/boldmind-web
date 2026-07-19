```
boldmind-web
├─ .npmrc
├─ README.md
├─ app
│  ├─ (admin)
│  │  └─ admin
│  │     ├─ AdminOverviewClient.tsx
│  │     ├─ dashboard
│  │     │  └─ page.tsx
│  │     ├─ layout.tsx
│  │     ├─ page.tsx
│  │     └─ users
│  │        └─ page.tsx
│  ├─ (auth)
│  │  ├─ change-password
│  │  │  └─ page.tsx
│  │  ├─ forgot-password
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ onboarding
│  │  │  └─ page.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  └─ verify-email
│  │     └─ page.tsx
│  ├─ (dashboard)
│  │  ├─ StatCard.tsx
│  │  ├─ account
│  │  │  └─ page.tsx
│  │  ├─ components
│  │  │  ├─ BusinessDiscovery.tsx
│  │  │  ├─ CommunityFeed.tsx
│  │  │  ├─ FlywheelMetrics.tsx
│  │  │  ├─ IdentitySection.tsx
│  │  │  ├─ dashboard
│  │  │  │  └─ HubDashboardPage.tsx
│  │  │  └─ layout
│  │  │     └─ ProtectedLayout.tsx
│  │  ├─ dashboard
│  │  │  ├─ analytics
│  │  │  │  └─ page.tsx
│  │  │  ├─ announcements
│  │  │  │  └─ page.tsx
│  │  │  ├─ features
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ notifications
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ products
│  │  │  │  └─ page.tsx
│  │  │  ├─ referrals
│  │  │  │  └─ page.tsx
│  │  │  ├─ revenue
│  │  │  │  └─ page.tsx
│  │  │  ├─ roadmap
│  │  │  │  └─ page.tsx
│  │  │  ├─ subscriptions
│  │  │  │  └─ page.tsx
│  │  │  ├─ team
│  │  │  │  └─ page.tsx
│  │  │  └─ wallet
│  │  │     └─ page.tsx
│  │  └─ settings
│  │     └─ page.tsx
│  ├─ (public)
│  │  ├─ HomeContent.tsx
│  │  ├─ PublicLayout.tsx
│  │  ├─ about
│  │  │  └─ page.tsx
│  │  ├─ contact
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ pricing
│  │  │  └─ page.tsx
│  │  ├─ privacy
│  │  │  └─ page.tsx
│  │  ├─ start
│  │  │  └─ page.tsx
│  │  └─ terms
│  │     └─ page.tsx
│  ├─ api
│  │  └─ auth
│  │     ├─ google
│  │     │  └─ callback
│  │     │     └─ route.ts
│  │     ├─ logout
│  │     │  └─ route.ts
│  │     └─ sso
│  │        └─ relay
│  │           └─ route.ts
│  ├─ boldmindLayout.tsx
│  ├─ components
│  │  ├─ AnalyticsInit.tsx
│  │  ├─ ClientAuthProvider.tsx
│  │  └─ ClientErrorBoundary.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ manifest.ts
│  ├─ robots.ts
│  ├─ sitemap.ts
│  └─ sso
│     └─ route.ts
├─ boldmind-web-architecture-plan.md
├─ boldmind-web-project-tree.md
├─ eslint.config.mjs
├─ global.d.ts
├─ lib
│  ├─ api
│  │  └─ index.ts
│  ├─ hooks
│  │  └─ index.ts
│  └─ user-api-adapter.ts
├─ next.config.mjs
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.js
├─ proxy.ts
├─ public
│  ├─ about-story-bg.jpg
│  ├─ apple-touch-icon.png
│  ├─ browserconfig.xml
│  ├─ favicon.ico
│  ├─ favicon.png
│  ├─ founder.jpg
│  ├─ hero-bg.jpg
│  ├─ icon-192x192-maskable.png
│  ├─ icon-192x192.png
│  ├─ icon-512x512-maskable.png
│  ├─ icon-512x512.png
│  ├─ icons
│  │  ├─ apple
│  │  │  ├─ apple-touch-icon-114x114.png
│  │  │  ├─ apple-touch-icon-120x120.png
│  │  │  ├─ apple-touch-icon-144x144.png
│  │  │  ├─ apple-touch-icon-152x152.png
│  │  │  ├─ apple-touch-icon-167x167.png
│  │  │  ├─ apple-touch-icon-57x57.png
│  │  │  ├─ apple-touch-icon-60x60.png
│  │  │  ├─ apple-touch-icon-72x72.png
│  │  │  ├─ apple-touch-icon-76x76.png
│  │  │  └─ apple-touch-icon.png
│  │  ├─ favicon-128x128.png
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-256x256.png
│  │  ├─ favicon-32x32.png
│  │  ├─ favicon-48x48.png
│  │  ├─ favicon-64x64.png
│  │  ├─ favicon-96x96.png
│  │  ├─ pwa
│  │  │  ├─ icon-128x128-maskable.png
│  │  │  ├─ icon-128x128.png
│  │  │  ├─ icon-144x144-maskable.png
│  │  │  ├─ icon-144x144.png
│  │  │  ├─ icon-152x152-maskable.png
│  │  │  ├─ icon-152x152.png
│  │  │  ├─ icon-192x192-maskable.png
│  │  │  ├─ icon-192x192.png
│  │  │  ├─ icon-384x384-maskable.png
│  │  │  ├─ icon-384x384.png
│  │  │  ├─ icon-512x512-maskable.png
│  │  │  ├─ icon-512x512.png
│  │  │  ├─ icon-72x72-maskable.png
│  │  │  ├─ icon-72x72.png
│  │  │  ├─ icon-96x96-maskable.png
│  │  │  └─ icon-96x96.png
│  │  └─ windows
│  │     ├─ mstile-144x144.png
│  │     ├─ mstile-150x150.png
│  │     ├─ mstile-310x150.png
│  │     ├─ mstile-310x310.png
│  │     └─ mstile-70x70.png
│  ├─ logo.png
│  ├─ logo.webp
│  ├─ manifest.json
│  ├─ site.webmanifest
│  ├─ social
│  │  ├─ facebook-cover.jpg
│  │  ├─ linkedin-banner.jpg
│  │  ├─ og-image.jpg
│  │  ├─ og-image.webp
│  │  ├─ twitter-card.jpg
│  │  ├─ whatsapp-preview.jpg
│  │  └─ youtube-art.jpg
│  ├─ social-media-banner.png
│  └─ sw.js
├─ system.md
├─ tailwind.config.ts
└─ tsconfig.json

```
