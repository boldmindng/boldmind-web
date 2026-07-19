import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "../PublicLayout";
import {
  BookOpen,
  KeyRound,
  Webhook,
  ArrowRight,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Developers",
  description: "Build on the BoldmindNG API — docs, API keys, and webhooks.",
};

const CARDS = [
  {
    href: "/developers/docs",
    Icon: BookOpen,
    title: "API Documentation",
    description:
      "Endpoint reference for Hub, Auth, Products, and Wallet — request/response shapes and auth requirements.",
  },
  {
    href: "/developers/keys",
    Icon: KeyRound,
    title: "API Keys",
    description:
      "Generate and manage keys scoped to your BoldmindNG account. Rotate or revoke access at any time.",
  },
  {
    href: "/developers/webhooks",
    Icon: Webhook,
    title: "Webhooks",
    description:
      "Subscribe to ecosystem events — subscription changes, wallet top-ups, referral conversions — delivered to your endpoint.",
  },
];

export default function DevelopersPage() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--product-background)" }}>
        {/* Hero */}
        <section
          className="py-16 sm:py-20 text-center px-4"
          style={{
            background:
              "linear-gradient(135deg, var(--product-primary) 0%, color-mix(in srgb, var(--product-primary) 55%, black) 100%)",
          }}
        >
          <p
            className="text-[11px] font-black uppercase tracking-widest mb-4"
            style={{ color: "var(--product-secondary)" }}
          >
            Developers
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Build on BoldmindNG
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto">
            One API, four pillars. Query products, manage subscriptions, and
            react to ecosystem events in real time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/developers/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: "var(--product-secondary)",
                color: "var(--product-foreground)",
              }}
            >
              Read the docs{" "}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/developers/keys"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2 text-white transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}
            >
              Get an API key
            </Link>
          </div>
        </section>

        {/* Cards */}
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
            {CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-2xl border-2 p-6 transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: "var(--product-muted)",
                  backgroundColor: "var(--product-background)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--product-highlight)" }}
                >
                  <card.Icon
                    className="w-5 h-5"
                    style={{ color: "var(--product-primary)" }}
                    aria-hidden="true"
                  />
                </div>
                <h2
                  className="font-black text-base mb-1.5"
                  style={{ color: "var(--product-foreground)" }}
                >
                  {card.title}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--product-foreground)", opacity: 0.6 }}
                >
                  {card.description}
                </p>
                <div
                  className="flex items-center gap-1 mt-4 text-xs font-bold transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--product-primary)" }}
                >
                  Explore{" "}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>

          {/* Quickstart snippet */}
          <div className="max-w-5xl mx-auto mt-10">
            <div
              className="rounded-2xl border-2 p-6"
              style={{
                borderColor: "var(--product-muted)",
                backgroundColor: "var(--product-background)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Terminal
                  className="w-4 h-4"
                  style={{ color: "var(--product-primary)" }}
                  aria-hidden="true"
                />
                <h2
                  className="font-black text-sm"
                  style={{ color: "var(--product-foreground)" }}
                >
                  Quickstart
                </h2>
              </div>
              <pre
                className="rounded-xl p-4 text-xs overflow-x-auto"
                style={{
                  backgroundColor: "var(--product-muted)",
                  color: "var(--product-foreground)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {`curl https://api.boldmind.ng/v1/hub/products \\
  -H "Authorization: Bearer bm_live_••••••••••••"`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
