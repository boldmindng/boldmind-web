import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
const HUB_URL =
  process.env['NEXT_PUBLIC_HUB_URL'] ||
  (process.env.NODE_ENV === 'production' ? 'https://boldmind.ng' : 'http://localhost:4001');
 
const SSO_COOKIE = 'boldmind_sso';
 
export function middlewareSSOGuard(request: NextRequest): NextResponse {
  const token = request.cookies.get(SSO_COOKIE)?.value;
 
  if (token) return NextResponse.next();
 
  const loginUrl = new URL(`${HUB_URL}/login`);
  loginUrl.searchParams.set('return_url', request.nextUrl.href);
  return NextResponse.redirect(loginUrl);
}
 
// ─────────────────────────────────────────────────────────────────────────────
// PER-APP MIDDLEWARE FILES
// Copy one of these to your app's middleware.ts
// ─────────────────────────────────────────────────────────────────────────────
 
// ── apps/boldmind-hub/middleware.ts ──────────────────────────────────────────
export default middlewareSSOGuard;
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*'],
};
 