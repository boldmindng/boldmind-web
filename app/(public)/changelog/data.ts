// Mock changelog data for the public /changelog route.
// Per boldmind-web-architecture-plan.md §4.1 / §6, this should eventually be
// sourced from packages/api-docs/src/changelog.ts (GET /hub/changelog), which
// is confirmed not to exist yet. This file is the drop-in shape to swap for
// that fetch later — components consume ChangelogEntry, not this array
// directly, so wiring the real API later is a one-file change.

export type ChangelogType = "feature" | "improvement" | "fix";

export type ChangelogProduct =
  | "boldmind-hub"
  | "planai"
  | "educenter"
  | "amebogist"
  | "villagecircle";

export interface ChangelogEntry {
  version: string;
  slug: string; // URL-safe version, used as the [version] param
  date: string; // ISO date
  product: ChangelogProduct;
  type: ChangelogType;
  title: string;
  summary: string;
  items: string[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "2.1.1",
    slug: "2-1-1",
    date: "2026-06-28",
    product: "boldmind-hub",
    type: "fix",
    title: "SSO relay reliability fixes",
    summary:
      "Fixed a race condition where the cross-domain relay token could expire before the destination app finished the handshake, occasionally forcing a second login.",
    items: [
      "Relay token TTL extended from 30s to 90s",
      "Google OAuth callback now forwards Set-Cookie correctly on external redirects",
      "Fixed builder dashboard flashing the wrong ecosystemRole on first paint",
    ],
  },
  {
    version: "2.2.2",
    slug: "2-2-2",
    date: "2026-06-20",
    product: "planai",
    type: "feature",
    title: "Ads Center enters open beta",
    summary:
      "Meta and Google ad campaign management is now available to all PlanAI Pro subscribers, with AI-generated creatives and Naira billing via Paystack.",
    items: [
      "Meta (Facebook + Instagram) campaign creation and management",
      "AI-generated ad creatives (image + copy + video script)",
      "Naira billing — pay for ads in ₦ via Paystack, FX handled automatically",
      "Ad compliance checker flags policy-violating content before launch",
    ],
  },
  {
    version: "1.0.1",
    slug: "1-0-1",
    date: "2026-06-12",
    product: "boldmind-hub",
    type: "improvement",
    title: "Faster cross-product analytics rollup",
    summary:
      "The dashboard's revenue-by-pillar chart now loads from a cached rollup instead of querying every product's ledger live, cutting first paint time significantly on the Overview page.",
    items: [
      "FlywheelMetrics now reads from a 5-minute cached rollup",
      "Referral hub pagination increased from 10 to 25 rows per page",
      "Notification bell now debounces rapid successive events into one toast",
    ],
  },
  {
    version: "2.1.1",
    slug: "amebogist-2-1-1",
    date: "2026-06-05",
    product: "amebogist",
    type: "feature",
    title: "Pidgin audio articles",
    summary:
      "Every AmeboGist article now ships with a text-to-speech Pidgin audio version, playable inline or via the new AmeboGist NG Radio livestream during major events.",
    items: [
      "Pidgin accent text-to-speech for all new articles",
      "Creator tipping via Paystack on article pages",
      "Breaking news push notifications via Web Push API",
    ],
  },
  {
    version: "1.1.1",
    slug: "villagecircle-1-1-1",
    date: "2026-05-30",
    product: "villagecircle",
    type: "feature",
    title: "Vibe Coders Cohort 1 opens",
    summary:
      "The first Vibe Coders cohort application window is live, alongside the psychology-informed two-step application flow and the new admin cohort dashboard.",
    items: [
      "Two-step application flow with scholarship slot support",
      "Admin dashboard for managing applicants, cohorts, and payments",
      "WhatsApp community auto-invite on enrollment",
    ],
  },
  {
    version: "2.1.1",
    slug: "educenter-2-1-1",
    date: "2026-05-18",
    product: "educenter",
    type: "improvement",
    title: "Adaptive difficulty for JAMB CBT practice",
    summary:
      "The CBT simulator now adjusts question difficulty in real time based on a student's running accuracy, instead of a fixed random pull from the question bank.",
    items: [
      "Adaptive difficulty engine for JAMB/WAEC/NECO practice",
      "Subject-specific AI tutor now uses Socratic-style prompts",
      "Offline question packs — download 500 questions for low-internet areas",
    ],
  },
];

export function getChangelogEntry(slug: string): ChangelogEntry | undefined {
  return CHANGELOG_ENTRIES.find((e) => e.slug === slug);
}

export function getAllChangelogSlugs(): string[] {
  return CHANGELOG_ENTRIES.map((e) => e.slug);
}
