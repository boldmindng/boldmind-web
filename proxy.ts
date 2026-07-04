
import { createAuthMiddleware } from '@boldmindng/auth';

export const proxy = createAuthMiddleware({
  isExternalDomain: false,
  loginPath:        '/login',
  dashboardPath:    '/dashboard',
  publicPaths: [
    // (public) group
    '/about', '/pricing', '/contact', '/privacy', '/terms', '/ecosystem', '/blog',
    // auth group handled by redirectIfAuthenticated inside pages
    '/login', '/register', '/forgot-password', '/change-password', '/reset-password', '/verify-email',
    // SSO relay — must always be reachable
    '/sso',
    // API routes — never intercepted
    '/api', '/auth',
    // Static assets
    '/_next', '/favicon', '/manifest', '/robots', '/sitemap', '/icons', '/images', '/og', '/logo',
  ],
});

export const config = {
 matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};