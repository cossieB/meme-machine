/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bills': '"Stick No Bills", sans-serif',
        'nunito': ['Nunito', 'sans-serif']
      }
    },
  },
  plugins: [],
}