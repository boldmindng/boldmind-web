'use client';

// apps/boldmind-hub/app/(public)/page.tsx

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  getLiveProducts,
  getBuildingProducts,
  getConceptProducts,
  getPlannedProducts,
  BOLDMIND_COLOR_SCHEMES,
} from '@boldmind-tech/utils';
import { ArrowRight, ExternalLink } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SITE_NAME = process.env['NEXT_PUBLIC_SITE_NAME'] || 'BoldMind Technology Solution Enterprise';

function getProductColor(product: { slug: string }): string {
  return BOLDMIND_COLOR_SCHEMES[product.slug]?.primary ?? 'var(--product-primary)';
}

// ─── Entrepreneur counter ─────────────────────────────────────────────────────

function EntrepreneurCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target    = 1_000_000;
    const duration  = 4_000;
    const increment = target / (duration / 16);
    let current     = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black font-mono tracking-tight"
      style={{ color: 'var(--product-foreground)' }}
    >
      {count.toLocaleString()}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  // Real product data from utils — no hardcoding
  const liveProducts        = getLiveProducts();
  const buildingProducts    = getBuildingProducts();
  const plannedProducts     = getPlannedProducts();
  const conceptProducts     = getConceptProducts();

  const standaloneBuildingProducts = buildingProducts.filter(
    (p) => !p.dependencies?.includes('planai-suite'),
  );
  const planAIBuildingProducts = buildingProducts.filter(
    (p) => p.dependencies?.includes('planai-suite'),
  );
  const planAIPlannedProducts = plannedProducts.filter(
    (p) => p.dependencies?.includes('planai-suite') || p.category === 'ai',
  );
  const otherPlannedProducts = plannedProducts.filter(
    (p) => !p.dependencies?.includes('planai-suite') && p.category !== 'ai',
  );

  const flywheelSteps = [
    {
      title:       'Awareness',
      product:     'AmeboGist.ng',
      description: 'Building mass audience through authentic Nigerian media',
      color:       '#065F46',
      icon:        '📰',
      link:        'https://amebogist.ng',
      isExternal:  true,
    },
    {
      title:       'Education',
      product:     'EduCenter.com.ng',
      description: 'Converting audience through structured knowledge',
      color:       '#1E40AF',
      icon:        '🎓',
      link:        'https://educenter.com.ng',
      isExternal:  true,
    },
    {
      title:       'Enablement',
      product:     'PlanAI Suite',
      description: 'Providing high-leverage AI tools for entrepreneurs',
      color:       '#6B21A8',
      icon:        '🤖',
      link:        'https://planai.boldmind.ng',
      isExternal:  true,
    },
  ];

  const values = [
    { letter: 'B', word: 'Boldness',      description: 'Courage to tackle Nigeria\'s biggest problems'      },
    { letter: 'E', word: 'Excellence',    description: 'Delivering quality and measurable impact'           },
    { letter: 'R', word: 'Relevance',     description: 'Solutions built for the Nigerian context'           },
    { letter: 'A', word: 'Authenticity',  description: 'True to our culture and community voice'            },
    { letter: 'G', word: 'Growth',        description: 'Continuous improvement and empowerment'             },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--product-background)' }}>

      {/* ─── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="BoldMind Hero Background"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          {/* Dark overlay for text readability */}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(43, 77, 135, 0.85) 0%, rgba(0, 0, 0, 0.7) 100%)'
            }}
          />
        </div>

        {/* Animated blobs - optional, can remove if image is rich enough */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse"
            style={{ backgroundColor: 'var(--product-secondary)', opacity: 0.15 }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse"
            style={{ backgroundColor: 'var(--product-accent)', opacity: 0.12 }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full mb-8 border backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: 'var(--product-secondary)' }}
              />
              <span
                className="font-black tracking-widest text-xs sm:text-sm uppercase"
                style={{ color: 'var(--product-secondary)' }}
              >
                EMPOWERING 1M NIGERIAN ENTREPRENEURS BY 2030
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-tight mb-8 text-white">
              Building Systems<br />
              <span style={{ color: 'var(--product-secondary)' }}>That Shift Nations</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed backdrop-blur-sm px-4 py-2 rounded-xl inline-block">
              Welcome to <span className="text-white font-bold">{SITE_NAME}</span>.
              A Nigerian tech ecosystem building impact-driven products that solve fundamental problems.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: 'var(--product-secondary)', color: 'var(--product-foreground)' }}
              >
                Explore Ecosystem
              </button>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base border-2 text-white transition-all hover:bg-white/10 hover:scale-105"
                style={{ borderColor: 'rgba(255,255,255,0.3)' }}
              >
                View Pricing
              </Link>
            </div>

            {/* Live products row */}
            <div className="flex flex-wrap justify-center gap-3">
              {liveProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.links?.website || `/products/${product.slug}`}
                  target={product.links?.website ? '_blank' : undefined}
                  rel={product.links?.website ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border transition-all hover:border-white/30 group backdrop-blur-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  <span className="text-xl">{product.icon}</span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{product.name}</span>
                      <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded font-bold">
                        🚀 LIVE
                      </span>
                    </div>
                    <p className="text-xs text-white/70 group-hover:text-white/90 transition-colors max-w-[160px] truncate">
                      {product.description.substring(0, 60)}…
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── The Flywheel ───────────────────────────────────────────────────── */}
      <section id="ecosystem" className="py-16 sm:py-24" style={{ backgroundColor: 'var(--product-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--product-foreground)' }}>
              The{' '}
              <span style={{ color: 'var(--product-primary)' }}>BoldMind Flywheel</span>
            </h2>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto" style={{ color: 'var(--product-foreground)', opacity: 0.6 }}>
              A value loop where each product strengthens the others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {flywheelSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <div
                  className="relative rounded-3xl border-2 p-8 pt-14 text-center h-full transition-all hover:shadow-xl"
                  style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}
                >
                  <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.icon}
                  </div>

                  <span
                    className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block"
                    style={{ backgroundColor: `${step.color}20`, color: step.color }}
                  >
                    STEP {i + 1}
                  </span>

                  <h3 className="text-xl font-black mb-2" style={{ color: 'var(--product-foreground)' }}>
                    {step.title}
                  </h3>
                  <h4 className="text-base font-bold mb-3" style={{ color: step.color }}>
                    {step.product}
                  </h4>
                  <p className="text-sm mb-4" style={{ color: 'var(--product-foreground)', opacity: 0.6 }}>
                    {step.description}
                  </p>
                  <a
                    href={step.link}
                    target={step.isExternal ? '_blank' : undefined}
                    rel={step.isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all"
                    style={{ color: step.color }}
                  >
                    Learn More <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Products ───────────────────────────────────────────────────────── */}
      <section id="products" className="py-16 sm:py-24" style={{ backgroundColor: 'var(--product-muted)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: 'var(--product-foreground)' }}>
              Our <span style={{ color: 'var(--product-primary)' }}>32+ Product</span> Ecosystem
            </h2>
            <p className="text-lg" style={{ color: 'var(--product-foreground)', opacity: 0.6 }}>
              From media and education to AI-powered business tools
            </p>
          </div>

          {/* Live */}
          <ProductSection label="✅ LIVE PRODUCTS" products={liveProducts} status="live" />

          {/* Building */}
          {standaloneBuildingProducts.length > 0 && (
            <ProductSection
              label="🔨 CURRENTLY BUILDING"
              products={standaloneBuildingProducts}
              status="building"
            />
          )}

          {/* PlanAI Suite */}
          <div
            className="mb-12 rounded-3xl border-2 p-6 sm:p-8"
            style={{ borderColor: 'var(--product-primary)', backgroundColor: `${BOLDMIND_COLOR_SCHEMES['planai-suite']?.primary ?? '#6B21A8'}08` }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: '#6B21A8' }}>🤖</div>
              <div>
                <h3 className="text-2xl font-black" style={{ color: 'var(--product-foreground)' }}>PlanAI Suite</h3>
                <p className="text-sm" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>AI-powered business tools for Nigerian entrepreneurs</p>
              </div>
            </div>

            {planAIBuildingProducts.length > 0 && (
              <div className="mb-6 overflow-x-auto pb-4">
                <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
                  {planAIBuildingProducts.map((p) => (
                    <div
                      key={p.id}
                      className="w-72 flex-shrink-0 rounded-xl border-2 p-4 transition-all hover:shadow-lg"
                      style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: getProductColor(p) }}>
                          {p.icon}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: 'var(--product-foreground)' }}>{p.name}</p>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: '#6B21A820', color: '#6B21A8' }}>
                            🔨 Building
                          </span>
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.6 }}>
                        {p.description.substring(0, 100)}…
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {planAIPlannedProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {planAIPlannedProducts.slice(0, 10).map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col items-center text-center gap-2 p-3 rounded-xl border transition-all hover:shadow-md"
                    style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: getProductColor(p) }}>
                      {p.icon}
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--product-foreground)' }}>{p.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Planned</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Concept products */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--product-foreground)' }}>💡 CONCEPT PRODUCTS</h3>
            <div className="flex flex-wrap gap-2">
              {conceptProducts.slice(0, 12).map((p) => (
                <span
                  key={p.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all hover:shadow-md"
                  style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)', color: 'var(--product-foreground)' }}
                >
                  {p.icon} {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BERAG Values ───────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-24"
        style={{ background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Our Core Values</h2>
            <p className="text-white/60">The principles that guide every product we build</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl sm:text-4xl font-black transition-all hover:scale-110"
                  style={{ backgroundColor: 'var(--product-secondary)', color: 'var(--product-foreground)' }}
                >
                  {v.letter}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.word}</h3>
                <p className="text-sm text-white/60">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Entrepreneur Counter CTA ───────────────────────────────────────── */}
      <section
        className="py-12 sm:py-20"
        style={{ backgroundColor: 'var(--product-secondary)', color: 'var(--product-foreground)' }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6">
            Empowering Nigerian Entrepreneurs
          </h2>
          <div className="mb-4">
            <EntrepreneurCounter />
          </div>
          <p className="text-lg font-bold mb-8 opacity-70">Nigerian Entrepreneurs by 2030</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/2349138349271"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: 'var(--product-primary)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Join the Movement on WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base border-2 transition-all hover:opacity-80 hover:scale-105"
              style={{ borderColor: 'var(--product-foreground)', color: 'var(--product-foreground)' }}
            >
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── Product section component ────────────────────────────────────────────────

function ProductSection({
  label,
  products,
  status,
}: {
  label: string;
  products: ReturnType<typeof getLiveProducts>;
  status: 'live' | 'building' | 'planned';
}) {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--product-foreground)' }}>
        {label}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const color = getProductColor(product);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
            >
              <a
                href={product.links?.website || `/products/${product.slug}`}
                target={product.links?.website ? '_blank' : undefined}
                rel={product.links?.website ? 'noopener noreferrer' : undefined}
                className="group flex flex-col rounded-2xl border-2 p-6 h-full transition-all hover:shadow-xl"
                style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = color}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = 'var(--product-muted)'}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-all group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: color }}>
                    {product.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-base group-hover:text-[var(--product-primary)] transition-colors" style={{ color: 'var(--product-foreground)' }}>
                      {product.name}
                    </h4>
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: status === 'live' ? '#22c55e20' : '#f59e0b20',
                        color:           status === 'live' ? '#16a34a'   : '#d97706',
                      }}
                    >
                      {status === 'live' ? '🚀 LIVE' : '🔨 BUILDING'}
                    </span>
                  </div>
                </div>
                <p className="text-sm flex-1" style={{ color: 'var(--product-foreground)', opacity: 0.65 }}>
                  {product.description.substring(0, 120)}…
                </p>
                <div className="flex items-center gap-2 mt-4 font-bold text-sm group-hover:gap-3 transition-all" style={{ color }}>
                  {status === 'live' ? 'Launch Product' : 'View Details'}
                  <ArrowRight size={14} />
                  {product.links?.website && <ExternalLink size={12} className="opacity-60" />}
                </div>
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}