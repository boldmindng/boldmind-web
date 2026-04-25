
import { SuperNavbar, SuperFooter } from '@boldmind-tech/ui';
import type { ReactNode } from 'react';

// Navigation links shown on all public hub pages
const NAV_LINKS = [
  { href: '/',                         label: 'Home'       },
  { href: '/products',                 label: 'Products'   },
  { href: '/pricing',                  label: 'Pricing'    },
  { href: 'https://amebogist.ng',      label: 'AmeboGist', isExternal: true },
  { href: 'https://educenter.com.ng',  label: 'EduCenter', isExternal: true },
  { href: '/about',                    label: 'About'      },
  { href: '/contact',                  label: 'Contact'    },
];

const FOOTER_SECTIONS = [
  {
    title: '🚀 Ecosystem',
    links: [
      { href: 'https://amebogist.ng',         label: 'AmeboGist',      isExternal: true },
      { href: 'https://educenter.com.ng',      label: 'EduCenter',      isExternal: true },
      { href: 'https://planai.boldmind.ng',    label: 'PlanAI Suite',   isExternal: true },
      { href: 'https://fit.boldmind.ng',       label: 'NaijaFit',       isExternal: true },
      { href: 'https://os.boldmind.ng',        label: 'BoldMind OS',    isExternal: true },
      { href: 'https://villagecircle.ng',   label: 'Concept Hub',    isExternal: true },
    ],
  },
  {
    title: '🏢 Company',
    links: [
      { href: '/about',    label: 'About BoldMind' },
      { href: '/products', label: 'All 32+ Products' },
      { href: '/pricing',  label: 'Pricing' },
      { href: '/contact',  label: 'Contact' },
      { href: '/privacy',  label: 'Privacy Policy' },
      { href: '/terms',    label: 'Terms of Service' },
    ],
  },
  {
    title: '🛟 Support',
    links: [
      { href: 'mailto:hello@boldmind.ng',        label: 'Email Us' },
      { href: 'https://wa.me/2349138349271',      label: 'WhatsApp Support', isExternal: true },
      { href: 'https://wa.me/2349138349271',      label: 'Report a Bug',     isExternal: true },
    ],
  },
];

export default function PublicHubLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SuperNavbar
        links={NAV_LINKS}
        cta={{ href: '/register', label: 'Get Started Free', variant: 'secondary' }}
        logoSrc="/logo.webp"
        sticky
        showThemeControls
      />
      <main className="flex-1">
        {children}
      </main>
      <SuperFooter
        logoSrc="/logo.webp"
        sections={FOOTER_SECTIONS}
        contactInfo={{
          email:    'hello@boldmind.ng',
          phone:    '+2349138349271',
          whatsapp: '+2349138349271',
          address:  'No 5 Olusoji Imole Street, Ikosi Ketu, Lagos, Nigeria',
        }}
        copyright={`© ${new Date().getFullYear()} BoldMind Technology Solution Enterprise. All rights reserved.`}
      />
    </div>
  );
}