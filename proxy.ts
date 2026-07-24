import { createAuthMiddleware } from "@boldmindng/auth";

export const proxy = createAuthMiddleware({
  isExternalDomain: false,
  loginPath: "/login",
  dashboardPath: "/dashboard",
  publicPaths: [
    // (public) group — reconciled against the actual app/(public)/ route
    // tree. This list had drifted from what's really there:
    //   - '/' (the homepage itself!) was missing entirely — with the
    //     matcher below only excluding api/_next/favicon, that meant an
    //     unauthenticated visitor hitting the bare domain would get
    //     redirected to /login instead of seeing the marketing homepage.
    //   - '/changelog', '/developers', '/docs', '/keys', '/start',
    //     '/status', '/webhooks' are real folders under (public) that
    //     were never added here.
    //   - '/blog' was listed but no such route exists anywhere in the
    //     tree — removed rather than left as a dead entry.
    "/",
    "/about",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
    "/ecosystem",
    "/changelog",
    "/developers",
    "/docs",
    "/keys",
    "/start",
    "/status",
    "/webhooks",
    // auth group handled by redirectIfAuthenticated inside pages
    "/login",
    "/register",
    "/forgot-password",
    "/change-password",
    "/reset-password",
    "/verify-email",
    // SSO relay — must always be reachable
    "/sso",
    // API routes — never intercepted
    "/api",
    "/auth",
    // Static assets
    "/_next",
    "/favicon",
    "/manifest",
    "/robots",
    "/sitemap",
    "/icons",
    "/images",
    "/og",
    "/logo",
  ],
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
