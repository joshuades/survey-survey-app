/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Optional: Handling Absolute Imports and Module Path Aliases
  moduleNameMapper: {
    // ...
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  modulePaths: ["<rootDir>/src/", "<rootDir>/"],
  moduleDirectories: ["node_modules", "src"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// export default createJestConfig(config);

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// module.exports = createJestConfig(customJestConfig)
module.exports = async () => ({
  ...(await createJestConfig(config)()),
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  // transform: {
  //   "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  // },
  // testMatch: ["**/src/**/*.+(ts|tsx|js)"],
  // extensionsToTreatAsEsm: [".ts"],
  // transformIgnorePatterns: [
  //   // "/node_modules/(?!(@auth|@auth/core|next-auth|@panva|jose|preact-render-to-string|preact)/)",
  //   // "/node_modules/(?!.*/)",
  //   "^.+\\.module\\.(css|sass|scss)$",
  // ],
});
