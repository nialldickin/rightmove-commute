module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
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
    "prettier/prettier": "error",
    "no-console": 0,
    "multiline-comment-style": ["error", "starred-block"],
    "spaced-comment": ["error", "always"],
  },
  ignorePatterns: [
    ".eslintrc.js",
    "tailwind.config.js",
    "webpack.config.js",
    "postcss.config.js",
    "/dist/*",
  ],
};
