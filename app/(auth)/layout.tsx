'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@boldmind-tech/auth';
import { motion } from 'framer-motion';

const brand = {
  primary:   'var(--product-primary)',
  secondary: 'var(--product-secondary)',
  bg:        'var(--product-background)',
  fg:        'var(--product-foreground)',
  muted:     'var(--product-muted)',
} as const;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return_url');

  useEffect(() => {
    if (!isLoading && user) {
      const destination = returnUrl ?? '/dashboard';
      if (returnUrl && !isSafeBoldMindUrl(returnUrl)) {
        router.replace('/dashboard');
      } else {
        router.replace(destination);
      }
    }
  }, [user, isLoading, router, returnUrl]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: brand.bg }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{
            borderColor: `color-mix(in srgb, ${brand.fg} 10%, transparent)`,
            borderTopColor: brand.secondary,
          }}
        />
      </div>
    );
  }

  if (user) return null;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: brand.bg, color: brand.fg }}
    >
      {/* ── LEFT PANEL — branding (desktop only) ── */}
      <div
        className="hidden lg:flex lg:flex-col lg:w-[480px] lg:flex-shrink-0 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brand.primary} 0%, color-mix(in srgb, ${brand.primary} 80%, #1a2a5e) 60%, color-mix(in srgb, ${brand.primary} 90%, black) 100%)`,
        }}
      >
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[100px]"
            style={{ background: `color-mix(in srgb, ${brand.secondary} 8%, transparent)` }}
          />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] bg-blue-500/8" />
        </div>

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-16 no-underline group">
            <div className="relative w-10 h-10">
              <Image src="/logo.webp" alt="BoldMind" fill className="object-contain" />
            </div>
            <span
              className="font-black text-xl tracking-tight transition-colors"
              style={{ color: brand.fg }}
            >
              BoldMind
            </span>
          </Link>

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black leading-tight mb-6"
              style={{ color: brand.fg }}
            >
              One account.
              <br />
              <span style={{ color: brand.secondary }}>32+ products.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base leading-relaxed mb-10"
              style={{ color: `color-mix(in srgb, ${brand.fg} 60%, transparent)` }}
            >
              Sign in once, access every BoldMind product — AmeboGist, EduCenter,
              PlanAI Suite, BoldMind OS and more.
            </motion.p>

            {/* Ecosystem product pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {ECOSYSTEM_PRODUCTS.map((p) => (
                <span
                  key={p.slug}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: `color-mix(in srgb, ${brand.fg} 6%, transparent)`,
                    color: `color-mix(in srgb, ${brand.fg} 75%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${brand.fg} 12%, transparent)`,
                  }}
                >
                  <span>{p.icon}</span>
                  {p.name}
                </span>
              ))}
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex items-center gap-8"
            >
              {[
                { value: '10,000+', label: 'Entrepreneurs' },
                { value: '32+',     label: 'Products'      },
                { value: '100%',    label: 'Nigerian-built' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-xl font-black" style={{ color: brand.secondary }}>{stat.value}</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: `color-mix(in srgb, ${brand.fg} 40%, transparent)` }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <p
            className="text-xs"
            style={{ color: `color-mix(in srgb, ${brand.fg} 25%, transparent)` }}
          >
            © {new Date().getFullYear()} BoldMind Technology Solution Enterprise
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — auth form ── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile logo bar */}
        <div
          className="lg:hidden flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid color-mix(in srgb, ${brand.fg} 5%, transparent)` }}
        >
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="relative w-8 h-8">
              <Image src="/logo.webp" alt="BoldMind" fill className="object-contain" />
            </div>
            <span className="font-black text-base" style={{ color: brand.fg }}>BoldMind</span>
          </Link>
          {returnUrl && (
            <span
              className="text-xs"
              style={{ color: `color-mix(in srgb, ${brand.fg} 30%, transparent)` }}
            >
              ↳ {getAppNameFromUrl(returnUrl)}
            </span>
          )}
        </div>

        {/* Centred form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[420px]">

            {/* Return-URL context banner */}
            {returnUrl && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{
                  background: `color-mix(in srgb, ${brand.secondary} 6%, transparent)`,
                  borderColor: `color-mix(in srgb, ${brand.secondary} 20%, transparent)`,
                }}
              >
                <span className="text-lg">🔐</span>
                <p
                  className="text-sm"
                  style={{ color: `color-mix(in srgb, ${brand.fg} 60%, transparent)` }}
                >
                  Sign in to continue to{' '}
                  <span className="font-semibold" style={{ color: brand.secondary }}>
                    {getAppNameFromUrl(returnUrl)}
                  </span>
                </p>
              </motion.div>
            )}

            {/* Auth form card */}
            <div
              className="rounded-2xl p-8 backdrop-blur-sm"
              style={{
                background: `color-mix(in srgb, ${brand.fg} 3%, transparent)`,
                border: `1px solid color-mix(in srgb, ${brand.fg} 8%, transparent)`,
              }}
            >
              {children}
            </div>

            {/* Terms footer */}
            <p
              className="text-center text-xs mt-5"
              style={{ color: `color-mix(in srgb, ${brand.fg} 20%, transparent)` }}
            >
              By continuing, you agree to our{' '}
              <Link
                href="/terms"
                className="transition-colors hover:underline"
                style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}
              >
                Terms
              </Link>
              {' & '}
              <Link
                href="/privacy"
                className="transition-colors hover:underline"
                style={{ color: `color-mix(in srgb, ${brand.fg} 35%, transparent)` }}
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BOLDMIND_DOMAINS = [
  'boldmind.ng',
  'amebogist.ng',
  'educenter.com.ng',
  'localhost',
  '127.0.0.1',
];

function isSafeBoldMindUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return BOLDMIND_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`),
    );
  } catch {
    return false;
  }
}

function getAppNameFromUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    if (hostname.includes('amebogist'))  return 'AmeboGist';
    if (hostname.includes('educenter'))  return 'EduCenter';
    if (hostname.includes('planai'))     return 'PlanAI Suite';
    if (hostname.includes('fit.'))       return 'NaijaFit';
    if (hostname.includes('os.'))        return 'BoldMind OS';
    if (hostname.includes('studio'))     return 'Amebo Studio';
    if (hostname.includes('tools'))      return 'BoldMind Tools';
    if (hostname.includes('skills'))     return 'SkillGig';
    return 'BoldMind';
  } catch {
    return 'BoldMind';
  }
}

const ECOSYSTEM_PRODUCTS = [
  { slug: 'amebogist',  name: 'AmeboGist',    icon: '📰' },
  { slug: 'educenter',  name: 'EduCenter',    icon: '🎓' },
  { slug: 'planai',     name: 'PlanAI',       icon: '🧠' },
  { slug: 'fit',        name: 'NaijaFit',     icon: '💪' },
  { slug: 'os',         name: 'BoldMind OS',  icon: '🖥️' },
  { slug: 'studio',     name: 'Studio',       icon: '✍️' },
  { slug: 'skillgig',   name: 'SkillGig',     icon: '🎭' },
];
