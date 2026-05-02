/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@boldmind-tech/ui',
    '@boldmind-tech/auth',
    '@boldmind-tech/utils',
    '@boldmind-tech/api-client',
    '@boldmind-tech/analytics',
  ],

  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.boldmind.ng' },
      { protocol: 'https', hostname: '**.amebogist.ng' },
      { protocol: 'https', hostname: '**.educenter.com.ng' },
      { protocol: 'https', hostname: '**.villagecircle.ng'},
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    externalDir: true,
  },

  webpack: (config) => {
    config.resolve.symlinks = true;
    // Fix packages whose package.json exports point to .mjs but only .js was built
    const brokenMjsPackages = ['analytics', 'auth', 'pwa'];
    for (const pkg of brokenMjsPackages) {
      config.resolve.alias[`@boldmind-tech/${pkg}`] =
        `${process.cwd()}/node_modules/@boldmind-tech/${pkg}/dist/index.js`;
    }
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;