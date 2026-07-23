import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { BOLDMIND_PRODUCTS, BOLDMIND_COLOR_SCHEMES } from "@boldmindng/utils";
import PublicLayout from "../PublicLayout";

export const metadata: Metadata = {
  title: "Ecosystem",
  description:
    "One account, four pillars: AmeboGist NG, VillageCircle NG, Boldmind EduCenter, and PlanAI by BoldmindNG.",
};

// The 13 tools PlanAI's own product description calls out as "13 AI-powered
// tools" — there's no single boolean field on Product for "is a core PlanAI
// tool" (boldmind-marketplace's subdomain is 'marketplace', polymind and the
// TWA variants share subdomain 'planai' but aren't part of the 13), so this
// is an explicit slug list rather than a filter. Everything else about each
// tool (name, description, status, icon) still comes from BOLDMIND_PRODUCTS —
// only the *selection* is hardcoded here.
const PLANAI_TOOL_SLUGS = [
  "social-media-manager",
  "ads-center",
  "brand-digital-home",
  "business-intelligence",
  "investor-readiness",
  "marketing-automation",
  "business-discovery",
  "ai-business-agent",
  "project-manager",
  "crm",
  "hr-payroll",
  "boldmind-fitness",
  "boldmind-marketplace",
];

const STATUS_LABEL: Record<string, string> = {
  LIVE: "Live",
  BUILDING: "Building",
  PLANNED: "Planned",
  CONCEPT: "Concept",
};

