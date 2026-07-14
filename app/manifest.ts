import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Boldmind Technology Solution Enterprise',
    short_name: 'BoldmindNG',
    description: 'One ecosystem. Four pillars. Built in Lagos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF9',
    theme_color: '#2B4D87',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'productivity', 'education'],
    screenshots: [
      {
        src: '/screenshot1.png',
        sizes: '1280x720',
        type: 'image/png',
      },
    ],
    lang: 'en',
    dir: 'ltr',
  }
}