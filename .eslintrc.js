module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "plugin:react/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "simple-import-sort", "react-hooks", "@typescript-eslint"],
  rules: {
    // increase the severity of rules so they are auto-fixable
    "simple-import-sort/imports": "off",
    "simple-import-sort/exports": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "multiline-ternary": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
  },
};
