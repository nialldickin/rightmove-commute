module.exports = {
  purge: {
    enabled: true,
    mode: "all",
    preserveHtmlElements: false,
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/popup.html"],
  },
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      ringWidth: ["hover"],
    },
  },
  plugins: [],
};
