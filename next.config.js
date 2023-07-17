/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@babel/preset-react",
  "react-syntax-highlighter",
]);

module.exports = withTM({
  reactStrictMode: true,
});
