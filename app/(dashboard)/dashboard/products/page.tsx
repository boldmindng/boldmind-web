'use client';

import type { Metadata } from 'next';
import { useMySubscriptions } from '../../../../lib/hooks';
import { subscriptionApi } from '../../../../lib/api';
import { BOLDMIND_PRODUCTS } from '@boldmindng/utils';
import { toast } from 'sonner';
import { useState } from 'react';

const PILLAR_PRODUCTS = [
  { slug: 'amebogist',   icon: '📰', name: 'AmeboGist',     href: 'https://amebogist.ng',         color: '#065F46' },
  { slug: 'villagecircle',icon: '🌱', name: 'VillageCircle', href: 'https://villagecircle.ng',     color: '#3B1F0A' },
  { slug: 'educenter',   icon: '🎓', name: 'EduCenter',      href: 'https://educenter.com.ng',     color: '#1E40AF' },
  { slug: 'planai',      icon: '⚡', name: 'PlanAI',          href: 'https://planai.boldmind.ng',  color: '#5B21B6' },
];

export default function ProductsPage() {
  const { data, loading, refresh } = useMySubscriptions();
  const [cancelling, setCancelling] = useState<string | null>(null);

  const subs = (data as any)?.data ?? [];

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this subscription?')) return;
    setCancelling(id);
    try {
      await subscriptionApi.cancelSubscription(id);
      toast.success('Subscription cancelled');
      refresh();
    } catch {
      toast.error('Failed to cancel. Please contact support.');
    } finally {
      setCancelling(null);
    }
  };

  const handleUpgrade = async (productSlug: string) => {
    try {
      const res = await subscriptionApi.initializePayment(productSlug, 'pro');
      window.location.href = (res as any).data.authorizationUrl;
    } catch {
      toast.error('Could not start checkout. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--product-foreground)' }}>Products & Subscriptions</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--product-foreground)', opacity: 0.55 }}>
          All products in the BoldmindNG ecosystem. One account unlocks everything.
        </p>
      </div>

      {/* Active subs */}
      {!loading && subs.length > 0 && (
        <div>
          <h2 className="text-base font-black mb-4" style={{ color: 'var(--product-foreground)' }}>Active Subscriptions</h2>
          <div className="space-y-3">
            {subs.map((sub: any) => {
              const product = BOLDMIND_PRODUCTS.find(p => p.slug === sub.productSlug);
              return (
                <div key={sub.productSlug} className="flex items-center gap-4 p-4 rounded-2xl border-2" style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: 'var(--product-highlight)' }}>
                    {product?.icon ?? '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: 'var(--product-foreground)' }}>{product?.name ?? sub.productSlug}</p>
                    <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
                      {sub.tier} · Renews {new Date(sub.currentPeriodEnd).toLocaleDateString('en-NG')}
                    </p>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                    {sub.status ?? 'Active'}
                  </span>
                  <button
                    onClick={() => handleCancel(sub.id)}
                    disabled={cancelling === sub.id}
                    className="text-xs font-semibold ml-2"
                    style={{ color: 'var(--color-error)' }}
                  >
                    {cancelling === sub.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All ecosystem products */}
      <div>
        <h2 className="text-base font-black mb-4" style={{ color: 'var(--product-foreground)' }}>All Ecosystem Products</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PILLAR_PRODUCTS.map(p => {
            const activeSub = subs.find((s: any) => s.productSlug === p.slug);
            return (
              <div key={p.slug} className="rounded-2xl border-2 p-5 flex flex-col gap-4" style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: p.color }}>
                    {p.icon}
                  </div>
                  <div>
                    <p className="font-black text-sm" style={{ color: 'var(--product-foreground)' }}>{p.name}</p>
                    {activeSub ? (
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--color-success)' }}>
                        {activeSub.tier} · Active
                      </span>
                    ) : (
                      <span className="text-[11px]" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>Not subscribed</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-auto">
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 rounded-xl text-sm font-bold border-2 transition-all hover:opacity-80" style={{ borderColor: p.color, color: p.color }}>
                    Open ↗
                  </a>
                  {!activeSub && (
                    <button onClick={() => handleUpgrade(p.slug)} className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-80" style={{ backgroundColor: p.color }}>
                      Subscribe
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}