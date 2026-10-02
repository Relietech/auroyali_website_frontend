export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Cormorant Garamond"', "serif"],
        body: ["Jost", "sans-serif"],
      },
      colors: {
        earth: {
          50: "#faf6f1",
          100: "#f1e8dc",
          200: "#e5d5c0",
          300: "#d2b48c",
          400: "#ba8e65",
          500: "#a0693f",
          600: "#865430",
          700: "#6b4423",
          800: "#4d2f19",
          900: "#2f1f13",
          950: "#1a100a",
        },
        clay: "#b5532f",
        sage: "#7a8b69",
      },
    },
  },
  plugins: [],
};
