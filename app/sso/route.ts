/**
 * app/sso/route.ts
 *
 * THE FIX for "redirects to boldmind.ng/login but never comes back correctly"
 *
 * Hub's /sso is reached in two scenarios:
 *
 * A) User came from an external domain (amebogist/educenter/villagecircle), was sent
 *    to /login?return_url=https://[external]/sso?return_path=/dashboard
 *    After login, Hub redirects to return_url which is THIS handler.
 *    This handler creates a relay token and redirects to the external /sso with it.
 *
 * B) OAuth return — same as A but triggered by Google callback.
 *
 * Previously the Hub was redirecting directly to return_url after login without
 * creating a relay token, so the external domain had no way to authenticate.
 *
 * This handler is also used for Hub-to-Hub SSO (same .boldmind.ng domain)
 * but in that case no relay is needed — just forward to return_path.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@boldmindng/auth/server';
import { buildSsoRelayUrl, isExternalPillarDomain, safeRedirectUrl } from '@boldmindng/auth';
import { parseUTMFromSearchParams, buildUTMQueryString } from '@boldmindng/analytics';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;

  const returnUrl  = searchParams.get('return_url') ?? searchParams.get('redirect') ?? '/dashboard';
  const returnPath = searchParams.get('return_path') ?? '/dashboard';
  const utmParams  = parseUTMFromSearchParams(searchParams);

  // Verify the user has a valid Hub session
  const session = await getServerSession();
  if (!session) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('return_url', returnUrl);
    const utmString = buildUTMQueryString(utmParams);
    if (utmString) loginUrl.search += `&${utmString}`;
    return NextResponse.redirect(loginUrl);
  }

  const safeReturn = safeRedirectUrl(returnUrl, '/dashboard');

  // External pillar domain — need relay token
  if (isExternalPillarDomain(safeReturn)) {
    try {
      const relayUrl = await buildSsoRelayUrl(
        session.token,
        safeReturn,
        utmParams,
      );
      return NextResponse.redirect(relayUrl);
    } catch {
      // Relay creation failed — redirect to dashboard as fallback
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
    }
  }

  // Same .boldmind.ng domain or relative path — direct redirect
  const dest = safeReturn.startsWith('http')
    ? new URL(safeReturn)
    : new URL(safeReturn, req.nextUrl.origin);

  const utmString = buildUTMQueryString(utmParams);
  if (utmString) {
    for (const [k, v] of new URLSearchParams(utmString)) {
      dest.searchParams.set(k, v);
    }
  }

  return NextResponse.redirect(dest);
}