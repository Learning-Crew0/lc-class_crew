module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/test/**",
    "!src/seeds/**",
    "!src/scripts/**",
  ],
  testMatch: ["**/src/test/**/*.test.js"],
  testTimeout: 10000,
  verbose: true,
};
