/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#0f0f1a',
        'pane-bg': '#1a1a2e',
        'mid-bg': '#0d0d1f',
        'header-bg': '#12122a',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bar1': 'barPulse 0.8s ease-in-out infinite alternate',
        'bar2': 'barPulse 0.6s ease-in-out infinite alternate',
        'bar3': 'barPulse 1.1s ease-in-out infinite alternate',
        'bar4': 'barPulse 0.7s ease-in-out infinite alternate',
        'bar5': 'barPulse 0.9s ease-in-out infinite alternate',
        'bar6': 'barPulse 0.5s ease-in-out infinite alternate',
        'bar7': 'barPulse 1.2s ease-in-out infinite alternate',
        'bar8': 'barPulse 0.65s ease-in-out infinite alternate',
        'float-up': 'floatUp 1s ease-out forwards',
        'click-pulse': 'clickPulse 0.3s ease-out forwards',
        'spin-slow': 'spin 4s linear infinite',
      },
      keyframes: {
        barPulse: {
          '0%': { height: '20%' },
          '100%': { height: '100%' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-80px) scale(1.4)' },
        },
        clickPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
