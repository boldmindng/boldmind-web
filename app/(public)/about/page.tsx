"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Target,
  Heart,
  Zap,
  Globe,
  Rocket,
  Award,
  TrendingUp,
  Linkedin,
  Twitter,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Facebook,
} from "lucide-react";

// ── Brand tokens (set by [data-product=boldmind-hub] in globals.css) ──────
const brand = {
  primary: "var(--product-primary)",
  secondary: "var(--product-secondary)",
  bg: "var(--product-background)",
  fg: "var(--product-foreground)",
  muted: "var(--product-muted)",
  highlight: "var(--product-highlight)",
} as const;

const VALUES = [
  {
    icon: GraduationCap,
    title: "Education First",
    description:
      "Every product we build is rooted in enabling people to learn, grow, and lead.",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Boldness",
    description:
      "We tackle Nigeria's biggest problems head-on — with courage, creativity, and conviction.",
    color: "gold",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Premium quality products that create measurable, lasting impact for every user.",
    color: "purple",
  },
  {
    icon: Heart,
    title: "Relevance",
    description:
      "Solutions designed specifically for the Nigerian context — language, culture, and economy.",
    color: "red",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "BoldMind is built with its community, not just for them. Every pillar amplifies the next.",
    color: "green",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description:
      "We believe every Nigerian deserves access to the tools, knowledge, and networks to grow.",
    color: "teal",
  },
] as const;

// The real chronological journey — EduCenter first, then media, then enablement, then ecosystem
const MILESTONES = [
  {
    year: "2024",
    event: "Boldmind Educational Center — The Founding Vision",
    detail:
      "BoldmindNG starts as an education venture. Armed with a background in Economics, Education, and Educational Administration, the founder builds Nigeria's most complete ed-tech: JAMB/WAEC/NECO prep, Business Mastery, and AI Skills Certification.",
    icon: GraduationCap,
    pillarColor: "#1E40AF",
  },
  {
    year: "2024",
    event: "AmeboGist NG Entering the Media Space",
    detail:
      "After EduCenter, the team explores mass reach through media. AmeboGist launches as Nigeria's #1 Pidgin English platform — AI, Tech, Politics & Entertainment in pure Pidgin, reaching 12K+ daily readers and proving that awareness at scale was possible.",
    icon: Globe,
    pillarColor: "#065F46",
  },
  {
    year: "2025",
    event: "PlanAI by BoldmindNG — AmeboGist Opens a Door",
    detail:
      "The media audience from AmeboGist revealed a clear need: Nigerian businesses needed AI-powered tools to compete. PlanAI Suite launches — AI Receptionist, Digital Storefronts, ViralKit, Financial Forecasting. 650+ businesses now running on it.",
    icon: Zap,
    pillarColor: "#5B21B6",
  },
  {
    year: "2025",
    event: "VillageCircle NG — The Ecosystem Glue",
    detail:
      "With three pillars live, VillageCircle emerges to bind them together: a venture studio rooted in African sovereignty, hosting philosophical drops, 12 concepts in motion, and the Vibe Coders Cohort. It turns the ecosystem into a movement.",
    icon: Users,
    pillarColor: "#3B1F0A",
  },
  {
    year: "2030",
    event: "Goal — 1 Million Entrepreneurs Empowered",
    detail:
      "One BoldMind account. Four pillars. A complete path from stranger to builder — for every Nigerian.",
    icon: Target,
    pillarColor: "#E9A825",
  },
] as const;

