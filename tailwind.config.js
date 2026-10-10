/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#111318',
        surface: '#20242D',
        'surface-secondary': '#171A21',
        primary: '#A78BFA',
        secondary: '#70E1F5',
        text: '#F4F5F7',
        'text-muted': '#A4A9B6',
      },
      boxShadow: {
        'neu-inset': 'inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -4px -4px 10px rgba(255, 255, 255, 0.05)',
        'neu-raised': '4px 4px 10px rgba(0, 0, 0, 0.5), -4px -4px 10px rgba(255, 255, 255, 0.05)',
        'neu-pressed': 'inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}
