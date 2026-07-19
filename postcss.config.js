// postcss.config.js
//
// Tailwind CSS v4 ships its own PostCSS plugin — the config is much simpler
// than v3. The @tailwindcss/postcss package replaces both tailwindcss and
// the old postcss-import + autoprefixer pipeline.
//
// tailwindcss v4 + autoprefixer together is correct for Next.js 16.
// Do NOT add `tailwindcss` here as a separate plugin — that's the v3 pattern.

/** @type {import('postcss').ProcessOptions} */
const config = {
  plugins: {
    // Tailwind CSS v4 PostCSS plugin — handles everything including @import
    "@tailwindcss/postcss": {},
    // Autoprefixer for browser vendor prefixes (-webkit-, etc.)
    autoprefixer: {},
  },
};

export default config;
