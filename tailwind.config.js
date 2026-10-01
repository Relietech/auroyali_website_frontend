export default {
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
          300: "#d2b48c",
          500: "#a0693f",
          700: "#6b4423",
          900: "#2f1f13",
        },
        clay: "#b5532f",
        sage: "#7a8b69",
      },
    },
  },
  plugins: [],
};
