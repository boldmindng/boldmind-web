'use client';

import { useState } from 'react';
import { useWallet } from '../../../../lib/hooks';
import { walletApi } from '../../../../lib/api';
import { toast } from 'sonner';

export default function WalletPage() {
  const { data, loading, refresh } = useWallet();
  const [showPayout, setShowPayout] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [processing, setProcessing]     = useState(false);

  const wallet = (data as any);

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(payoutAmount);
    if (!amount || amount < 5000) { toast.error('Minimum payout is ₦5,000'); return; }
    if (amount > (wallet?.balance ?? 0)) { toast.error('Insufficient balance'); return; }
    setProcessing(true);
    try {
      await walletApi.requestPayout(amount, {});
      toast.success('Payout request submitted! Processing in 1-3 business days.');
      setShowPayout(false);
      setPayoutAmount('');
      refresh();
    } catch {
      toast.error('Payout request failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const transactions = wallet?.transactions ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--product-foreground)' }}>BoldmindNG Wallet</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--product-foreground)', opacity: 0.55 }}>
          Unified earnings across all BoldmindNG products and referrals.
        </p>
      </div>

      {/* Balance cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-6 col-span-1 sm:col-span-1" style={{ background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))' }}>
          <p className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-3">Available Balance</p>
          {loading ? (
            <div className="h-10 w-32 rounded-lg animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          ) : (
            <p className="text-4xl font-black text-white">₦{(wallet?.balance ?? 0).toLocaleString()}</p>
          )}
          <button
            onClick={() => setShowPayout(true)}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-bold border-2 border-white/30 text-white transition-all hover:bg-white/10"
          >
            Request Payout
          </button>
        </div>

        <div className="rounded-2xl p-6 border-2" style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}>
          <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--product-foreground)', opacity: 0.45 }}>Pending</p>
          {loading ? <div className="h-8 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--product-muted)' }} /> : (
            <p className="text-3xl font-black" style={{ color: 'var(--product-foreground)' }}>₦{(wallet?.pendingBalance ?? 0).toLocaleString()}</p>
          )}
          <p className="text-xs mt-1" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>Clears in 7 days</p>
        </div>

        <div className="rounded-2xl p-6 border-2" style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}>
          <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--product-foreground)', opacity: 0.45 }}>Total Earned</p>
          {loading ? <div className="h-8 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--product-muted)' }} /> : (
            <p className="text-3xl font-black" style={{ color: 'var(--product-secondary)' }}>₦{(wallet?.totalEarned ?? 0).toLocaleString()}</p>
          )}
          <p className="text-xs mt-1" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>All time</p>
        </div>
      </div>

      {/* Payout form */}
      {showPayout && (
        <div className="rounded-2xl border-2 p-6" style={{ borderColor: 'var(--product-secondary)', backgroundColor: 'var(--product-highlight)' }}>
          <h2 className="text-base font-black mb-4" style={{ color: 'var(--product-foreground)' }}>Request Payout</h2>
          <form onSubmit={handlePayout} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--product-foreground)' }}>Amount (₦)</label>
              <input
                type="number"
                className="auth-input"
                placeholder="Minimum ₦5,000"
                value={payoutAmount}
                onChange={e => setPayoutAmount(e.target.value)}
                min={5000}
                max={wallet?.balance ?? 0}
                required
              />
            </div>
            <div className="flex gap-2 sm:items-end">
              <button type="submit" disabled={processing} className="px-6 py-3 rounded-xl font-bold text-sm text-white" style={{ backgroundColor: 'var(--product-primary)' }}>
                {processing ? 'Processing…' : 'Request'}
              </button>
              <button type="button" onClick={() => setShowPayout(false)} className="px-6 py-3 rounded-xl font-bold text-sm border-2" style={{ borderColor: 'var(--product-muted)', color: 'var(--product-foreground)' }}>
                Cancel
              </button>
            </div>
          </form>
          <p className="text-xs mt-3" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
            Payouts are processed via Paystack to your registered bank account. 1–3 business days.
          </p>
        </div>
      )}

      {/* Transaction history */}
      <div>
        <h2 className="text-base font-black mb-4" style={{ color: 'var(--product-foreground)' }}>Transaction History</h2>
        <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse" style={{ borderBottom: '1px solid var(--product-muted)' }}>
                <div className="w-9 h-9 rounded-full" style={{ backgroundColor: 'var(--product-muted)' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
                  <div className="h-2 w-24 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
                </div>
                <div className="h-6 w-20 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
              </div>
            ))
          ) : transactions.length === 0 ? (
            <div className="px-5 py-12 text-center" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
              <p className="text-4xl mb-3">👛</p>
              <p className="text-sm">No transactions yet. Start earning through referrals!</p>
            </div>
          ) : (
            transactions.map((tx: any, i: number) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-5 py-4"
                style={{ borderBottom: i < transactions.length - 1 ? '1px solid var(--product-muted)' : undefined }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{
                    backgroundColor: tx.type === 'credit' ? 'var(--color-success-light)' : tx.type === 'pending' ? 'var(--color-warning-light)' : 'var(--color-error-light)',
                    color: tx.type === 'credit' ? 'var(--color-success)' : tx.type === 'pending' ? 'var(--color-warning)' : 'var(--color-error)',
                  }}
                >
                  {tx.type === 'credit' ? '↑' : tx.type === 'pending' ? '⏳' : '↓'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--product-foreground)' }}>{tx.description}</p>
                  <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
                    {new Date(tx.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p className="font-black text-sm" style={{ color: tx.type === 'credit' ? 'var(--color-success)' : tx.type === 'pending' ? 'var(--color-warning)' : 'var(--color-error)' }}>
                  {tx.type === 'debit' ? '-' : '+'}₦{tx.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}