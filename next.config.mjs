/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Standalone output (for Docker / Vercel edge) ──────────────────────────
  output: 'standalone',

  // ─── Transpile GitHub packages ─────────────────────────────────────────────
  // These are installed from GitHub and shipped as TypeScript/ESM source,
  // so Next.js must transpile them rather than treating them as pre-built CJS.
  transpilePackages: [
    '@boldmindng/ui',
    '@boldmindng/auth',
    '@boldmindng/utils',
    '@boldmindng/api-client',
    '@boldmindng/analytics',
  ],

  // ─── Image domains ──────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.boldmind.ng'              },
      { protocol: 'https', hostname: '**.amebogist.ng'             },
      { protocol: 'https', hostname: '**.educenter.com.ng'         },
      { protocol: 'https', hostname: '**.villagecircle.ng'         },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com'   },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com'},
    ],
  },

  // ─── Security headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',  value: 'on'                                   },
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN'                           },
          { key: 'X-Content-Type-Options',   value: 'nosniff'                              },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin'      },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // API routes — allow credentialed cross-origin calls from ecosystem domains
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            // In production Cloudflare/nginx handles CORS — this is a safety net
            value: process.env.NODE_ENV === 'production'
              ? 'https://boldmind.ng'
              : '*',
          },
          { key: 'Access-Control-Allow-Credentials', value: 'true'                              },
          { key: 'Access-Control-Allow-Methods',      value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers',      value: 'Content-Type,Authorization'       },
        ],
      },
    ];
  },

  // ─── Redirects ──────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Legacy /start → /register (old CTAs point here)
      {
        source:      '/start',
        destination: '/register',
        permanent:   false,
      },
    ];
  },

  // ─── Dev rewrites — proxy to standalone NestJS API ──────────────────────────
  // Production: Cloudflare or nginx should handle this, not Next.js
  async rewrites() {
    if (process.env.NODE_ENV === 'production') return [];
    const apiBase = process.env.API_INTERNAL_URL ?? 'http://localhost:4001';
    return [
      {
        source:      '/api/v1/:path*',
        destination: `${apiBase}/api/v1/:path*`,
      },
    ];
  },

  // ─── Compiler ───────────────────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // // ─── Experimental (Next.js 16) ──────────────────────────────────────────────
  // experimental: {
  //   optimizePackageImports: [
  //   'lucide-react',
  //   'date-fns',
  //   'framer-motion',
  // ],
  //   // Partial Pre-rendering — opt-in per page with `export const experimental_ppr = true`
  //   ppr: 'incremental',
  //   // Optimise server component hydration
  //   optimizeServerReact: true,
  //   // Turbopack is default in Next.js 16 dev mode; no extra config needed

    
  // },

  // ─── Strict mode ────────────────────────────────────────────────────────────
  reactStrictMode: true,

  // ─── TypeScript & ESLint — fail hard on errors ──────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },
  // eslint: {
  //   ignoreDuringBuilds: false,
  // },
};

export default nextConfig;