const gradientColors: Record<string, string> = {
  gold: "from-yellow-500 to-amber-400",
  blue: "from-blue-600 to-blue-400",
  red: "from-red-600 to-red-400",
  purple: "from-purple-600 to-purple-400",
  green: "from-green-600 to-green-400",
  teal: "from-teal-600 to-teal-400",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.bg }}>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-story-bg.jpg"
            alt="About BoldMind"
            fill
            priority
            className="object-cover"
            quality={90}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(43,77,135,0.92) 0%, rgba(0,0,0,0.82) 100%)",
            }}
          />
        </div>
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none z-0"
          style={{
            backgroundColor: brand.secondary,
            transform: "translate(30%,-30%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center w-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: brand.secondary }}
                />
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ backgroundColor: brand.secondary }}
                />
              </span>
              <span className="text-sm font-medium text-white/90">
                Built in Lagos · Shifting Nations
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight text-white">
              About <span style={{ color: brand.secondary }}>BoldMind</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              From a classroom in Nigeria to a four-pillar AI ecosystem — this
              is the story of one conviction that became{" "}
              <span className="text-white font-bold">a movement</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── ORIGIN STORY ─────────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: brand.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p
                className="text-[11px] font-black uppercase tracking-widest mb-4"
                style={{ color: brand.secondary }}
              >
                The Genesis
              </p>
              <h2
                className="text-4xl md:text-5xl font-black mb-8"
                style={{ color: brand.fg }}
              >
                It started in
                <br />
                <span style={{ color: brand.primary }}>a classroom.</span>
              </h2>
              <div
                className="space-y-5 text-lg leading-relaxed"
                style={{ color: brand.fg, opacity: 0.8 }}
              >
                <p>
                  BoldmindNG&apos;s founder,{" "}
                  <span
                    className="font-bold"
                    style={{ color: brand.fg, opacity: 1 }}
                  >
                    Charles Uche Chijuka
                  </span>
                  , holds a B.Sc ED in Economics Education, and an M.Ed in
                  Educational Administration & Planning. Education wasn&apos;t
                  just his degree — it was his lens for everything.
                </p>
                <p>
                  The first venture was{" "}
                  <span className="font-bold" style={{ color: "#1E40AF" }}>
                    EduCenter
                  </span>{" "}
                  — Nigeria&apos;s most complete ed-tech platform, combining
                  JAMB/WAEC/NECO prep, Business Mastery, and AI Skills
                  Certification. It proved that Nigerians were hungry for
                  quality, affordable learning.
                </p>
                <p>
                  That hunger led to{" "}
                  <span className="font-bold" style={{ color: "#065F46" }}>
                    AmeboGist
                  </span>{" "}
                  — exploring how mass media in Pidgin English could reach
                  Nigerians where they actually live online. 12,000+ daily
                  readers later, it opened an unexpected door.
                </p>
                <p>
                  That door was{" "}
                  <span className="font-bold" style={{ color: "#5B21B6" }}>
                    PlanAI
                  </span>
                  : the AmeboGist audience had businesses to run and no AI tools
                  built for them. The suite now powers 650+ businesses. Then
                  came{" "}
                  <span className="font-bold" style={{ color: "#3B1F0A" }}>
                    VillageCircle
                  </span>{" "}
                  — to bind all four pillars into a single, sovereign African
                  ecosystem.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div
                    className="h-0.5 w-12 flex-shrink-0"
                    style={{ backgroundColor: brand.secondary }}
                  />
                  <p
                    className="text-xl font-black"
                    style={{ color: brand.fg, opacity: 1 }}
                  >
                    One educator. Four pillars. Infinite impact.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div
                className="rounded-3xl p-10 relative overflow-hidden min-h-[500px] flex items-center"
                style={{
                  background: `linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))`,
                }}
              >
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src="/about-story-bg.jpg"
                    alt="BoldmindNG Story"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10 w-full">
                  <div className="text-6xl mb-6">🎓</div>
                  <h3 className="text-3xl font-black text-white mb-5">
                    The Founder\&apos;s Credentials
                  </h3>
                  <div className="space-y-3 mb-8">
                    {[
                      { degree: "B.Sc ED Economics Education", icon: "📊" },
                      {
                        degree: "M.Ed Educational Administration & Planning",
                        icon: "🎓",
                      },
                    ].map((d) => (
                      <div
                        key={d.degree}
                        className="flex items-center gap-3 text-white/85"
                      >
                        <span className="text-lg">{d.icon}</span>
                        <span className="font-medium">{d.degree}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: "4", label: "Ecosystem Pillars" },
                      { value: "1M", label: "Target Impact 2030" },
                      { value: "650+", label: "Businesses on PlanAI" },
                      { value: "50K+", label: "EduCenter Students" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div
                          className="text-3xl font-black mb-1"
                          style={{ color: brand.secondary }}
                        >
                          {s.value}
                        </div>
                        <p className="text-xs uppercase tracking-widest text-white/60 font-bold">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-20"
                  style={{ backgroundColor: brand.secondary }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── JOURNEY TIMELINE ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: brand.muted }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p
              className="text-[11px] font-black uppercase tracking-widest mb-3"
              style={{ color: brand.secondary }}
            >
              How It Unfolded
            </p>
            <h2 className="text-4xl font-black" style={{ color: brand.fg }}>
              The <span style={{ color: brand.primary }}>BoldMind Journey</span>
            </h2>
          </div>

          <div className="relative space-y-0">
            {/* Vertical line */}
            <div
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{
                background: `linear-gradient(to bottom, var(--product-secondary), var(--product-primary))`,
              }}
            />

            {MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative flex gap-8 pb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ backgroundColor: m.pillarColor }}
                >
                  <m.icon className="w-5 h-5 text-white" />
                </div>

                {/* Card — alternates left/right on desktop */}
                <div
                  className={`md:w-[45%] ml-16 md:ml-0 ${i % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
                >
                  <div
                    className="rounded-2xl p-6 border-2"
                    style={{
                      backgroundColor: brand.bg,
                      borderColor: brand.muted,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${m.pillarColor}20`,
                          color: m.pillarColor,
                        }}
                      >
                        {m.year}
                      </span>
                    </div>
                    <h4
                      className="font-black text-base mb-2"
                      style={{ color: brand.fg }}
                    >
                      {m.event}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: brand.fg, opacity: 0.65 }}
                    >
                      {m.detail}
                    </p>
                  </div>
                </div>

                {/* Empty half for alternating layout */}
                <div className="hidden md:block md:w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALUES ───────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: brand.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p
              className="text-[11px] font-black uppercase tracking-widest mb-3"
              style={{ color: brand.secondary }}
            >
              What Drives Us
            </p>
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{ color: brand.fg }}
            >
              Our Core <span style={{ color: brand.primary }}>Values</span>
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: brand.fg, opacity: 0.6 }}
            >
              The principles that guide every product, every decision, every
              hire.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-8 border-2 hover:shadow-xl hover:-translate-y-2 transition-all"
                style={{ backgroundColor: brand.bg, borderColor: brand.muted }}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientColors[v.color]} flex items-center justify-center mb-6`}
                >
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3
                  className="text-xl font-black mb-3"
                  style={{ color: brand.fg }}
                >
                  {v.title}
                </h3>
                <p style={{ color: brand.fg, opacity: 0.65 }}>
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOUNDER ──────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: brand.muted }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p
              className="text-[11px] font-black uppercase tracking-widest mb-3"
              style={{ color: brand.secondary }}
            >
              The Person Behind It
            </p>
            <h2 className="text-4xl font-black" style={{ color: brand.fg }}>
              The <span style={{ color: brand.primary }}>Visionary</span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div
              className="rounded-3xl overflow-hidden border-2 transition-all hover:shadow-xl"
              style={{ backgroundColor: brand.bg, borderColor: brand.muted }}
            >
              <div className="grid md:grid-cols-5">
                <div
                  className="md:col-span-2 flex items-center justify-center relative overflow-hidden min-h-[400px]"
                  style={{
                    background: `linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))`,
                  }}
                >
                  <Image
                    src="/founder.jpg"
                    alt="Charles Uche Chijuka — Founder & CEO of BoldMind"
                    fill
                    className="object-cover object-center transition-all hover:scale-110 duration-500"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="md:col-span-3 p-10 flex flex-col justify-center">
                  <span
                    className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-block w-fit"
                    style={{
                      backgroundColor: brand.highlight,
                      color: brand.primary,
                    }}
                  >
                    Founder & CEO
                  </span>
                  <h3
                    className="text-3xl font-black mb-1"
                    style={{ color: brand.fg }}
                  >
                    Charles Uche Chijuka
                  </h3>
                  <p
                    className="text-sm font-bold mb-2 uppercase tracking-widest"
                    style={{ color: brand.primary }}
                  >
                    Economist · Educator · Builder
                  </p>
                  <p
                    className="text-xs mb-6"
                    style={{ color: brand.fg, opacity: 0.5 }}
                  >
                    B.Sc & M.Sc Economics · B.Ed Education · M.Ed Educational
                    Administration & Planning
                  </p>
                  <p
                    className="text-lg mb-6 leading-relaxed italic"
                    style={{ color: brand.fg, opacity: 0.75 }}
                  >
                    &quot;I didn&apos;t set out to build a tech company. I set out to fix
                    education in Nigeria. EduCenter was the seed. AmeboGist was
                    the megaphone. PlanAI was the enabler. VillageCircle was the
                    realisation — that what we were really building was an
                    ecosystem that could shift a nation.&quot;
                  </p>
                  <div className="flex gap-3">
                    <a href="https://facebook.com/charleschiukau"
                     target="_blank"
                       rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all hover:opacity-80 hover:scale-105"
                      style={{ borderColor: brand.muted, color: brand.fg }}
                      >
                        <Facebook size={16}/> Facebook
                      </a>

                    <a
                      href="https://linkedin.com/in/charlesuchijuka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all hover:opacity-80 hover:scale-105"
                      style={{ borderColor: brand.muted, color: brand.fg }}
                    >
                      <Linkedin size={16} /> LinkedIn
                    </a>
                    <a
                      href="https://x.com/charlesuchijuka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all hover:opacity-80 hover:scale-105"
                      style={{ borderColor: brand.muted, color: brand.fg }}
                    >
                      <Twitter size={16} /> Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="py-28 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))",
        }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: brand.secondary }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Be part of the
            <br />
            <span style={{ color: brand.secondary }}>next chapter.</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
            One BoldMind account unlocks four pillars built for you — the
            Nigerian builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://wa.me/2349138349271"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: brand.secondary, color: brand.fg }}
            >
              Join WhatsApp Community <ExternalLink size={16} />
            </a>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base border-2 text-white transition-all hover:bg-white/10 hover:scale-105"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Get Your Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
