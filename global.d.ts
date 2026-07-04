/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation" />

// ─── Environment variables ────────────────────────────────────────────────────
// Declare all env vars used in the app so TypeScript knows their types.
// NEXT_PUBLIC_ vars are safe to expose to the browser.
// All others are server-only.

declare namespace NodeJS {
  interface ProcessEnv {
    // ── Standalone NestJS API ──────────────────────────────────────────────
    /** Full base URL of the NestJS API. e.g. https://api.boldmind.ng/api/v1 */
    readonly NEXT_PUBLIC_API_URL: string;
    /**
     * Internal API URL used by server-side code only (avoids public internet).
     * Falls back to NEXT_PUBLIC_API_URL if not set.
     * e.g. http://api-service:4001/api/v1 (Docker internal) or http://localhost:4001/api/v1
     */
    readonly API_INTERNAL_URL?: string;

    // ── Hub frontend ──────────────────────────────────────────────────────
    /** URL of the Hub (this app). e.g. https://boldmind.ng */
    readonly NEXT_PUBLIC_HUB_URL: string;

    // ── Auth ──────────────────────────────────────────────────────────────
    /**
     * JWT secret — MUST match the NestJS API's JWT_SECRET exactly.
     * Used by middleware and server components to verify tokens without an API call.
     * NEVER expose this as NEXT_PUBLIC_.
     */
    readonly JWT_SECRET: string;
    /** Name of the SSO cookie. Default: boldmind_sso */
    readonly AUTH_COOKIE_NAME?: string;

    // ── Google OAuth ──────────────────────────────────────────────────────
    readonly GOOGLE_CLIENT_ID:     string;
    readonly GOOGLE_CLIENT_SECRET: string;

    // ── Misc ──────────────────────────────────────────────────────────────
    readonly NODE_ENV: 'development' | 'production' | 'test';

    // ── Analytics / monitoring (optional) ────────────────────────────────
    readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
    readonly NEXT_PUBLIC_POSTHOG_HOST?: string;
  }
}

// ─── Augment Window for analytics ────────────────────────────────────────────
interface Window {
  posthog?: {
    capture: (event: string, properties?: Record<string, unknown>) => void;
    identify: (userId: string, properties?: Record<string, unknown>) => void;
    reset: () => void;
  };
}