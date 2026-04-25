'use client';

// apps/boldmind-hub/app/(public)/about/page.tsx

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users, Target, Heart, Zap, Globe, Rocket,
  Award, TrendingUp, Linkedin, Twitter, ExternalLink,
} from 'lucide-react';
import { BOLDMIND_COLOR_SCHEMES } from '@boldmind-tech/utils';

const values = [
  { icon: Zap,        title: 'Boldness',     description: "Courage to tackle Nigeria's biggest problems with innovation.", color: 'gold' },
  { icon: Award,      title: 'Excellence',   description: 'Premium quality products that create measurable impact.',          color: 'blue' },
  { icon: Heart,      title: 'Relevance',    description: 'Solutions built specifically for the Nigerian context.',            color: 'red'  },
  { icon: Users,      title: 'Authenticity', description: 'True to our culture, building trust through transparency.',        color: 'purple' },
  { icon: TrendingUp, title: 'Growth',       description: 'Continuous improvement and empowering entrepreneur growth.',       color: 'green' },
];

const milestones = [
  { year: '2024', event: 'BoldMind Technology Solution Enterprise Founded',     icon: Rocket },
  { year: '2024', event: 'AmeboGist.ng Launched — Building Mass Audience',      icon: Globe  },
  { year: '2024', event: 'EduCenter.com.ng Goes Live — Education Platform',     icon: Award  },
  { year: '2025', event: 'PlanAI Suite Launch — AI Business Tools',             icon: Zap    },
  { year: '2030', event: 'Goal: 1 Million Entrepreneurs Empowered',             icon: Target },
];

