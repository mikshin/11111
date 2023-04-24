module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "babel-eslint",
  },
  ignorePatterns: ["src/plugins/*"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    camelcase: 1,
    "no-trailing-spaces": 2,
    "no-unused-vars": 2,
    "no-multi-spaces": 2,
    "no-use-before-define": 2,
    "no-var": 2,
    "space-in-parens": 2,
    "no-useless-escape": 0,
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
