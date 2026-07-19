import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PublicLayout from "../../PublicLayout";
import {
  CHANGELOG_ENTRIES,
  getAllChangelogSlugs,
  getChangelogEntry,
  type ChangelogType,
} from "../data";
import { getColorScheme } from "@boldmindng/utils";
import { ArrowLeft, Sparkles, Wrench, Bug, CheckCircle2 } from "lucide-react";

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

interface PageProps {
  params: { version: string };
}

export function generateStaticParams() {
  return getAllChangelogSlugs().map((version) => ({ version }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const entry = getChangelogEntry(params.version);
  if (!entry) return { title: "Changelog" };
  return {
    title: `v${entry.version} — ${entry.title}`,
    description: entry.summary,
  };
}

export default function ChangelogVersionPage({ params }: PageProps) {
  const entry = getChangelogEntry(params.version);
  if (!entry) notFound();

  const type = TYPE_META[entry.type];
  const productColor = getColorScheme(entry.product).primary;

  const index = CHANGELOG_ENTRIES.findIndex((e) => e.slug === entry.slug);
  const older = CHANGELOG_ENTRIES[index + 1];
  const newer = index > 0 ? CHANGELOG_ENTRIES[index - 1] : undefined;

  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--product-background)" }}>
        <section className="py-14 sm:py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/changelog"
              className="inline-flex items-center gap-1.5 text-sm font-bold mb-8 transition-opacity hover:opacity-70"
              style={{ color: "var(--product-primary)" }}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              All changelog entries
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
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
                className="text-xs tabular-nums"
                style={{ color: "var(--product-foreground)", opacity: 0.45 }}
              >
                {new Date(entry.date).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1
              className="font-black mb-3"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                color: "var(--product-foreground)",
              }}
            >
              v{entry.version}
              <span className="block" style={{ color: productColor }}>
                {entry.title}
              </span>
            </h1>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "var(--product-foreground)", opacity: 0.65 }}
            >
              {entry.summary}
            </p>

            <ul className="space-y-3 mb-12">
              {entry.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "var(--product-foreground)" }}
                >
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: productColor }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div
              className="flex items-center justify-between pt-6 border-t text-sm font-bold"
              style={{ borderColor: "var(--product-muted)" }}
            >
              {older ? (
                <Link
                  href={`/changelog/${older.slug}`}
                  className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
                  style={{ color: "var(--product-primary)" }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />v
                  {older.version}
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link
                  href={`/changelog/${newer.slug}`}
                  className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
                  style={{ color: "var(--product-primary)" }}
                >
                  v{newer.version}
                  <ArrowLeft
                    className="w-3.5 h-3.5 rotate-180"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
