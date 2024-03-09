/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      primary: [ 'Rubik', 'sans-serif' ],
      secondary: [ '"Open Sans"', 'sans-serif' ],
    },
    extend: {},
  },
  plugins: [],
}

