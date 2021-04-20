module.exports = {
  purge: {
    mode: "all",
    preserveHtmlElements: false,
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/popup.html"],
  },
  darkMode: "media",
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
