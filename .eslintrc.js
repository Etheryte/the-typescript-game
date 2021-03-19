module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "no-undef": "off",
    "no-unused-expressions": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-expressions": "error",
  },
  globals: {
    React: "writable",
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "eslint-config-prettier",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
