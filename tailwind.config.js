/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#090a0f',
          900: '#0f111a',
          850: '#151824',
          800: '#1b1f30',
          700: '#282d44',
          600: '#383e5d',
          500: '#4d557f',
          accent: '#6366f1',
          cyan: '#06b6d4',
          pink: '#ec4899',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        cinematic: ['Cinzel', 'Playfair Display', 'serif'],
        display: ['Impact', 'Montserrat', 'sans-serif'],
        condensed: ['Bebas Neue', 'Oswald', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(99, 102, 241, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}
