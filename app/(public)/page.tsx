'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';

// ─── Brand data ───────────────────────────────────────────────────────────────
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://boldmind.ng'),
  title: {
    default: 'BoldMind',
    template: `%s | BoldMind`,
  },
  description: 'Building systems that shift nations',
  applicationName: 'BoldMind',
  keywords: ['Nigeria', 'boldmind', 'BoldMind', 'Nigerian entrepreneur'],
  authors: [{ name: 'Boldmind Technology Solution Enterprise', url: 'https://boldmind.ng' }],
  creator: 'BoldMind Technology',
  publisher: 'BoldMind Technology',
  
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/icons/apple/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/icons/apple/apple-touch-icon-167x167.png', sizes: '167x167' },
      { url: '/icons/apple/apple-touch-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/favicon-96x96.png' },
    ],
  },

  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    url: 'https://boldmind.ng',
    siteName: 'BoldMind',
    title: 'BoldMind',
    description: 'Building systems that shift nations',
    locale: 'en_NG',
    images: [
      {
        url: '/social/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BoldMind',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@boldmindNG',
    creator: '@boldmindindng',
    title: 'BoldMind',
    description: 'Building systems that shift nations',
    images: ['/social/twitter-card.jpg'],
  },

  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2B4D87' },
    { media: '(prefers-color-scheme: dark)',  color: '#2B4D87' },
  ],

  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};
const PILLARS = [
  {
    icon: '📰',
    name: 'AmeboGist',
    tagline: 'Amebo Wey Make Sense!',
    description:
      "Nigeria's #1 Pidgin English platform. AI, Tech, Politics & Entertainment in pure Pidgin. 12K+ readers daily.",
    color: '#065F46',
    accentBg: '#FFFBEB',
    step: 'Awareness',
    journey: 'Stranger → Reader',
    stat: '12,000+',
    statLabel: 'Daily Readers',
    href: 'https://amebogist.ng',
  },
  {
    icon: '🌱',
    name: 'VillageCircle',
    tagline: 'Where Conviction Becomes Code',
    description:
      'A venture studio rooted in African sovereignty. Daily philosophical drops, 12 concepts in motion, Vibe Coders Cohort 1 open.',
    color: '#3B1F0A',
    accentBg: '#FDFAF6',
    step: 'Conviction',
    journey: 'Reader → Believer',
    stat: '12',
    statLabel: 'Concepts in Motion',
    href: 'https://villagecircle.ng',
  },
  {
    icon: '🎓',
    name: 'EduCenter',
    tagline: 'Pass Exams. Build Business. Master AI.',
    description:
      "Nigeria's most complete ed-tech. JAMB/WAEC/NECO prep, Business Mastery, AI Skills Certification. ₦3k/month.",
    color: '#1E40AF',
    accentBg: '#F8FAFC',
    step: 'Education',
    journey: 'Believer → Student',
    stat: '50,000+',
    statLabel: 'Students',
    href: 'https://educenter.com.ng',
  },
  {
    icon: '⚡',
    name: 'PlanAI',
    tagline: 'One Suite. Every Tool Your Business Needs.',
    description:
      'AI Receptionist, Digital Storefronts, Branding Tools, ViralKit, Financial Forecasting & more. 650+ businesses running.',
    color: '#5B21B6',
    accentBg: '#F5F3FF',
    step: 'Enablement',
    journey: 'Student → Builder',
    stat: '650+',
    statLabel: 'Businesses Running',
    href: 'https://planai.boldmind.ng',
  },
] as const;

const STATS = [
  { value: '650+', label: 'Businesses on PlanAI', color: '#5B21B6' },
  { value: '50K+', label: 'EduCenter Students', color: '#1E40AF' },
  { value: '12K+', label: 'AmeboGist Readers', color: '#065F46' },
  { value: '35+', label: 'Live Products', color: '#E9A825' },
];

const DASHBOARD_TOOLS = [
  { label: 'PlanAI', status: 'Active', icon: '⚡', color: '#5B21B6' },
  { label: 'EduCenter', status: '73% done', icon: '🎓', color: '#1E40AF' },
  { label: 'Vibe Coders', status: 'Week 4', icon: '💻', color: '#1D4ED8' },
  { label: 'AmeboGist', status: 'Reading', icon: '📰', color: '#065F46' },
];

