const { FlatCompat } = require("@eslint/eslintrc");
const { Linter } = require("eslint");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    files: ["**/*.{js,ts,tsx}"],
    ignores: ["node_modules/**"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "react-app",
      "react-app/jest"
    ],
    rules: {
      // Add custom rules here
    },
  },
];
