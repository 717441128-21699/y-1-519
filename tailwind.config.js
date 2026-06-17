/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        magic: {
          purple: '#6B46C1',
          pink: '#EC4899',
          gold: '#F59E0B',
          blue: '#3B82F6',
          green: '#10B981',
          red: '#EF4444',
          dark: '#1E1B4B',
          darker: '#0F0A2E',
        }
      },
      fontFamily: {
        display: ['Cinzel Decorative', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'magic-enter': 'magicEnter 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        magicEnter: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      backgroundImage: {
        'magic-gradient': 'linear-gradient(135deg, #6B46C1 0%, #EC4899 50%, #F59E0B 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0F0A2E 0%, #1E1B4B 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(107, 70, 193, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
      },
      boxShadow: {
        'magic': '0 0 30px rgba(107, 70, 193, 0.5)',
        'magic-pink': '0 0 30px rgba(236, 72, 153, 0.5)',
        'magic-gold': '0 0 30px rgba(245, 158, 11, 0.5)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
