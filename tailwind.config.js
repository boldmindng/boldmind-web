 
/** @type {import('tailwindcss').Config} */
const config = {
  ...baseConfig,
 
  // content must include shared packages so their class names are not purged
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts}',
      './node_modules/@boldmind-tech/ui/dist/**/*.{js,mjs}',
  ],
 
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
 
      // Hub-specific tokens
      colors: {
        ...(baseConfig.theme?.extend)?.colors,
        'hub-gold':  '#E9A825',
        'hub-navy':  '#2B4D87',
      },
    },
  },
};
 
export default config;