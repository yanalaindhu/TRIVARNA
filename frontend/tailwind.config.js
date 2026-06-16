/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#6C4CF1',
        'secondary-purple': '#8B6CFF',
        'light-purple': '#F3F0FF',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'success-green': '#22C55E',
        'warning-yellow': '#F59E0B',
        'danger-red': '#EF4444',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
}
