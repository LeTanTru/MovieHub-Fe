// tailwind.config.ts
import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-be-vietnam-pro)', 'sans-serif']
      }
    }
  },
  plugins: [tailwindAnimate]
};

export default config;
