'use client';

import { AuthProvider } from '@boldmindng/auth';
import { ThemeProvider } from '@boldmindng/ui';
import type { ReactNode } from 'react';

interface ClientAuthProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with both ThemeProvider (from @boldmindng/ui — required by
 * SuperNavbar/SuperFooter's useTheme() hook for light/dark + font mode toggles)
 * and AuthProvider (from @boldmindng/auth — session state, SSO sync).
 *
 * ThemeProvider MUST be the outermost provider here so that any component
 * in the tree — including AuthProvider's children — can call useTheme()
 * without throwing "useTheme must be used within <ThemeProvider>".
 */
export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return (
    <ThemeProvider
      defaultTheme="light"
      forceProductSlug="boldmind-hub"
      defaultDyslexia
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}