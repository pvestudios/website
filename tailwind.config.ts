import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          200: '#ffea00',
          300: '#8a2be2',
          400: '#00f0ff',
          500: '#39ff14',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(57,255,20,0.3), 0 0 48px rgba(0,240,255,0.2)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(60% 60% at 50% 50%, rgba(57,255,20,0.15), transparent), radial-gradient(40% 40% at 85% 10%, rgba(0,240,255,0.15), transparent), radial-gradient(40% 40% at 15% 90%, rgba(138,43,226,0.15), transparent)'
      }
    }
  },
  plugins: [],
};
export default config;
