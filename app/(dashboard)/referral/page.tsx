/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useReferralStats } from "../../../lib/hooks";
import { referralApi } from "../../../lib/api";
import { useClipboard } from "../../../lib/hooks";
import { toast } from "sonner";

const LINKABLE_PRODUCTS = [
  { slug: "planai", label: "PlanAI", icon: "⚡" },
  { slug: "educenter", label: "EduCenter", icon: "🎓" },
  { slug: "amebogist", label: "AmeboGist", icon: "📰" },
  { slug: "villagecircle", label: "VillageCircle", icon: "🌱" },
];

export default function ReferralsPage() {
  const { data, loading } = useReferralStats();
  const { copied, copy } = useClipboard();
  const [selectedProduct, setSelectedProduct] = useState("planai");
  const [generatingLink, setGeneratingLink] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");

  const stats = data as any;

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    try {
      const res = await referralApi.generateLink(selectedProduct);
      const url = (res as any).data?.url ?? "";
      setGeneratedUrl(url);
      await copy(url);
      toast.success("Link generated and copied!");
    } catch {
      toast.error("Failed to generate link");
    } finally {
      setGeneratingLink(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-black"
          style={{ color: "var(--product-foreground)" }}
        >
          Referral Hub
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--product-foreground)", opacity: 0.55 }}
        >
          Earn ₦2,500 per active referral. Your code works across all BoldmindNG
          products.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Referral Code",
            value: stats?.code ?? "—",
            highlight: false,
          },
          {
            label: "Total Referrals",
            value: stats?.totalReferrals ?? 0,
            highlight: false,
          },
          {
            label: "Total Earned",
            value: `₦${(stats?.totalEarnings ?? 0).toLocaleString()}`,
            highlight: true,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border-2"
            style={{
              borderColor: s.highlight
                ? "var(--product-secondary)"
                : "var(--product-muted)",
              backgroundColor: s.highlight
                ? "var(--product-highlight)"
                : "var(--product-background)",
            }}
          >
            <p
              className="text-[11px] font-black uppercase tracking-widest mb-2"
              style={{
                color: s.highlight
                  ? "var(--product-secondary)"
                  : "var(--product-foreground)",
                opacity: s.highlight ? 1 : 0.45,
              }}
            >
              {s.label}
            </p>
            <p
              className="text-2xl font-black"
              style={{ color: "var(--product-foreground)" }}
            >
              {String(s.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Link generator */}
      <div
        className="rounded-2xl border-2 p-6"
        style={{
          borderColor: "var(--product-muted)",
          backgroundColor: "var(--product-background)",
        }}
      >
        <h2
          className="text-base font-black mb-4"
          style={{ color: "var(--product-foreground)" }}
        >
          Generate Referral Link
        </h2>

        <div className="flex flex-wrap gap-2 mb-5">
          {LINKABLE_PRODUCTS.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedProduct(p.slug)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all"
              style={{
                borderColor:
                  selectedProduct === p.slug
                    ? "var(--product-primary)"
                    : "var(--product-muted)",
                backgroundColor:
                  selectedProduct === p.slug
                    ? "var(--product-highlight)"
                    : "transparent",
                color: "var(--product-foreground)",
              }}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        {generatedUrl && (
          <div
            className="mb-4 p-3 rounded-xl border font-mono text-xs break-all"
            style={{
              borderColor: "var(--product-muted)",
              backgroundColor: "var(--product-muted)",
              color: "var(--product-foreground)",
            }}
          >
            {generatedUrl}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleGenerateLink}
            disabled={generatingLink}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--product-primary)" }}
          >
            {generatingLink
              ? "Generating…"
              : generatedUrl
                ? "Regenerate & Copy"
                : "Generate & Copy Link"}
          </button>
          {generatedUrl && (
            <button
              onClick={() => copy(generatedUrl)}
              className="px-6 py-3 rounded-xl font-bold text-sm border-2 transition-all"
              style={{
                borderColor: "var(--product-primary)",
                color: "var(--product-primary)",
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          )}
        </div>
      </div>

      {/* Referral list */}
      {!loading && (stats?.referrals?.length ?? 0) > 0 && (
        <div>
          <h2
            className="text-base font-black mb-4"
            style={{ color: "var(--product-foreground)" }}
          >
            Your Referrals
          </h2>
          <div
            className="rounded-2xl border-2 overflow-hidden"
            style={{
              borderColor: "var(--product-muted)",
              backgroundColor: "var(--product-background)",
            }}
          >
            {stats.referrals.map((ref: any, i: number) => (
              <div
                key={ref.id}
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  borderBottom:
                    i < stats.referrals.length - 1
                      ? "1px solid var(--product-muted)"
                      : undefined,
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                  style={{ backgroundColor: "var(--product-primary)" }}
                >
                  {ref.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    {ref.name}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{
                      color: "var(--product-foreground)",
                      opacity: 0.45,
                    }}
                  >
                    {ref.email} · Joined{" "}
                    {new Date(ref.joinedAt).toLocaleDateString("en-NG")}
                  </p>
                </div>
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      ref.status === "active"
                        ? "var(--color-success-light)"
                        : "var(--product-muted)",
                    color:
                      ref.status === "active"
                        ? "var(--color-success)"
                        : "var(--product-foreground)",
                  }}
                >
                  {ref.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
