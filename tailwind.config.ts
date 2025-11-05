import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom "Neutral Blue" color palette here
        primary: {
          DEFAULT: '#1e40af', // Base deep blue
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // We will frequently use 800 for emphasis
          900: '#1e3a8a', 
          950: '#172554',
        },
      },
    },
  },
  plugins: [],
};

export default config;