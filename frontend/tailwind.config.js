/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        display: ['Special Elite', 'serif'],
      },
      colors: {
        cream: '#F7F1E6',
        paper: '#FBF8F1',
        charcoal: '#171717',
        brown: '#8F5633',
        terracotta: '#B8643C',
        olive: '#77734C',
        muted: '#77716A',
        subtle: 'rgba(40,30,20,0.10)',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(50, 35, 20, 0.08)',
        'float': '0 12px 40px rgba(50, 35, 20, 0.12)',
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '36px',
      }
    },
  },
  plugins: [],
}