function StatusPill({ status, tint }: { status: string; tint: string }) {
  return (
    <span
      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
      style={{ backgroundColor: `${tint}1A`, color: tint }}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function PillarCard({
  slug,
  label,
  domain,
  description,
}: {
  slug: string;
  label: string;
  domain: string;
  description: string;
}) {
  const scheme = BOLDMIND_COLOR_SCHEMES[slug];
  const tint = scheme?.primary ?? "var(--product-primary)";
  return (
    <a
      href={`https://${domain}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-2xl p-5 border-2 transition-transform hover:-translate-y-0.5 block"
      style={{ borderColor: `${tint}33`, backgroundColor: `${tint}0D` }}
    >
      <div
        className="text-[10px] font-black uppercase tracking-widest mb-2"
        style={{ color: tint }}
      >
        {label}
      </div>
      <div
        className="text-lg font-black mb-1.5 flex items-center gap-1.5"
        style={{ color: "var(--product-foreground)" }}
      >
        {scheme?.name ?? label}
        <ExternalLink className="w-3.5 h-3.5 opacity-40" />
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--product-foreground)", opacity: 0.65 }}
      >
        {description}
      </p>
    </a>
  );
}

function ToolCard({
  icon,
  name,
  description,
  status,
  tint,
}: {
  icon: string;
  name: string;
  description: string;
  status: string;
  tint: string;
}) {
  return (
    <div
      className="rounded-2xl border-2 p-5"
      style={{
        borderColor: "var(--product-muted)",
        backgroundColor: "var(--product-background)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ backgroundColor: `${tint}1A` }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <StatusPill status={status} tint={tint} />
      </div>
      <h3
        className="text-sm font-black mb-1.5"
        style={{ color: "var(--product-foreground)" }}
      >
        {name}
      </h3>
      <p
        className="text-xs leading-relaxed"
        style={{ color: "var(--product-foreground)", opacity: 0.6 }}
      >
        {description}
      </p>
    </div>
  );
}

function ConceptChip({
  icon,
  name,
  status,
  tint,
}: {
  icon: string;
  name: string;
  status: string;
  tint: string;
}) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl border p-3"
      style={{ borderColor: "var(--product-muted)" }}
    >
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
        style={{ backgroundColor: `${tint}1A` }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span
        className="text-sm font-bold flex-1 min-w-0 truncate"
        style={{ color: "var(--product-foreground)" }}
      >
        {name}
      </span>
      <StatusPill status={status} tint={tint} />
    </div>
  );
}

function FeatureList({ features, tint }: { features: string[]; tint: string }) {
  return (
    <ul className="space-y-2.5">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-sm">
          <span
            className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: tint }}
          />
          <span style={{ color: "var(--product-foreground)", opacity: 0.75 }}>
            {feature}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function EcosystemPage() {
  const planaiTools = PLANAI_TOOL_SLUGS.map((slug) =>
    BOLDMIND_PRODUCTS.find((p) => p.slug === slug),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const villagecircleConcepts = BOLDMIND_PRODUCTS.filter(
    (p) => p.pillar === "conviction" && p.status === "CONCEPT",
  );

  const educenter = BOLDMIND_PRODUCTS.find((p) => p.slug === "educenter");
  const amebogist = BOLDMIND_PRODUCTS.find((p) => p.slug === "amebogist");

  const planaiTint = BOLDMIND_COLOR_SCHEMES["planai"]?.primary ?? "#5B21B6";
  const villagecircleTint =
    BOLDMIND_COLOR_SCHEMES["villagecircle"]?.primary ?? "#3B1F0A";
  const educenterTint =
    BOLDMIND_COLOR_SCHEMES["educenter"]?.primary ?? "#1E40AF";
  const amebogistTint =
    BOLDMIND_COLOR_SCHEMES["amebogist"]?.primary ?? "#065F46";

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Hero */}
        <div className="max-w-2xl mb-14">
          <h1
            className="text-3xl sm:text-4xl font-black mb-4"
            style={{ color: "var(--product-foreground)" }}
          >
            One ecosystem, four pillars
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--product-foreground)", opacity: 0.65 }}
          >
            AmeboGist NG turns strangers into readers. VillageCircle NG turns
            readers into believers — and incubates tomorrow&apos;s products as
            stories before they become code. Boldmind EduCenter turns believers
            into students. PlanAI by BoldmindNG turns students into builders.
            One account moves you through all four.
          </p>
        </div>

        {/* Pillar strip */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <PillarCard
            slug="amebogist"
            label="Awareness"
            domain="amebogist.ng"
            description="Pidgin-English media — Naija gist across tech, sports, politics, and entertainment."
          />
          <PillarCard
            slug="villagecircle"
            label="Conviction"
            domain="villagecircle.ng"
            description="Story-driven philosophy hub and concept incubator — the 5 Rivers doctrine."
          />
          <PillarCard
            slug="educenter"
            label="Education"
            domain="educenter.com.ng"
            description="JAMB/WAEC/NECO prep, AI tutoring, and business & digital skills courses."
          />
          <PillarCard
            slug="planai"
            label="Enablement"
            domain="planai.boldmind.ng"
            description="13 AI-powered business tools — one login, one Nigerian business OS."
          />
        </div>

        {/* PlanAI tools */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-6">
            <h2
              className="text-2xl font-black"
              style={{ color: "var(--product-foreground)" }}
            >
              PlanAI&apos;s 13 tools
            </h2>
            <a
              href="https://planai.boldmind.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold flex items-center gap-1 shrink-0"
              style={{ color: planaiTint }}
            >
              Visit PlanAI <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {planaiTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                icon={tool.icon}
                name={tool.name}
                description={tool.description}
                status={tool.status}
                tint={planaiTint}
              />
            ))}
          </div>
        </section>

        {/* VillageCircle concepts */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-2">
            <h2
              className="text-2xl font-black"
              style={{ color: "var(--product-foreground)" }}
            >
              VillageCircle&apos;s concept incubator
            </h2>
            <a
              href="https://villagecircle.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold flex items-center gap-1 shrink-0"
              style={{ color: villagecircleTint }}
            >
              Visit VillageCircle <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            {villagecircleConcepts.length} ideas told as stories first —
            everything here is pre-build, waiting for its story to earn a build
            slot.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {villagecircleConcepts.map((concept) => (
              <ConceptChip
                key={concept.slug}
                icon={concept.icon}
                name={concept.shortName ?? concept.name}
                status={concept.status}
                tint={villagecircleTint}
              />
            ))}
          </div>
        </section>

        {/* EduCenter + AmeboGist features */}
        <div className="grid lg:grid-cols-2 gap-10">
          {educenter && (
            <section>
              <div className="flex items-baseline justify-between mb-5">
                <h2
                  className="text-xl font-black"
                  style={{ color: "var(--product-foreground)" }}
                >
                  {educenter.shortName ?? educenter.name}
                </h2>
                <a
                  href="https://educenter.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold flex items-center gap-1 shrink-0"
                  style={{ color: educenterTint }}
                >
                  Visit <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <FeatureList
                features={educenter.features.slice(0, 8)}
                tint={educenterTint}
              />
              {educenter.features.length > 8 && (
                <p
                  className="text-xs mt-3"
                  style={{ color: "var(--product-foreground)", opacity: 0.4 }}
                >
                  +{educenter.features.length - 8} more on educenter.com.ng
                </p>
              )}
            </section>
          )}

          {amebogist && (
            <section>
              <div className="flex items-baseline justify-between mb-5">
                <h2
                  className="text-xl font-black"
                  style={{ color: "var(--product-foreground)" }}
                >
                  {amebogist.shortName ?? amebogist.name}
                </h2>
                <a
                  href="https://amebogist.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold flex items-center gap-1 shrink-0"
                  style={{ color: amebogistTint }}
                >
                  Visit <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <FeatureList
                features={amebogist.features.slice(0, 8)}
                tint={amebogistTint}
              />
              {amebogist.features.length > 8 && (
                <p
                  className="text-xs mt-3"
                  style={{ color: "var(--product-foreground)", opacity: 0.4 }}
                >
                  +{amebogist.features.length - 8} more on amebogist.ng
                </p>
              )}
            </section>
          )}
        </div>

        {/* CTA */}
        <div
          className="mt-20 rounded-2xl p-8 sm:p-10 text-center"
          style={{ backgroundColor: "var(--product-primary)" }}
        >
          <h2
            className="text-2xl font-black mb-2"
            style={{ color: "var(--product-on-primary, #FFFFFF)" }}
          >
            One account. Four pillars.
          </h2>
          <p
            className="text-sm mb-6 max-w-md mx-auto"
            style={{
              color: "var(--product-on-primary, #FFFFFF)",
              opacity: 0.85,
            }}
          >
            Sign up once on BoldmindNG and move through the whole ecosystem with
            a single login.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{
              backgroundColor: "var(--product-background)",
              color: "var(--product-primary)",
              minHeight: "44px",
            }}
          >
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
