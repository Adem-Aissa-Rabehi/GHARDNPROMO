/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ghardn-red': '#E20916',
        'ghardn-red-hover': '#C00813',
        'ghardn-dark': '#262626',
        'ghardn-dark-charcoal': '#302B28',
        'ghardn-dark-800': '#1F1C1A',
        'ghardn-dark-900': '#151312',
        'ghardn-light': '#F5F5F5',
        'ghardn-muted': '#737373',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.25em',
        mega: '.35em',
        ultra: '.5em',
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.4)',
        'red-glow': '0 10px 30px rgba(226, 9, 22, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
