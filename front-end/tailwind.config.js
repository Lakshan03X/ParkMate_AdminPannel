/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parkmate': {
          'green': '#50B748',
          'blue': '#093F86',
          'white': '#FFFFFF',
        }
      },
      backgroundImage: {
        'parkmate-gradient': 'linear-gradient(180deg, #50B748 3%, #FFFFFF 50%, #093F86 100%)',
      }
    },
  },
  plugins: [],
}