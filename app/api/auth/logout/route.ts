import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@boldmindng/auth/server';

const API_URL = process.env['API_INTERNAL_URL'] ?? process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.boldmind.ng/api/v1';
const COOKIE_NAME = process.env['AUTH_COOKIE_NAME'] ?? 'boldmind_sso';
const IS_PROD = process.env.NODE_ENV === 'production';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  // Attempt to revoke server-side even if we can't read the session
  if (session) {
    try {
      await fetch(`${API_URL}/auth/logout-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'x-app-domain': 'boldmind.ng',
        },
        signal: AbortSignal.timeout(5_000),
      });
    } catch {/* best-effort — clear cookie regardless */}
  }

  const response = NextResponse.json({ success: true });

  // Clear the SSO cookie on .boldmind.ng domain
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: IS_PROD ? 'none' : 'lax',
    domain:   IS_PROD ? '.boldmind.ng' : 'localhost',
    maxAge:   0,
    path:     '/',
  });

  return response;
}