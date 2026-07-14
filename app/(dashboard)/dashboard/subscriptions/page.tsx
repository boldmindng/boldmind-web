/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Zap,
  Package2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Subscription {
  id?: string;
  productSlug: string;
  productName?: string;
  plan: string;
  status: string;
  expiresAt?: string | null;
  renewsAt?: string | null;
  amount?: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SubscriptionCard({ sub }: { sub: Subscription }) {
  const isActive = sub.status === "active";
  const expiryStr = sub.expiresAt ?? sub.renewsAt;

  return (
    <div
      className={`rounded-2xl border-2 p-5 transition-all ${
        isActive
          ? "border-green-200 bg-green-50/50 dark:bg-green-950/10 dark:border-green-800/50"
          : "border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isActive
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <Package2
              size={18}
              className={isActive ? "text-green-600" : "text-gray-400"}
            />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900 dark:text-white">
              {sub.productName ?? sub.productSlug}
            </p>
            <p className="text-xs text-gray-400 capitalize">{sub.plan} plan</p>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
            isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {isActive ? "● Active" : "○ Inactive"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="space-y-0.5">
          {sub.amount != null && (
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              ₦{sub.amount.toLocaleString()} /{" "}
              {sub.plan === "annual" ? "year" : "month"}
            </p>
          )}
          {expiryStr && (
            <p className="text-xs text-gray-400">
              {isActive ? "Renews" : "Expired"}{" "}
              {new Date(expiryStr).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        {!isActive && (
          <a
            href={`/pricing#${sub.productSlug}`}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Renew →
          </a>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border-2 border-gray-100 bg-white p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Payment verification banner (shows after Paystack redirect) ──────────────

function VerificationBanner({ reference }: { reference: string }) {
  const { data, loading, error } = useVerifyPayment(reference);

  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-sm text-blue-700">
        <Loader2 size={16} className="animate-spin shrink-0" />
        Verifying your payment…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
        <XCircle size={16} className="shrink-0" />
        Payment verification failed: {error.message}
      </div>
    );
  }
  if (data?.status === "success") {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-sm text-green-700">
        <CheckCircle2 size={16} className="shrink-0" />
        Payment confirmed! Your <strong>{data.plan}</strong> plan is now active.
      </div>
    );
  }
  return null;
}

// ─── Quick upgrade card ───────────────────────────────────────────────────────

const FEATURED_PRODUCTS = [
  { slug: "amebogist", name: "Amebogist", plan: "pro", price: 2999 },
  { slug: "boldmind-ai", name: "BoldMind AI", plan: "pro", price: 4999 },
  { slug: "startify", name: "Startify", plan: "basic", price: 1499 },
] as const;

function UpgradeCard({
  product,
  onCheckout,
  loading,
}: {
  product: (typeof FEATURED_PRODUCTS)[number];
  onCheckout: (slug: string, plan: string) => void;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4 hover:border-blue-300 transition-colors">
      <div>
        <p className="font-bold text-sm text-gray-900 dark:text-white">
          {product.name}
        </p>
        <p className="text-xs text-gray-400 capitalize">{product.plan} plan</p>
      </div>
      <p className="text-xl font-black text-gray-900 dark:text-white">
        ₦{product.price.toLocaleString()}
        <span className="text-xs font-normal text-gray-400">/mo</span>
      </p>
      <button
        onClick={() => onCheckout(product.slug, product.plan)}
        disabled={loading}
        className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-[#00143C] hover:bg-[#001F5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            <Zap size={14} /> Upgrade
          </>
        )}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function SubscriptionsContent() {
  const searchParams = useSearchParams();
  const verifyRef = searchParams?.get("reference"); // set by Paystack after redirect

  const { data: subs, loading, error, refresh } = useSubscriptions();
  const initPayment = useInitializePayment();

  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Refresh subscriptions after successful payment verification
  useEffect(() => {
    if (!verifyRef) {
      return;
    }

    const timer = setTimeout(refresh, 2000);
    return () => clearTimeout(timer);
  }, [verifyRef, refresh]);

  const handleCheckout = async (productSlug: string, plan: string) => {
    setCheckoutLoading(productSlug);
    const result = await initPayment.execute({
      productSlug,
      plan,
      email: "", // server will use auth'd user's email
      callbackUrl: `${window.location.origin}/dashboard/subscriptions`,
    });
    if (result?.authorizationUrl) {
      window.location.href = result.authorizationUrl;
    }
    setCheckoutLoading(null);
  };

  const subscriptions = (subs as Subscription[] | null) ?? [];
  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const expiredSubs = subscriptions.filter((s) => s.status !== "active");

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-0 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard size={22} /> Subscriptions
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage your active plans and payments
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Payment verification banner */}
      {verifyRef && <VerificationBanner reference={verifyRef} />}

      {/* Init payment error */}
      {initPayment.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <XCircle size={15} /> {initPayment.error.message}
        </div>
      )}

      {/* Fetch error */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error.message}</p>
          <button
            onClick={refresh}
            className="text-red-600 text-sm font-medium hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Active subscriptions */}
      <section>
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-500" />
          Active Plans
          {activeSubs.length > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
              {activeSubs.length}
            </span>
          )}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonCard /> <SkeletonCard />
          </div>
        ) : activeSubs.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
            <Package2 size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">
              No active subscriptions yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeSubs.map((sub, i) => (
              <SubscriptionCard key={sub.id ?? i} sub={sub} />
            ))}
          </div>
        )}
      </section>

      {/* Expired / inactive */}
      {!loading && expiredSubs.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-gray-500 dark:text-gray-400 mb-3">
            Expired Plans
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expiredSubs.map((sub, i) => (
              <SubscriptionCard key={sub.id ?? i} sub={sub} />
            ))}
          </div>
        </section>
      )}

      {/* Upgrade section */}
      <section>
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
          Upgrade or Add Products Boss
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Powered by Paystack — instant activation after payment.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURED_PRODUCTS.map((p) => (
            <UpgradeCard
              key={p.slug}
              product={p}
              onCheckout={handleCheckout}
              loading={checkoutLoading === p.slug}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          <a href="/pricing" className="hover:text-blue-600 underline">
            View all products and pricing →
          </a>
        </p>
      </section>
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-500">
          Loading subscriptions...
        </div>
      }
    >
      <SubscriptionsContent />
    </Suspense>
  );
}
function useSubscriptions() {
  const [data, setData] = useState<Subscription[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/subscriptions");
      if (!response.ok) throw new Error("Failed to fetch subscriptions");
      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      refresh();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading, error, refresh };
}

function useVerifyPayment(reference: string): {
  data: any;
  loading: boolean;
  error: { message: string } | null;
} {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/verify-payment?reference=${encodeURIComponent(reference)}`,
        );
        if (!response.ok) throw new Error("Failed to verify payment");
        const result = await response.json();
        setData(result.data ?? result);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (reference) verify();
  }, [reference]);

  return { data, loading, error };
}

function useInitializePayment() {
  const [error, setError] = useState<{ message: string } | null>(null);

  const execute = async (options: {
    productSlug: string;
    plan: string;
    email: string;
    callbackUrl: string;
  }) => {
    setError(null);
    try {
      const response = await fetch("/api/initialize-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize payment");
      }

      return await response.json();
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Unknown error",
      });
      return null;
    }
  };

  return { execute, error };
}
