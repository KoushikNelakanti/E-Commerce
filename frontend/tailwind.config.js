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
        // Light theme colors
        'apple-gray': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        'apple-blue': {
          500: '#007AFF',
          600: '#0056CC',
        },
        
        // Dark theme colors
        'dark': {
          'bg': '#000000',
          'surface': '#1c1c1e',
          'surface-secondary': '#2c2c2e',
          'surface-tertiary': '#3a3a3c',
          'border': '#38383a',
          'text-primary': '#ffffff',
          'text-secondary': '#ebebf5',
          'text-tertiary': '#ebebf599',
          'text-quaternary': '#ebebf54d',
          'blue': {
            500: '#0a84ff',
            600: '#0969da',
          },
          'green': '#30d158',
          'red': '#ff453a',
          'orange': '#ff9f0a',
          'purple': '#bf5af2',
        }
      }
    }
  },
  plugins: [],
}