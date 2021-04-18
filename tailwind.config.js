module.exports = {
  purge: {
    mode: "all",
    preserveHtmlElements: false,
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/popup.html"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
