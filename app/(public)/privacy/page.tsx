

import type { Metadata } from 'next';
import { PrivacyPolicy } from '@boldmindng/ui';

const BASE_URL =
  process.env['NEXT_PUBLIC_APP_URL']?.replace(/\/$/, '') ?? 'https://boldmind.ng';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How BoldmindNG collects, uses, and protects your personal data across all 52+ ecosystem products. NDPR compliant.',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy — BoldmindNG',
    description:
      'Our commitment to protecting your data across the BoldmindNG ecosystem.',
    url: `${BASE_URL}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <PrivacyPolicy
      companyName="Boldmind Technology Solution Enterprise"
      contactEmail="privacy@boldmind.ng"
      effectiveDate="February 18, 2026"
    />
  );
}