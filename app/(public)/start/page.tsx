'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronDown, ArrowRight, Zap, Globe, GraduationCap, Brain, Users } from 'lucide-react';

const brand = {
  primary:   'var(--product-primary)',
  secondary: 'var(--product-secondary)',
  accent:    'var(--product-accent)',
  bg:        'var(--product-background)',
  fg:        'var(--product-foreground)',
  muted:     'var(--product-muted)',
} as const;

const PILLARS = [
  {
    icon: Globe,
    name: 'AmeboGist NG',
    tagline: 'Nigerian No 1 Pidgin News ',
    href: 'https://amebogist.ng',
    color: '#065F46',
    stat: '12K+',
    statLabel: 'Monthly Readers',
    description: 'Authentic Pidgin news, lifestyle, and entertainment for the everyday Nigerian. Your culture, your voice, your gist.',
    perks: [
      'Daily Nigerian news in Pidgin',
      'Lifestyle & entertainment content',
      'Community discussions',
      'Zero subscription fee',
    ],
  },
  {
    icon: GraduationCap,
    name: 'Boldmind EduCenter',
    tagline: 'Pass Exam, Build Business Master AI',
    href: 'https://educenter.com.ng',
    color: '#1E40AF',
    stat: '10K+',
    statLabel: 'Students Prepared',
    description: 'JAMB, WAEC, and beyond. Structured exam prep, career guides, and skill courses built for Nigerian students.',
    perks: [
      'JAMB & WAEC practice tests',
      'AI-powered study plans',
      'Progress analytics dashboard',
      'Career pathway guidance',
    ],
  },
  {
    icon: Brain,
    name: 'PlanAI by BoldmindNG',
    tagline: 'AI Business Planning Tools',
    href: 'https://planai.boldmind.ng',
    color: '#5B21B6',
    stat: '600+',
    statLabel: 'Plans Generated',
    description: 'From idea to investor-ready business plan in minutes. AI-powered strategy, market analysis, and credibility hubs.',
    perks: [
      'Full business plan generation',
      'Market & competitor analysis',
      'Personal credibility hub',
      'Pitch deck builder',
    ],
  },
  {
    icon: Users,
    name: 'VillageCircle',
    tagline: 'Where Conviction becomes Code',
    href: 'https://villagecircle.ng',
    color: '#3B1F0A',
    stat: '2K+',
    statLabel: 'Active Members',
    description: 'Hyper-local community network connecting Nigerians by neighbourhood, interest, and profession.',
    perks: [
      'Neighbourhood circles',
      'Local business directory',
      'Vibe Coders tech community',
      'Events & announcements',
    ],
  },
];

const ACCOUNT_PERKS = [
  'One login across all BoldMind platforms',
  'Unified notifications & activity feed',
  'Cross-platform profile & credibility score',
  'Early access to every new product launch',
  'Exclusive member pricing on premium plans',
  'Priority WhatsApp support 24 / 7',
];

const FAQS = [
  {
    q: 'Is the BoldMind account free to create?',
    a: 'Yes — creating your BoldMind account is completely free. You get instant access to all free tiers across every platform in the ecosystem.',
  },
  {
    q: 'Do I need separate accounts for each platform?',
    a: 'No. One BoldMind account unlocks AmeboGist, EduCenter, PlanAI, VillageCircle, and every future platform. One profile, one password, one experience.',
  },
  {
    q: 'Which platforms are live right now?',
    a: 'AmeboGist and EduCenter are fully live. PlanAI is in active beta with new features shipping weekly. VillageCircle is in early access — join now to shape the community.',
  },
  {
    q: 'Can I use BoldMind products for my business?',
    a: 'Absolutely. PlanAI is built for entrepreneurs. AmeboGist accepts brand partnerships. VillageCircle has a local business directory. Contact us on WhatsApp for tailored business plans.',
  },
  {
    q: 'Is my data safe across the ecosystem?',
    a: 'Yes. All platforms share one privacy policy and security infrastructure. Your data is never sold to third parties. Read our full Privacy Policy for details.',
  },
];

