

import type { Metadata } from 'next';
import { PricingContent } from '@boldmind-tech/ui';

const BASE_URL =
  process.env['NEXT_PUBLIC_APP_URL']?.replace(/\/$/, '') ?? 'https://boldmind.ng';

const API_URL =
  process.env['NEXT_PUBLIC_API_URL']?.replace(/\/$/, '') ?? 'http://localhost:4001';

export const metadata: Metadata = {
  title: 'Pricing — BoldMind Ecosystem',
  description:
    'Transparent pricing for all 32+ BoldMind products. Free tier available on every product. Start for ₦0 on AmeboGist, EduCenter, PlanAI, and more.',
  keywords: [
    'BoldMind pricing', 'Nigerian tech pricing', 'AmeboGist price',
    'EduCenter subscription', 'PlanAI cost', 'free Nigerian apps',
  ],
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
  openGraph: {
    title: 'Pricing — BoldMind Ecosystem',
    description:
      'Every BoldMind product. Every plan. All in one place. Start free on anything.',
    url: `${BASE_URL}/pricing`,
    images: [{ url: `${BASE_URL}/og-pricing.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoldMind Pricing — Start Free on 32+ Products',
    description: 'Transparent ₦-priced plans for every Nigerian entrepreneur.',
    images: [`${BASE_URL}/og-pricing.png`],
  },
};

// ─── Structured data ──────────────────────────────────────────────────────────

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'BoldMind Ecosystem Pricing Plans',
  description: 'Pricing for all BoldMind products',
  url: `${BASE_URL}/pricing`,
  numberOfItems: 32,
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSUMPTION: Once you paste your endpoints I will update this function.
// Currently returns null which triggers the static fallback inside PricingContent.
// Expected shape: { products: ProductPricing[] }
// ─────────────────────────────────────────────────────────────────────────────

async function fetchLivePricing() {
  try {
    const res = await fetch(`${API_URL}/hub/pricing`, {
      next: { revalidate: 3600 }, // ISR — revalidate every hour
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    // API unavailable — PricingContent falls back to BOLDMIND_PRICING static data
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function HubPricingPage() {
  // Fetch live pricing — result passed as prop when available
  // PricingContent already handles null gracefully (uses static data)
  await fetchLivePricing();

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />

      <main className="flex-1">
        <PricingContent
          isHub={true}
          heading="Transparent Pricing for Every Product"
          subheading="Every BoldMind product. Every plan. All in one place. Start free on anything — no credit card required."
        />
      </main>
    </>
  );
}