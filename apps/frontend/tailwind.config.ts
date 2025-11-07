/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import theme from 'tailwindcss/defaultTheme';

// Import default theme for fallback

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', ...theme.fontFamily.sans],
        mono: ['var(--font-kodemono)', ...theme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};

export default config;
