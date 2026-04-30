
'use client';

import { ReactNode } from 'react';
import { ThemeProvider, FontProvider } from '@boldmind-tech/ui';
import type { ProductThemeType } from '@boldmind-tech/ui';

interface BoldMindLayoutProps {
  children: ReactNode;
}

const BOLDMIND_HUB_THEME: ProductThemeType = {
  slug: 'boldmind-hub',
  name: 'BoldMind — Building Systems That Shift Nations | Nigerian Tech Ecosystem',
  description: 'BoldMind is Nigeria\'s AI-first tech ecosystem — four pillars, one account. AmeboGist (Pidgin media, 12K+ readers), VillageCircle (conviction & venture studio), EduCenter (JAMB/WAEC prep + AI skills, 50K+ students), PlanAI (AI business tools, 650+ businesses). Built in Lagos.',
  icon: '🚀',
  status: 'LIVE',
  colors: {
    primary:    '#2B4D87',   
    secondary:  '#E9A825',   
    accent:     '#5B8ADE', 
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