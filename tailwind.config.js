/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: "#121212",
        secondary: "#7000FF",
        accent: "#FF0080",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.accent"), 0 0 20px theme("colors.accent")',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      height: {
        'screen-small': '100vh',
        'screen-large': 'calc(100vh - 4rem)',
      },
      touchAction: {
        'manipulation': 'manipulation',
      },
    },
  },
  plugins: [],
} 