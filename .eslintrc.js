module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "airbnb-typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "no-restricted-syntax": 0,
    "no-console": 0,
  },
  ignorePatterns: [".eslintrc.js", "tailwind.config.js", "webpack.config.js"],
};
