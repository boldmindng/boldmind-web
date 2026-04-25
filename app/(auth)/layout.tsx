'use client';



import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@boldmind-tech/auth';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return_url');

  // Already logged in → redirect away from auth pages
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

  // Loading spinner — matches the dark bg so there's no flash
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080C14]">
        <div className="w-8 h-8 rounded-full border-2 border-t-amber-400 border-white/10 animate-spin" />
      </div>
    );
  }

  // Already logged in — don't render the form while redirect fires
  if (user) return null;

  return (
    <div className="min-h-screen flex bg-[#080C14] text-white">

      {/* ────────────────────────────────────────────────────────────────────
          LEFT PANEL — branding (desktop only, hidden on mobile)
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:flex-col lg:w-[480px] lg:flex-shrink-0 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #00143C 0%, #001A4A 60%, #00102E 100%)',
        }}
      >
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-[80px]" />
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
            <span className="text-white font-black text-xl tracking-tight group-hover:text-amber-400 transition-colors">
              BoldMind
            </span>
          </Link>

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black text-white leading-tight mb-6"
            >
              One account.
              <br />
              <span className="text-amber-400">32+ products.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base text-white/60 leading-relaxed mb-10"
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
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(255,255,255,0.12)',
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
                  <p className="text-xl font-black text-amber-400">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} BoldMind Technology Solution Enterprise
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          RIGHT PANEL — auth form
      ──────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile logo bar — only visible on < lg */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="relative w-8 h-8">
              <Image src="/logo.webp" alt="BoldMind" fill className="object-contain" />
            </div>
            <span className="font-black text-base text-white">BoldMind</span>
          </Link>
          {returnUrl && (
            <span className="text-xs text-white/30">
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
                  backgroundColor: 'rgba(251,191,36,0.06)',
                  borderColor: 'rgba(251,191,36,0.2)',
                }}
              >
                <span className="text-amber-400 text-lg">🔐</span>
                <p className="text-sm text-white/60">
                  Sign in to continue to{' '}
                  <span className="text-amber-400 font-semibold">{getAppNameFromUrl(returnUrl)}</span>
                </p>
              </motion.div>
            )}

            {/* The auth form (login / register / etc.) */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-8 backdrop-blur-sm">
              {children}
            </div>

            {/* Terms footer */}
            <p className="text-center text-white/20 text-xs mt-5">
              By continuing, you agree to our{' '}
              <Link href="/terms"   className="text-white/35 hover:text-white/55 transition-colors">Terms</Link>
              {' & '}
              <Link href="/privacy" className="text-white/35 hover:text-white/55 transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Only BoldMind-owned domains are allowed as return_url to prevent open redirect. */
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