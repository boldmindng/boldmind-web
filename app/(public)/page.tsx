import type { Metadata } from "next";
import PublicLayout from "./PublicLayout";
import Link from "next/link";
import { BOLDMIND_PRICING, getColorScheme } from "@boldmindng/utils";
import {
  Newspaper,
  Sprout,
  GraduationCap,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One BoldmindNG account unlocks everything. Transparent pricing across all four pillars.",
};

// Colors + icons previously hand-typed (hex literals + raw emoji) — both are
// named anti-patterns in the design system (drift-prone hardcoded hex, and
// emoji as the only iconography). Deriving from getColorScheme(slug) keeps
// this list honest against colors.ts, and lucide icons match the rest of the
// app's dashboard/nav iconography.
const PILLAR_PRICING: Array<{
  slug: string;
  name: string;
  Icon: LucideIcon;
  color: string;
  href: string;
  free: boolean;
  paid: string;
  highlight: string;
}> = [
  {
    slug: "amebogist",
    name: "AmeboGist",
    Icon: Newspaper,
    color: getColorScheme("amebogist").primary,
    href: "https://amebogist.ng",
    free: true,
    paid: "₦1,500/month",
    highlight: "Ad-free reading + Creator dashboard",
  },
  {
    slug: "villagecircle",
    name: "VillageCircle",
    Icon: Sprout,
    color: getColorScheme("villagecircle").primary,
    href: "https://villagecircle.ng",
    free: true,
    paid: "₦5,000/month",
    highlight: "Patron tier — exclusive drops + community",
  },
  {
    slug: "educenter",
    name: "EduCenter",
    Icon: GraduationCap,
    color: getColorScheme("educenter").primary,
    href: "https://educenter.com.ng",
    free: true,
    paid: "₦2,500/month",
    highlight: "10K+ past questions, CBT sim, AI tutor",
  },
  {
    slug: "planai",
    name: "PlanAI Suite",
    Icon: Zap,
    color: getColorScheme("planai").primary,
    href: "https://planai.boldmind.ng",
    free: false,
    paid: "₦9,500/month",
    highlight: "13 AI-powered business tools",
  },
];

export default function PricingPage() {
  const hubPricing = BOLDMIND_PRICING.find(
    (p) => p.productSlug === "boldmind-hub",
  );
  const proTier = hubPricing?.tiers.find((t) => t.name === "pro");

  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--product-background)" }}>
        {/* Hero */}
        <section
          className="py-20 text-center px-4"
          style={{
            background:
              "linear-gradient(135deg, var(--product-primary) 0%, color-mix(in srgb, var(--product-primary) 55%, black) 100%)",
          }}
        >
          <p
            className="text-[11px] font-black uppercase tracking-widest mb-4"
            style={{ color: "var(--product-secondary)" }}
          >
            Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple. Transparent. Nigerian.
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto">
            One BoldmindNG account. Pay for what you use. Cancel any time.
          </p>
        </section>

        {/* Hub tiers */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl font-black mb-2"
                style={{ color: "var(--product-foreground)" }}
              >
                BoldmindNG Hub
              </h2>
              <p
                className="text-base"
                style={{ color: "var(--product-foreground)", opacity: 0.6 }}
              >
                Your one account that unlocks the whole ecosystem.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              {/* Free */}
              <div
                className="rounded-2xl border-2 p-7"
                style={{ borderColor: "var(--product-muted)" }}
              >
                <div
                  className="text-[11px] font-black uppercase tracking-widest mb-4"
                  style={{ color: "var(--product-foreground)", opacity: 0.45 }}
                >
                  Free
                </div>
                <div
                  className="text-4xl font-black mb-1 tabular-nums"
                  style={{ color: "var(--product-foreground)" }}
                >
                  ₦0
                </div>
                <p
                  className="text-sm mb-6"
                  style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                >
                  Forever free
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "SSO — one account across all pillars",
                    "Community feed access",
                    "Referral tracking",
                    "Basic dashboard",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--product-foreground)" }}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white shrink-0"
                        style={{ backgroundColor: "var(--product-primary)" }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block text-center py-3 rounded-xl font-bold border-2 text-sm transition-all hover:opacity-80"
                  style={{
                    borderColor: "var(--product-primary)",
                    color: "var(--product-primary)",
                  }}
                >
                  Get Started
                </Link>
              </div>

              {/* Pro */}
              <div
                className="rounded-2xl border-2 p-7 relative"
                style={{
                  borderColor: "var(--product-secondary)",
                  backgroundColor: "var(--product-highlight)",
                }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--product-secondary)",
                    color: "var(--product-foreground)",
                  }}
                >
                  Most Popular
                </div>
                <div
                  className="text-[11px] font-black uppercase tracking-widest mb-4"
                  style={{ color: "var(--product-secondary)" }}
                >
                  Pro
                </div>
                <div
                  className="text-4xl font-black mb-1 tabular-nums"
                  style={{ color: "var(--product-foreground)" }}
                >
                  ₦{(proTier?.priceMonthly.NGN ?? 5000).toLocaleString()}
                </div>
                <p
                  className="text-sm mb-6 tabular-nums"
                  style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                >
                  per month · ₦
                  {(proTier?.priceYearly.NGN ?? 50000).toLocaleString()}/year
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Everything in Free",
                    "Priority community access",
                    "Wallet & payout system",
                    "Extended referral dashboard",
                    "Cross-pillar subscription management",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--product-foreground)" }}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white shrink-0"
                        style={{ backgroundColor: "var(--product-primary)" }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block text-center py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--product-primary)" }}
                >
                  Get Pro →
                </Link>
              </div>
            </div>

            {/* Per-pillar pricing */}
            <div className="text-center mb-10">
              <h2
                className="text-2xl font-black mb-2"
                style={{ color: "var(--product-foreground)" }}
              >
                Pillar Pricing
              </h2>
              <p
                className="text-base"
                style={{ color: "var(--product-foreground)", opacity: 0.6 }}
              >
                Subscribe to individual pillars as you need them.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {PILLAR_PRICING.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border-2 p-5 flex items-start gap-4"
                  style={{
                    borderColor: "var(--product-muted)",
                    backgroundColor: "var(--product-background)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: p.color }}
                  >
                    <p.Icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="font-black text-sm"
                        style={{ color: "var(--product-foreground)" }}
                      >
                        {p.name}
                      </h3>
                      {p.free && (
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "var(--color-success-light)",
                            color: "var(--color-success)",
                          }}
                        >
                          Free tier
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs mb-2"
                      style={{
                        color: "var(--product-foreground)",
                        opacity: 0.55,
                      }}
                    >
                      {p.highlight}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-black text-sm tabular-nums"
                        style={{ color: p.color }}
                      >
                        {p.paid}
                      </span>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold"
                        style={{ color: "var(--product-primary)" }}
                      >
                        View plans ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p
              className="text-center text-sm mt-10"
              style={{ color: "var(--product-foreground)", opacity: 0.45 }}
            >
              All prices in Nigerian Naira (₦). Payments via Paystack. NDPA
              compliant. Cancel any time.
            </p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
