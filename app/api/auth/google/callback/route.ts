

import { type NextRequest, NextResponse } from 'next/server';
import { buildSsoRelayUrl, isExternalPillarDomain, safeRedirectUrl } from '@boldmindng/auth';
import { parseUTMFromSearchParams, buildUTMQueryString } from '@boldmindng/analytics';

const COOKIE_NAME = process.env['AUTH_COOKIE_NAME'] ?? 'boldmind_sso';
const IS_PROD = process.env.NODE_ENV === 'production';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;

  // api.boldmind.ng passes the access token + return URL after successful OAuth
  const token     = searchParams.get('token');
  const returnUrl = searchParams.get('return_url') ?? '/dashboard';
  const utmParams = parseUTMFromSearchParams(searchParams);

  if (!token) {
    // OAuth failed or was cancelled
    return NextResponse.redirect(new URL('/login?error=oauth_failed', req.nextUrl.origin));
  }

  const safeReturn = safeRedirectUrl(returnUrl, '/dashboard');

  let redirectTarget: string;

  // External pillar domain — MUST create relay token
  if (isExternalPillarDomain(safeReturn)) {
    try {
      redirectTarget = await buildSsoRelayUrl(
        token,        // the just-issued JWT
        safeReturn,   // e.g. https://educenter.com.ng/sso?return_path=/dashboard
        utmParams,
      );
    } catch {
      // Relay failed — fall back to Hub dashboard
      redirectTarget = '/dashboard';
    }
  } else {
    // Same ecosystem (.boldmind.ng or relative)
    const dest = safeReturn.startsWith('http')
      ? new URL(safeReturn)
      : new URL(safeReturn, req.nextUrl.origin);
    const utmString = buildUTMQueryString(utmParams);
    if (utmString) for (const [k, v] of new URLSearchParams(utmString)) dest.searchParams.set(k, v);
    redirectTarget = dest.toString();
  }

  const response = NextResponse.redirect(
    redirectTarget.startsWith('http') ? redirectTarget : new URL(redirectTarget, req.nextUrl.origin),
  );

  // Set the .boldmind.ng SSO cookie
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    domain:   IS_PROD ? '.boldmind.ng' : 'localhost',
    maxAge:   15 * 60, // 15 min
    path:     '/',
  });

  return response;
}