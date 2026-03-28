// tailwind.config.ts
import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.css'],
  theme: {
    extend: {}
  },
  plugins: [tailwindAnimate]
};

export default config;
