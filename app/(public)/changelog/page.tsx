import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "../PublicLayout";
import { CHANGELOG_ENTRIES, type ChangelogType } from "./data";
import { getColorScheme } from "@boldmindng/utils";
import { Sparkles, Wrench, Bug, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "What shipped across the BoldmindNG ecosystem — Hub, PlanAI, EduCenter, AmeboGist, and VillageCircle.",
};

// type → { icon, semantic color, label } — semantic tokens (success/info/
// warning) rather than product tokens here, because "feature/improvement/fix"
// is a cross-product taxonomy, not any one pillar's brand.
const TYPE_META: Record<
  ChangelogType,
  { label: string; Icon: typeof Sparkles; fg: string; bg: string }
> = {
  feature: {
    label: "New",
    Icon: Sparkles,
    fg: "var(--color-success)",
    bg: "var(--color-success-light)",
  },
  improvement: {
    label: "Improved",
    Icon: Wrench,
    fg: "var(--color-info)",
    bg: "var(--color-info-light)",
  },
  fix: {
    label: "Fixed",
    Icon: Bug,
    fg: "var(--color-warning)",
    bg: "var(--color-warning-light)",
  },
};

const PRODUCT_LABEL: Record<string, string> = {
  "boldmind-hub": "BoldmindNG Hub",
  planai: "PlanAI",
  educenter: "EduCenter",
  amebogist: "AmeboGist",
  villagecircle: "VillageCircle",
};

export default function ChangelogPage() {
  const entries = [...CHANGELOG_ENTRIES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

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
            Changelog
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            What shipped
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto">
            Every release across the ecosystem — Hub, PlanAI, EduCenter,
            AmeboGist, VillageCircle.
          </p>
        </section>

        {/* Entries */}
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {entries.map((entry) => {
              const type = TYPE_META[entry.type];
              const productColor = getColorScheme(entry.product).primary;
              return (
                <Link
                  key={entry.slug}
                  href={`/changelog/${entry.slug}`}
                  className="block rounded-2xl border-2 p-6 transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: "var(--product-muted)",
                    backgroundColor: "var(--product-background)",
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: type.bg, color: type.fg }}
                    >
                      <type.Icon className="w-3 h-3" aria-hidden="true" />
                      {type.label}
                    </span>
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${productColor}18`,
                        color: productColor,
                      }}
                    >
                      {PRODUCT_LABEL[entry.product] ?? entry.product}
                    </span>
                    <span
                      className="text-xs tabular-nums ml-auto"
                      style={{
                        color: "var(--product-foreground)",
                        opacity: 0.45,
                      }}
                    >
                      {new Date(entry.date).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h2
                    className="font-black text-lg mb-1.5 flex items-center gap-2"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    v{entry.version} — {entry.title}
                    <ArrowUpRight
                      className="w-4 h-4 opacity-40"
                      aria-hidden="true"
                    />
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "var(--product-foreground)",
                      opacity: 0.65,
                    }}
                  >
                    {entry.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
