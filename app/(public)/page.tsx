import type { Metadata, Viewport } from 'next';
import HomeContent from './HomeContent';

export const metadata: Metadata = {
  metadataBase: new URL('https://boldmind.ng'),
  title: {
    default: 'BoldMind',
    template: `%s | BoldMind NG`,
  },
  description: 'Building systems that shift nations',
  applicationName: 'BoldMind',
  keywords: ['Nigeria', 'boldmind', 'BoldMind', 'Nigerian entrepreneur'],
  authors: [{ name: 'Boldmind Technology Solution Enterprise', url: 'https://boldmind.ng' }],
  creator: 'BoldMind Technology',
  publisher: 'BoldMind Technology Solution Enterprise',

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/icons/apple/apple-touch-icon-152x152.png', sizes: '152x152' },
      { url: '/icons/apple/apple-touch-icon-167x167.png', sizes: '167x167' },
      { url: '/icons/apple/apple-touch-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/favicon-96x96.png' },
    ],
  },

  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    url: 'https://boldmind.ng',
    siteName: 'BoldMind',
    title: 'BoldMind',
    description: 'Building systems that shift nations',
    locale: 'en_NG',
    images: [
      {
        url: '/social/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BoldMind',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@boldmindNG',
    creator: '@boldmindindng',
    title: 'BoldMind',
    description: 'Building systems that shift nations',
    images: ['/social/twitter-card.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2B4D87' },
    { media: '(prefers-color-scheme: dark)',  color: '#2B4D87' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function BoldMindHomePage() {
  return <HomeContent />;
}
