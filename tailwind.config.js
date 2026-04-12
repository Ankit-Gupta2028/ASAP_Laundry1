/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#0EA5E9',
        background: '#F8FAFC',
        success: '#22C55E',
        warning: '#F59E0B',
      }
    },
  },
  plugins: [],
}

