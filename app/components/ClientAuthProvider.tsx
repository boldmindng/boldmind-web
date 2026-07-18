"use client";

import { AuthProvider } from "@boldmindng/auth";
import { ThemeProvider, FontProvider } from "@boldmindng/ui";
import type { ReactNode } from "react";

interface ClientAuthProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with ThemeProvider (light/dark + product-color state),
 * FontProvider (standard/OpenDyslexic state), and AuthProvider (session,
 * SSO sync).
 *
 * FontProvider was missing here entirely. BoldmindLayout.tsx renders
 * `<DyslexiaToggle variant="compact" />`, and DyslexiaToggle calls
 * useFontMode() — which throws ("useFontMode must be used within
 * <FontProvider>") unless a FontProvider is mounted somewhere above it.
 * Nothing in this app's tree (layout.tsx → ClientErrorBoundary →
 * ClientAuthProvider → ThemeProvider → AuthProvider) was providing that,
 * so the sidebar's dyslexia toggle would crash the tree the moment it
 * rendered. @boldmindng/ui's own AppLayout wraps ThemeProvider around
 * FontProvider the same way, for the same reason.
 *
 * Order still matters: ThemeProvider outermost so any component —
 * including AuthProvider's children — can call useTheme() safely.
 */
export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return (
    <ThemeProvider
      defaultTheme="light"
      forceProductSlug="boldmind-hub"
      defaultDyslexia
    >
      <FontProvider defaultMode="dyslexic">
        <AuthProvider>{children}</AuthProvider>
      </FontProvider>
    </ThemeProvider>
  );
}
