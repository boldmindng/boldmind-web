

import type { Metadata } from 'next';
import { PrivacyPolicy } from '@boldmind-tech/ui';

const BASE_URL =
  process.env['NEXT_PUBLIC_APP_URL']?.replace(/\/$/, '') ?? 'https://boldmind.ng';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How BoldMind Technology Solution Enterprise collects, uses, and protects your personal data across all 32+ ecosystem products. NDPR compliant.',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy — BoldMind',
    description:
      'Our commitment to protecting your data across the BoldMind ecosystem.',
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
      companyName="BoldMind Technology Solution Enterprise"
      contactEmail="privacy@boldmind.ng"
      effectiveDate="February 18, 2026"
    />
  );
}