export default function StartPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen"
      style={{ background: brand.bg, color: brand.fg }}
    >
      {/* ── Hero ── */}
      <section
        className="relative pt-36 pb-28 overflow-hidden text-center"
        style={{ background: brand.primary }}
      >
        {/* subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, ${brand.secondary} 15%, transparent) 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border"
              style={{
                borderColor: `color-mix(in srgb, ${brand.secondary} 40%, transparent)`,
                color: brand.secondary,
                background: `color-mix(in srgb, ${brand.secondary} 10%, transparent)`,
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              4 Platforms · 1 Account · Infinite Possibility
            </div>

            <h1
              className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight"
              style={{ color: brand.fg }}
            >
              Everything Nigeria Needs,
              <br />
              <span style={{ color: brand.secondary }}>Built in One Place</span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ color: `color-mix(in srgb, ${brand.fg} 70%, transparent)` }}
            >
              Media. Education. Business AI. Community. BoldMind is the ecosystem powering the next generation of Nigerian creators, students, and entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:scale-105 active:scale-95"
                style={{
                  background: brand.secondary,
                  color: brand.primary,
                  boxShadow: `0 4px 24px color-mix(in srgb, ${brand.secondary} 35%, transparent)`,
                }}
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base border transition-all hover:scale-105"
                style={{
                  borderColor: `color-mix(in srgb, ${brand.fg} 20%, transparent)`,
                  color: brand.fg,
                }}
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pillar Cards ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: brand.fg }}>
              The Four Pillars
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: `color-mix(in srgb, ${brand.fg} 60%, transparent)` }}>
              Each platform solves a real Nigerian problem. Together they form something greater.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.name}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="rounded-2xl p-8 border flex flex-col gap-6 group hover:shadow-xl transition-all duration-500"
                  style={{
                    background: `color-mix(in srgb, ${brand.muted} 50%, transparent)`,
                    borderColor: `color-mix(in srgb, ${brand.fg} 8%, transparent)`,
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500"
                      style={{ background: pillar.color }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black" style={{ color: pillar.color }}>{pillar.stat}</div>
                      <div className="text-xs uppercase tracking-widest font-bold opacity-50">{pillar.statLabel}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black mb-1" style={{ color: brand.fg }}>{pillar.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: pillar.color }}>{pillar.tagline}</p>
                    <p className="text-sm leading-relaxed" style={{ color: `color-mix(in srgb, ${brand.fg} 65%, transparent)` }}>{pillar.description}</p>
                  </div>

                  <ul className="space-y-2.5">
                    {pillar.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2.5 text-sm" style={{ color: `color-mix(in srgb, ${brand.fg} 75%, transparent)` }}>
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: pillar.color }} />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={pillar.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold mt-auto group/link"
                    style={{ color: pillar.color }}
                  >
                    Visit {pillar.name}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── One Account Perks ── */}
      <section
        className="py-24 px-6"
        style={{ background: `color-mix(in srgb, ${brand.muted} 60%, transparent)` }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
              style={{
                borderColor: `color-mix(in srgb, ${brand.secondary} 40%, transparent)`,
                color: brand.secondary,
                background: `color-mix(in srgb, ${brand.secondary} 10%, transparent)`,
              }}
            >
              One Account
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6" style={{ color: brand.fg }}>
              Your Passport to the<br />
              <span style={{ color: brand.secondary }}>BoldMind Ecosystem</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: `color-mix(in srgb, ${brand.fg} 65%, transparent)` }}>
              Sign up once and move seamlessly across every platform. Your profile, achievements, and settings follow you everywhere.
            </p>
            <ul className="space-y-4">
              {ACCOUNT_PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-sm" style={{ color: `color-mix(in srgb, ${brand.fg} 80%, transparent)` }}>
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: brand.secondary }} />
                  {perk}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 mt-10 px-7 py-3.5 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{
                background: brand.secondary,
                color: brand.primary,
              }}
            >
              Get Your Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right: dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-2xl p-6 border"
            style={{
              background: brand.primary,
              borderColor: `color-mix(in srgb, ${brand.fg} 10%, transparent)`,
            }}
          >
            {/* mock top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1.5">
                {['#ef4444','#f59e0b','#22c55e'].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: `color-mix(in srgb, ${brand.secondary} 15%, transparent)`, color: brand.secondary }}
              >
                BoldMind Dashboard
              </div>
            </div>

            {/* profile row */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl mb-4"
              style={{ background: `color-mix(in srgb, ${brand.fg} 5%, transparent)` }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: brand.secondary, color: brand.primary }}
              >
                BM
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: brand.fg }}>Welcome back 👋</div>
                <div className="text-xs opacity-50" style={{ color: brand.fg }}>Active across 4 platforms</div>
              </div>
            </div>

            {/* platform quick-links */}
            <div className="grid grid-cols-2 gap-3">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.name}
                    className="p-3.5 rounded-xl flex items-center gap-3"
                    style={{ background: `color-mix(in srgb, ${brand.fg} 4%, transparent)` }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: p.color }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold" style={{ color: brand.fg }}>{p.name}</div>
                      <div className="text-xs opacity-40" style={{ color: brand.fg }}>Active</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* bottom bar */}
            <div
              className="mt-4 p-3 rounded-xl flex items-center justify-between"
              style={{ background: `color-mix(in srgb, ${brand.secondary} 8%, transparent)` }}
            >
              <span className="text-xs font-bold" style={{ color: brand.secondary }}>All systems active</span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: brand.fg }}>
              Frequently Asked
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: `color-mix(in srgb, ${brand.fg} 8%, transparent)` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm transition-colors"
                  style={{
                    color: brand.fg,
                    background: openFaq === i
                      ? `color-mix(in srgb, ${brand.muted} 80%, transparent)`
                      : 'transparent',
                  }}
                >
                  {faq.q}
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                    style={{
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: brand.secondary,
                    }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-5 pb-5 text-sm leading-relaxed"
                        style={{ color: `color-mix(in srgb, ${brand.fg} 65%, transparent)` }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="py-32 px-6 text-center relative overflow-hidden"
        style={{ background: brand.primary }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 100%, color-mix(in srgb, ${brand.secondary} 12%, transparent) 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6" style={{ color: brand.fg }}>
              Ready to Join the<br />
              <span style={{ color: brand.secondary }}>BoldMind Movement?</span>
            </h2>
            <p
              className="text-lg mb-10 max-w-xl mx-auto leading-relaxed"
              style={{ color: `color-mix(in srgb, ${brand.fg} 65%, transparent)` }}
            >
              Thousands of Nigerians already use BoldMind platforms every day. One free account is all it takes to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black text-base transition-all hover:scale-105"
                style={{
                  background: brand.secondary,
                  color: brand.primary,
                  boxShadow: `0 8px 32px color-mix(in srgb, ${brand.secondary} 30%, transparent)`,
                }}
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/2349138349271"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-base border transition-all hover:scale-105"
                style={{
                  borderColor: `color-mix(in srgb, ${brand.fg} 20%, transparent)`,
                  color: brand.fg,
                }}
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