const OPERATOR_FEATURES = [
  'PlanAI suite access — one click into all tools',
  'EduCenter learning path progress tracker',
  'Vibe Coders cohort enrollment & weekly modules',
  'BoldMind Wallet — unified balance across tools',
  'Referral hub — earn ₦2,500 per conversion',
  'Private WhatsApp Community (paid members only)',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BoldMindHomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>

      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative py-20 pt-32 pb-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2B4D87 0%, #1A3460 100%)' }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Decorative glows */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: '#E9A825', opacity: 0.07 }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{ backgroundColor: '#5B8ADE', opacity: 0.1 }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] sm:text-xs font-bold tracking-widest uppercase"
              style={{
                borderColor: 'rgba(233,168,37,0.35)',
                backgroundColor: 'rgba(233,168,37,0.1)',
                color: '#E9A825',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9A825] animate-pulse" />
              Nigerian-Built · AI-First · 4 Pillars · Lagos 🇳🇬
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight text-white mb-6">
              Building Systems<br />
              <span style={{ color: '#E9A825' }}>That Shift Nations</span>
            </h1>
            <p className="text-base sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
              One ecosystem. Four pillars. From stranger to builder —
              we take Nigerians the full distance.{' '}
              <span className="text-white font-semibold">
                One BoldMind account unlocks everything.
              </span>
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl sm:text-3xl font-black"
                  style={{ color: stat.color === '#E9A825' ? '#E9A825' : '#FFFFFF' }}
                >
                  {stat.value}
                </div>
                <div className="text-[11px] text-white/55 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* THE FOUR DOORS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            {PILLARS.map((pillar, i) => (
              <motion.a
                key={pillar.name}
                href={pillar.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl p-5 border transition-colors duration-200 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderColor: 'rgba(255,255,255,0.14)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = pillar.color;
                  el.style.backgroundColor = `${pillar.color}22`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.14)';
                  el.style.backgroundColor = 'rgba(255,255,255,0.07)';
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: pillar.color }}
                  >
                    {pillar.icon}
                  </div>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
                    style={{ backgroundColor: `${pillar.color}35`, color: pillar.color }}
                  >
                    {pillar.step}
                  </span>
                </div>

                <h3 className="font-black text-white text-sm mb-0.5">{pillar.name}</h3>
                <p className="text-[11px] text-white/45 mb-3 italic">{pillar.tagline}</p>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black" style={{ color: pillar.color }}>
                    {pillar.stat}
                  </span>
                  <span className="text-[11px] text-white/40 font-medium">{pillar.statLabel}</span>
                </div>

                <div className="flex items-center gap-1 mt-3 text-[11px] font-bold text-white/50 group-hover:text-white/90 transition-colors">
                  Open <ChevronRight size={11} />
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
              style={{ backgroundColor: '#E9A825', color: '#1A202C' }}
            >
              Get One BoldMind Account — Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base border-2 text-white transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.25)' }}
            >
              Sign In to Operator Zone
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FLYWHEEL ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: '#FAFAF9' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-[11px] font-black uppercase tracking-widest mb-3"
              style={{ color: '#E9A825' }}
            >
              How It Works
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-4"
              style={{ color: '#1A202C' }}
            >
              The{' '}
              <span style={{ color: '#2B4D87' }}>BoldMind Flywheel</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#1A202C', opacity: 0.6 }}>
              Every Nigerian starts somewhere. We take them the full distance —
              from first gist to running a funded business.
            </p>
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative text-center"
              >
                {/* Number connector line — desktop */}
                {i < PILLARS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 left-full w-full h-0.5 -translate-y-1/2 z-0"
                    style={{ backgroundColor: '#E7E5E4', width: '100%' }}
                  />
                )}

                <div className="relative z-10">
                  <div className="relative inline-flex mb-4">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: pillar.color }}
                    >
                      {pillar.icon}
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center text-white shadow"
                      style={{ backgroundColor: '#2B4D87' }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  <div
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block"
                    style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}
                  >
                    {pillar.journey}
                  </div>

                  <h3 className="font-black text-lg mb-1" style={{ color: '#1A202C' }}>
                    {pillar.name}
                  </h3>
                  <p className="text-sm italic mb-3" style={{ color: '#2B4D87' }}>
                    {pillar.tagline}
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#1A202C', opacity: 0.62 }}>
                    {pillar.description}
                  </p>

                  <a
                    href={pillar.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold hover:gap-3 transition-all"
                    style={{ color: pillar.color }}
                  >
                    Visit {pillar.name} <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OPERATOR ZONE ──────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: '#F0E6D3' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p
                className="text-[11px] font-black uppercase tracking-widest mb-3"
                style={{ color: '#3B1F0A' }}
              >
                The Operator Zone
              </p>
              <h2 className="text-3xl sm:text-4xl font-black mb-5" style={{ color: '#1A202C' }}>
                One login.<br />
                <span style={{ color: '#2B4D87' }}>Every tool you pay for.</span>
              </h2>
              <p className="text-base sm:text-lg mb-8" style={{ color: '#1A202C', opacity: 0.7 }}>
                Your BoldMind account is the cockpit for everything. PlanAI subscriptions,
                EduCenter progress, Vibe Coders cohort status, and cross-pillar upsells —
                all in one dashboard. No re-logging. No friction.
              </p>

              <ul className="space-y-3 mb-8">
                {OPERATOR_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#1A202C' }}>
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black text-white"
                      style={{ backgroundColor: '#2B4D87' }}
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ backgroundColor: '#2B4D87' }}
                >
                  Create Free Account <ArrowRight size={15} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 transition-all hover:bg-[#2B4D87]/5"
                  style={{ borderColor: '#2B4D87', color: '#2B4D87' }}
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>

            {/* Dashboard preview card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border-2 shadow-xl overflow-hidden"
              style={{ backgroundColor: '#FAFAF9', borderColor: '#E7E5E4' }}
            >
              {/* Dashboard header */}
              <div className="p-5" style={{ backgroundColor: '#2B4D87' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-[#1A202C]"
                    style={{ backgroundColor: '#E9A825' }}
                  >
                    B
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Good morning, Builder 👋</div>
                    <div className="text-xs" style={{ color: '#E9A825' }}>Pro Plan · Active</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {DASHBOARD_TOOLS.map((tool) => (
                    <div
                      key={tool.label}
                      className="rounded-xl p-3"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{tool.icon}</span>
                        <span className="text-white text-xs font-bold">{tool.label}</span>
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: '#E9A825' }}>
                        {tool.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral card */}
              <div className="p-5 space-y-3">
                <div
                  className="rounded-xl p-4 border-l-4"
                  style={{ backgroundColor: '#E9A82512', borderLeftColor: '#E9A825' }}
                >
                  <div
                    className="text-[10px] font-black uppercase tracking-widest mb-1"
                    style={{ color: '#E9A825' }}
                  >
                    💡 Referral Earnings
                  </div>
                  <div className="text-2xl font-black" style={{ color: '#1A202C' }}>₦47,500</div>
                  <div className="text-xs" style={{ color: '#1A202C', opacity: 0.55 }}>
                    19 conversions this month
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 border-l-4"
                  style={{ backgroundColor: '#2B4D8710', borderLeftColor: '#2B4D87' }}
                >
                  <div
                    className="text-[10px] font-black uppercase tracking-widest mb-1"
                    style={{ color: '#2B4D87' }}
                  >
                    ⚡ Cross-sell
                  </div>
                  <div className="text-sm font-bold" style={{ color: '#1A202C' }}>
                    ViralKit Pro — 50% off for 90 days
                  </div>
                  <div className="text-xs" style={{ color: '#1A202C', opacity: 0.55 }}>
                    For EduCenter AI Specialist graduates
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-24"
        style={{ background: 'linear-gradient(135deg, #2B4D87 0%, #1A3460 60%, #0F1F40 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              One account.<br />
              <span style={{ color: '#E9A825' }}>Four doors. Built in Lagos.</span>
            </h2>
            <p className="text-base sm:text-lg text-white/65 max-w-xl mx-auto mb-2">
              AmeboGist · VillageCircle · EduCenter · PlanAI
            </p>
            <p className="text-sm text-white/45 mb-10">
              650+ businesses · 50K+ students · 12K+ readers · 35+ live products
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-xl"
                style={{ backgroundColor: '#E9A825', color: '#1A202C' }}
              >
                Get Started — Free <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/2349138349271"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white border-2 transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.22)' }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Questions? WhatsApp Us
              </a>
            </div>

            <p className="text-xs text-white/35">
              NDPA Compliant · No card required · Paystack Payments · Built in Nigeria
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
