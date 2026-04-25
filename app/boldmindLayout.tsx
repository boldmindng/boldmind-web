// ─────────────────────────────────────────────────────────────────────────────
// apps/boldmind-hub/app/boldmindLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CHANGES:
//   - Colors now use corrected #2B4D87 / #E9A825 from logo
//   - FontProvider added so OpenDyslexic toggle works in the hub
//   - ThemeProvider + FontProvider compose in correct order
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { ReactNode } from 'react';
import { ThemeProvider, FontProvider } from '@boldmind-tech/ui';
import type { ProductThemeType } from '@boldmind-tech/ui';

interface BoldMindLayoutProps {
  children: ReactNode;
}

// ✅ Hardcoded from logo.webp — circle background + 'B' symbol
const BOLDMIND_HUB_THEME: ProductThemeType = {
  slug: 'boldmind-hub',
  name: 'BoldMind Hub',
  description: 'Central ecosystem portal for all BoldMind products',
  icon: '🚀',
  status: 'LIVE',
  colors: {
    primary:    '#2B4D87',   // logo circle — medium slate navy
    secondary:  '#E9A825',   // logo 'B'    — warm golden amber
    accent:     '#5B8ADE',   // lighter navy for hover states
    background: '#FAFAF9',
  },
};

export function BoldMindLayout({ children }: BoldMindLayoutProps) {
  return (
    <ThemeProvider
      defaultTheme="light"
      defaultProduct={BOLDMIND_HUB_THEME}
    >
      <FontProvider defaultMode="dyslexic">
        {children}
      </FontProvider>
    </ThemeProvider>
  );
}