/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // A nice blue
        secondary: '#10B981', // A clean green
        background: '#F9FAFB', // A very light gray
        foreground: '#1F2937', // A dark gray for text
      },
      // 2. Set the default font family
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}