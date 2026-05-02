
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { BoldMindLayout } from './boldmindLayout';
import { CookieConsent } from '@boldmind-tech/ui';
import { ClientErrorBoundary } from './components/ClientErrorBoundary';
import { AuthProvider } from './components/ClientAuthProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false, // OpenDyslexic is the default; don't block on Inter
});

const BASE_URL =
  process.env['NEXT_PUBLIC_APP_URL']?.replace(/\/$/, '') ?? 'https://boldmind.ng';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BoldMind — Building Systems That Shift Nations | Nigerian Tech Ecosystem',
    template: '%s | BoldMind',
  },
  description:
    'BoldMind is Nigeria\'s AI-first tech ecosystem — four pillars, one account. AmeboGist (Pidgin media, 12K+ readers), VillageCircle (conviction & venture studio), EduCenter (JAMB/WAEC prep + AI skills, 50K+ students), PlanAI (AI business tools, 650+ businesses). Built in Lagos.',
  keywords: [
    'BoldMind',
    'Nigerian entrepreneurs',
    'AI tools Nigeria',
    'AmeboGist',
    'VillageCircle',
    'EduCenter Nigeria',
    'PlanAI Suite',
    'Vibe Coders Nigeria',
    'Nigerian tech ecosystem',
    'JAMB past questions 2026',
    'WAEC prep Nigeria',
    'pidgin English news Nigeria',
    'AI business tools Nigeria',
    'digital storefronts Nigeria',
    'AI receptionist Nigeria',
    'Nigerian SME tools',
    'BoldMind OS',
    'NaijaFit',
    'Nigerian startup',
    'African AI technology',
    'business tools Nigeria',
    'tech company Lagos Nigeria',
    'Nigerian digital economy',
    'pan-African technology',
    'Paystack Nigeria business',
    'WhatsApp business automation Nigeria',
    'Nigerian ed-tech platform',
    'ViralKit social media Nigeria',
    'Nigerian content creator tools',
  ],
  authors: [
    { name: 'Boldmind Technology Solution Enterprise', url: BASE_URL },
    { name: 'Charles Uche Chijuka' },
  ],
  creator: 'Boldmind Technology Solution Enterprise',
  publisher: 'BoldMind Technology Solution Enterprise',
  formatDetection: { email: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: BASE_URL, languages: { 'en-NG': BASE_URL } },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: BASE_URL,
    title: 'BoldMind — Building Systems That Shift Nations',
    siteName: 'BoldMind',
    description:
      'One account. Four pillars. AmeboGist · VillageCircle · EduCenter · PlanAI. 650+ businesses, 50K+ students, 12K+ readers. Built in Lagos.',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'BoldMind — Nigerian Tech Ecosystem: AmeboGist, VillageCircle, EduCenter, PlanAI',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@boldmindng',
    creator: '@boldmindng',
    title: 'BoldMind — Building Systems That Shift Nations',
    description:
      'One account. Four pillars. AmeboGist · VillageCircle · EduCenter · PlanAI. 650+ businesses running. Built in Lagos. 🇳🇬',
    images: [`${BASE_URL}/og-image.png`],
  },
  verification: { google: process.env['NEXT_PUBLIC_GOOGLE_SITE_VERIFY'] },
  category: 'technology',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: { title: 'BoldMind', statusBarStyle: 'black-translucent' },
  other: {
    'application-name': 'BoldMind',
    'apple-mobile-web-app-title': 'BoldMind',
    'msapplication-TileColor': '#2B4D87',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2B4D87' },
    { media: '(prefers-color-scheme: dark)', color: '#1A3460' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BoldMind Technology Solution Enterprise',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.webp`,
  description:
    'Nigerian-built AI ecosystem with four pillars: AmeboGist (Pidgin media), VillageCircle (conviction & venture studio), EduCenter (ed-tech), and PlanAI (AI business tools). Empowering 1 million Nigerian entrepreneurs by 2030.',
  foundingDate: '2025',
  foundingLocation: 'Lagos, Nigeria',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 10 },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NG',
    addressRegion: 'Lagos',
    addressLocality: 'Lagos',
    streetAddress: 'No 5 Olusoji Imole Street, Ikosi Ketu',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@boldmind.ng',
    telephone: '+2349138349271',
    availableLanguage: ['English', 'Pidgin English'],
  },
  subOrganization: [
    { '@type': 'Organization', name: 'AmeboGist', url: 'https://amebogist.ng' },
    { '@type': 'Organization', name: 'VillageCircle', url: 'https://villagecircle.ng' },
    { '@type': 'Organization', name: 'EduCenter', url: 'https://educenter.com.ng' },
    { '@type': 'Organization', name: 'PlanAI', url: 'https://planai.boldmind.ng' },
  ],
  sameAs: [
    'https://x.com/boldmindng',
    'https://facebook.com/boldmindng',
    'https://instagram.com/boldmindng',
    'https://linkedin.com/company/boldmind-technology-solution-enterprise',
    'https://github.com/boldmind-tech',
    'https://youtube.com/@BoldMindTech',
    'https://tiktok.com/@boldmindng',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BoldMind',
  url: BASE_URL,
  inLanguage: 'en-NG',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={inter.variable} suppressHydrationWarning>
      <head>
        {/*
          BLOCKING SCRIPT — runs synchronously before browser paints.
          Sets data-font + data-product on <html> and applies the body font class
          before React hydration. Prevents Flash Of Unstyled Text (FOUT).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function applyFontClass(font){var b=document.body;if(!b)return;b.classList.remove('font-standard','font-dyslexic');b.classList.add('font-'+font);}try{var f=localStorage.getItem('boldmind-font-mode')||'dyslexic';document.documentElement.setAttribute('data-font',f);document.documentElement.setAttribute('data-product','boldmind-hub');applyFontClass(f);if(!document.body){document.addEventListener('DOMContentLoaded',function(){applyFontClass(f);});}}catch(e){var fallback='dyslexic';document.documentElement.setAttribute('data-font',fallback);document.documentElement.setAttribute('data-product','boldmind-hub');applyFontClass(fallback);if(!document.body){document.addEventListener('DOMContentLoaded',function(){applyFontClass(fallback);});}}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.boldmind.ng" />
        <link rel="dns-prefetch" href="//cdn.boldmind.ng" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta name="application-name" content="BoldMind" />
        <meta name="description" content="Building systems that shift nations" />
        <meta name="theme-color" content="#2B4D87" />
        <meta name="msapplication-TileColor" content="#2B4D87" />
        <meta name="msapplication-config" content="/browserconfig.xml" />


        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple/apple-touch-icon-167x167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple/apple-touch-icon-180x180.png" />

        <link rel="manifest" href="/site.webmanifest" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://boldmind.ng" />
        <meta property="og:site_name" content="BoldMind" />
        <meta property="og:title" content="BoldMind" />
        <meta property="og:description" content="Building systems that shift nations" />
        <meta property="og:image" content="https://boldmind.ng/social/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="BoldMind — Building systems that shift nations" />
        <meta property="og:locale" content="en_NG" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@boldmindNG" />
        <meta name="twitter:creator" content="@BoldMindNG" />
        <meta name="twitter:title" content="BoldMind" />
        <meta name="twitter:description" content="Building systems that shift nations" />
        <meta name="twitter:image" content="https://boldmind.ng/social/twitter-card.jpg" />


        <meta name="msapplication-square70x70logo" content="/icons/windows/mstile-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/icons/windows/mstile-150x150.png" />
        <meta name="msapplication-wide310x150logo" content="/icons/windows/mstile-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/icons/windows/mstile-310x310.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="geo.region" content="NG-LA" />
        <meta name="geo.placename" content="Lagos, Nigeria" />
        <meta name="geo.position" content="6.5244;3.3792" />
        <meta name="ICBM" content="6.5244, 3.3792" />
        <meta name="facebook-domain-verification" content="s3gyrqwl3bo41hl1hp21ez9rd324w1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ClientErrorBoundary>
          <AuthProvider>
            <BoldMindLayout>{children}</BoldMindLayout>
          </AuthProvider>
          <CookieConsent />
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
