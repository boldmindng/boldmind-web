import { SuperNavbar, SuperFooter } from "@boldmindng/ui";
import type { ReactNode } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "https://amebogist.ng", label: "AmeboGist", isExternal: true },
  {
    href: "https://villagecircle.ng",
    label: "VillageCircle",
    isExternal: true,
  },
  { href: "https://educenter.com.ng", label: "EduCenter", isExternal: true },
  { href: "https://planai.boldmind.ng", label: "PlanAI", isExternal: true },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

// Section titles were previously "🚀 Ecosystem" / "🏢 Company" / "🛟 Support" —
// a raw emoji glued onto plain text, with no rendering path that turns it
// into a real icon (SuperFooter's <h3>{section.title}</h3> just prints the
// string as-is). Emoji-as-iconography is the same anti-pattern the rest of
// this design system avoids with lucide icons elsewhere. Per-link icons
// *do* have a real mechanism — FooterLink.icon accepts one of SuperFooter's
// ICON_MAP keys and renders the matching lucide icon — so the Ecosystem
// links below use that instead of decorating the section title.
const FOOTER_SECTIONS = [
  {
    title: "Ecosystem",
    links: [
      {
        href: "https://amebogist.ng",
        label: "AmeboGist",
        isExternal: true,
        icon: "📰", // → Newspaper, via ICON_MAP
      },
      {
        href: "https://villagecircle.ng",
        label: "VillageCircle",
        isExternal: true,
        icon: "📚", // → BookOpen
      },
      {
        href: "https://villagecircle.ng/vibe-coders",
        label: "Vibe Coders",
        isExternal: true,
      },
      {
        href: "https://educenter.com.ng",
        label: "EduCenter",
        isExternal: true,
        icon: "🎓", // → GraduationCap
      },
      {
        href: "https://planai.boldmind.ng",
        label: "PlanAI Suite",
        isExternal: true,
        icon: "⚡", // → Zap
      },
      {
        href: "https://marketplace.boldmind.ng",
        label: "Marketplace",
        isExternal: true,
        icon: "🛍️", // → ShoppingCart
      },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About BoldmindNG" },
      { href: "/ecosystem", label: "Ecosystem" },
      { href: "/pricing", label: "Pricing" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "mailto:hello@boldmind.ng", label: "Email Us", icon: "📧" },
      {
        href: "https://wa.me/2349138349271",
        label: "WhatsApp Support",
        isExternal: true,
      },
      {
        href: "https://wa.me/2349138349271",
        label: "Report a Bug",
        isExternal: true,
      },
    ],
  },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SuperNavbar
        brandName="BoldmindNG"
        links={NAV_LINKS}
        logoSrc="/logo.png"
        sticky
        showThemeControls
      />
      <main className="flex-1">{children}</main>
      <SuperFooter
        logoSrc="/logo.png"
        sections={FOOTER_SECTIONS}
        copyright={`© ${new Date().getFullYear()} Boldmind Technology Solution Enterprise. All rights reserved.`}
      />
    </div>
  );
}
