// tailwind.config.ts
//
// Tailwind CSS v4 moves almost all configuration into CSS. This TypeScript
// config file is now minimal — primarily used for darkMode strategy and
// plugins. Content scanning is handled by globals.css's @source directives
// (see the note there) — v4's content array below is kept as a defensive
// fallback in case anything in this build pipeline still reads it, but
// @source is the authoritative fix.
//
// Design tokens (colors, spacing, radii, etc.) live in globals.css as plain
// :root custom properties — NOT under an @theme block, despite what an
// earlier version of this comment claimed. Keep that in mind if you go
// looking for an @theme block that isn't there.

import type { Config } from "tailwindcss";

const config: Config = {
  // ─── Content paths ────────────────────────────────────────────────────────
  // The two @boldmindng/* entries previously read
  // "@boldmindng/ui/src/**/*.{js,ts,jsx,tsx}" — a bare package-import
  // specifier, not a path Tailwind's glob resolver can actually reach from
  // this file's location. It silently matched nothing, so any utility class
  // used ONLY inside those packages (e.g. SuperNavbar's `md:flex`/`md:hidden`
  // breakpoint, ThemeToggle's `sr-only`) was never generated — the navbar
  // showed its mobile icon cluster at every screen width, and "Theme: light"
  // rendered as visible text instead of being screen-reader-only. Pointing
  // through node_modules follows pnpm's workspace symlink to the real
  // package source.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@boldmindng/ui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@boldmindng/auth/**/*.{js,ts,jsx,tsx}",
  ],

  // ─── Dark mode ────────────────────────────────────────────────────────────
  // Using data attribute strategy to match our [data-theme=dark] pattern
  // in globals.css and the theme toggle in BoldmindLayout
  darkMode: ["selector", '[data-theme="dark"]'],

  theme: {
    extend: {
      // ── Map Tailwind utility classes to our CSS custom properties ──────────
      // This means `text-product-primary` → var(--product-primary) etc.
      // Defined here so IDE autocomplete works; actual values come from CSS vars.
      colors: {
        "product-primary": "var(--product-primary)",
        "product-secondary": "var(--product-secondary)",
        "product-accent": "var(--product-accent)",
        "product-background": "var(--product-background)",
        "product-foreground": "var(--product-foreground)",
        "product-muted": "var(--product-muted)",
        "product-highlight": "var(--product-highlight)",
        // Semantic
        success: "var(--color-success)",
        "success-light": "var(--color-success-light)",
        warning: "var(--color-warning)",
        "warning-light": "var(--color-warning-light)",
        error: "var(--color-error)",
        "error-light": "var(--color-error-light)",
        info: "var(--color-info)",
        "info-light": "var(--color-info-light)",
        // Neutrals — matched to globals.css token names
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
          950: "var(--neutral-950)",
        },
      },

      fontFamily: {
        // Active font — switches between OpenDyslexic and Inter via data-font attr
        sans: ["var(--font-active)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },

      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        inner: "var(--shadow-inner)",
      },

      transitionDuration: {
        quick: "150",
        base: "250",
        slow: "400",
        spring: "500",
      },

      // ── Animation keyframes used across the app ────────────────────────────
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },

      // ── Responsive max-widths ────────────────────────────────────────────
      maxWidth: {
        "screen-xs": "480px",
        content: "65ch",
      },

      // ── Backdrop blur values ─────────────────────────────────────────────
      backdropBlur: {
        glass: "16px",
      },
    },
  },

  plugins: [
    // Add plugins here if needed, e.g.:
    // require('@tailwindcss/typography') for prose content
    // require('@tailwindcss/forms')      for better form resets
  ],
};

export default config;
