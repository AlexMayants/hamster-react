module.exports = {
  parser: "@babel/eslint-parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  env: {
    "browser": true,
    "mocha": true,
    "es6": true
  },
  settings: {
    react: {
      version: '16',
    },
  },
};
