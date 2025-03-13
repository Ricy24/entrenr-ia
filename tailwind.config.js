/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        senti: {
          primary: '#4F46E5',
          secondary: '#7C3AED',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'border-pulse': 'borderPulse 2s infinite',
        'pulse-slow': 'pulseSlow 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(79, 70, 229, 0.2)' },
          '50%': { borderColor: 'rgba(79, 70, 229, 0.4)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
