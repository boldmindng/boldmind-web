import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@boldmindng/auth/server';

const API_URL = process.env['API_INTERNAL_URL'] ?? process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.boldmind.ng/api/v1';
const SSO_COOKIE = process.env['AUTH_COOKIE_NAME'] ?? 'boldmind_sso';

const ALLOWED_DOMAINS = new Set([
  'amebogist.ng',
  'educenter.com.ng',
  'villagecircle.ng',
  'boldmind.ng',
  'planai.boldmind.ng',
  'marketplace.boldmind.ng',
  'localhost',
  '127.0.0.1',
]);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json() as {
    destination: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  };

  // Validate destination
  let destHostname: string;
  try {
    destHostname = new URL(body.destination).hostname.replace(/^www\./, '');
  } catch {
    return NextResponse.json({ message: 'Invalid destination URL' }, { status: 400 });
  }

  if (!ALLOWED_DOMAINS.has(destHostname) && !destHostname.endsWith('.boldmind.ng')) {
    return NextResponse.json({ message: 'Destination not in BoldmindNG ecosystem' }, { status: 403 });
  }

  try {
    const apiRes = await fetch(`${API_URL}/auth/sso/relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`,
        'x-app-domain': 'boldmind.ng',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8_000),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(data, { status: apiRes.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'SSO relay failed' }, { status: 500 });
  }
}