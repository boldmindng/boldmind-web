import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/dashboard', '/account', '/settings', '/wallet', '/admin', '/onboarding', '/community', '/api/'] },
    ],
    sitemap: 'https://boldmind.ng/sitemap.xml',
    host: 'https://boldmind.ng',
  };
}