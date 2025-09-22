/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'serif'], // ✅ For headings
        body: ['Inter', 'sans-serif'],          // ✅ For paragraphs & general text
      },
    },
  },
  plugins: [],
}