const gradientColors: Record<string, string> = {
  gold:   'from-yellow-500 to-amber-400',
  blue:   'from-blue-600 to-blue-400',
  red:    'from-red-600 to-red-400',
  purple: 'from-purple-600 to-purple-400',
  green:  'from-green-600 to-green-400',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--product-background)' }}>

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-story-bg.jpg"
            alt="About BoldMind Hero Background"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          {/* Dark overlay for text readability */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(43, 77, 135, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)'
            }}
          />
        </div>

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
               style={{ backgroundColor: 'var(--product-secondary)', transform: 'translate(30%, -30%)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center w-full py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--product-secondary)' }} />
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: 'var(--product-secondary)' }} />
              </span>
              <span className="text-sm font-medium text-white/90">Empowering Nigeria's Future</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight text-white">
              About{' '}
              <span style={{ color: 'var(--product-secondary)' }}>BoldMind</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed backdrop-blur-sm px-4 py-2 rounded-xl inline-block">
              We're on a mission to empower <span className="text-white font-bold">1 million</span> Nigerian
              entrepreneurs by 2030 through innovative technology solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24" style={{ backgroundColor: 'var(--product-background)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-black mb-8" style={{ color: 'var(--product-foreground)' }}>
                The <span style={{ color: 'var(--product-primary)' }}>Genesis</span> of BoldMind
              </h2>
              <div className="space-y-6 text-lg leading-relaxed" style={{ color: 'var(--product-foreground)', opacity: 0.8 }}>
                <p>
                  BoldMind Technology Solution Enterprise was born from a simple observation:
                  Nigerian entrepreneurs face systemic barriers that technology can solve.
                </p>
                <p>
                  We recognised that building isolated apps wasn't enough — we needed a{' '}
                  <span className="font-bold" style={{ color: 'var(--product-foreground)', opacity: 1 }}>comprehensive ecosystem</span>.
                  Each product strengthens the others, creating a flywheel that amplifies impact.
                </p>
                <p>
                  From <span className="font-bold" style={{ color: '#065F46' }}>AmeboGist</span> (mass awareness)
                  to <span className="font-bold" style={{ color: '#1E40AF' }}>EduCenter</span> (education)
                  to <span className="font-bold" style={{ color: '#6B21A8' }}>PlanAI</span> (enablement) —
                  we are building complete digital infrastructure for Nigerian entrepreneurial success.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="h-0.5 w-12" style={{ backgroundColor: 'var(--product-secondary)' }} />
                  <p className="text-xl font-black" style={{ color: 'var(--product-foreground)' }}>
                    32+ products. 1 mission. Infinite impact.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div
                className="rounded-3xl p-10 relative overflow-hidden min-h-[500px] flex items-center"
                style={{ background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))' }}
              >
                {/* Background image overlay */}
                <div className="absolute inset-0 opacity-20">
                  <Image
                    src="/about-story-bg.jpg"
                    alt="BoldMind Story Background"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-3xl font-black text-white mb-5">Our Vision</h3>
                  <p className="text-lg text-white/80 mb-10 leading-relaxed">
                    To become Africa's leading technology ecosystem, uniquely positioned to empower
                    entrepreneurs to build resilient, high-impact businesses.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    {[
                      { value: '32+', label: 'Proprietary Products' },
                      { value: '1M',  label: 'Target Impact 2030'  },
                      { value: '3',   label: 'Live Products'        },
                      { value: '₦0',  label: 'Free Tier on Every App' },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="text-4xl font-black mb-1" style={{ color: 'var(--product-secondary)' }}>{s.value}</div>
                        <p className="text-xs uppercase tracking-widest text-white/60 font-bold">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-20" style={{ backgroundColor: 'var(--product-secondary)' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24" style={{ backgroundColor: 'var(--product-muted)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: 'var(--product-foreground)' }}>
              Our Core <span style={{ color: 'var(--product-primary)' }}>Values</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--product-foreground)', opacity: 0.6 }}>
              The foundational principles that guide every decision we make
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-8 border-2 hover:shadow-xl hover:-translate-y-2 transition-all"
                style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientColors[v.color]} flex items-center justify-center mb-6`}>
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3" style={{ color: 'var(--product-foreground)' }}>{v.title}</h3>
                <p style={{ color: 'var(--product-foreground)', opacity: 0.65 }}>{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24" style={{ backgroundColor: 'var(--product-background)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6" style={{ color: 'var(--product-foreground)' }}>
              Our <span style={{ color: 'var(--product-primary)' }}>Journey</span>
            </h2>
          </div>
          <div className="relative space-y-12 max-w-4xl mx-auto">
            <div
              className="absolute left-1/2 top-0 bottom-0 w-0.5 hidden md:block"
              style={{ background: `linear-gradient(to bottom, var(--product-secondary), var(--product-primary))` }}
            />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <div
                    className="rounded-2xl p-6 border-2 transition-all hover:shadow-lg"
                    style={{ backgroundColor: 'var(--product-muted)', borderColor: 'var(--product-muted)' }}
                  >
                    <span
                      className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block"
                      style={{ backgroundColor: `${BOLDMIND_COLOR_SCHEMES['boldmind-hub']?.secondary ?? '#E9A825'}20`, color: BOLDMIND_COLOR_SCHEMES['boldmind-hub']?.secondary ?? '#E9A825' }}
                    >
                      {m.year}
                    </span>
                    <h4 className="font-bold" style={{ color: 'var(--product-foreground)' }}>{m.event}</h4>
                  </div>
                </div>
                <div
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-xl flex-shrink-0 transition-all hover:scale-110"
                  style={{ background: `linear-gradient(135deg, var(--product-secondary), var(--product-primary))` }}
                >
                  <m.icon className="w-7 h-7 text-white" />
                </div>
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* Team */}
<section className="py-24" style={{ backgroundColor: 'var(--product-muted)' }}>
  <div className="max-w-4xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black mb-6" style={{ color: 'var(--product-foreground)' }}>
        The <span style={{ color: 'var(--product-primary)' }}>Visionary</span>
      </h2>
    </div>
    <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
      <div
        className="rounded-3xl overflow-hidden border-2 transition-all hover:shadow-xl"
        style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}
      >
        <div className="grid md:grid-cols-5">
          <div
            className="md:col-span-2 flex items-center justify-center p-0 relative overflow-hidden min-h-[400px]"
            style={{ background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))' }}
          >
            <Image
              src="/founder.jpg"
              alt="Charles Uche Chijuka - Founder & CEO of BoldMind"
              fill
              className="object-cover object-center transition-all hover:scale-110 duration-500"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
            {/* Optional overlay gradient for better text contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="md:col-span-3 p-10 flex flex-col justify-center">
            <span
              className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-block w-fit"
              style={{ backgroundColor: 'var(--product-highlight)', color: 'var(--product-primary)' }}
            >
              FOUNDER & CEO
            </span>
            <h3 className="text-3xl font-black mb-2" style={{ color: 'var(--product-foreground)' }}>
              Charles Uche Chijuka
            </h3>
            <p className="text-base font-bold mb-6 uppercase tracking-widest" style={{ color: 'var(--product-primary)' }}>
              Founder & CEO
            </p>
            <p className="text-lg mb-8 leading-relaxed italic" style={{ color: 'var(--product-foreground)', opacity: 0.75 }}>
              "Visionary entrepreneur building technology solutions for Africa.
              Dedicated to bridging the digital divide and empowering the next generation
              of Nigerian entrepreneurs."
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com/in/charliedotcom"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all hover:opacity-80 hover:scale-105"
                style={{ borderColor: 'var(--product-muted)', color: 'var(--product-foreground)' }}
              >
                <Linkedin size={16} /> LinkedIn
              </a>
              <a
                href="https://twitter.com/charlesuchech"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all hover:opacity-80 hover:scale-105"
                style={{ borderColor: 'var(--product-muted)', color: 'var(--product-foreground)' }}
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

      {/* CTA */}
      <section
        className="py-28 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))' }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Crafting the <span style={{ color: 'var(--product-secondary)' }}>Future</span><br />of African Tech
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
            Join the movement transforming how business is done in Nigeria and across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://wa.me/2349138349271"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: 'var(--product-secondary)', color: 'var(--product-foreground)' }}
            >
              Join WhatsApp Community <ExternalLink size={16} />
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base border-2 text-white transition-all hover:bg-white/10 hover:scale-105"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            >
              See All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}