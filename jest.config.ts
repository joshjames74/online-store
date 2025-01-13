import type { Config } from "jest";
import nextJest from "next/jest.js";

const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

const createJestConfig = nextJest({
  dir: "./",
});

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

const config: Config = {
  coverageProvider: "v8",
  //testEnvironment: 'jsdom',
  // setupFilesAfterEnv: ['./jest.setup.ts'],
  maxWorkers: 1,
  //testMatch: ["**/*.test.ts", "**/test/*.test.tsx"],
  // moduleNameMapper: {
  //   '\\.(css|less|scss)$': 'identity-obj-proxy',
  //   "\\.(ttf|woff|woff2|eot|svg|png|jpg|jpeg|gif)$": "./src/tests/__mocks__/fileMock.ts",},
  silent: false,
  projects: [
    {
      displayName: "api",
      testEnvironment: "node",
      preset: "ts-jest",
      setupFilesAfterEnv: ["./src/tests/setup/apiSetup.ts"],
      testMatch: [
        "**/tests/api/**/*.test.ts",
        //"**/tests/api/order/post/index.test.ts"
      ],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/",
      }),
    },
    {
      displayName: "components",
      testEnvironment: "jsdom",
      preset: "ts-jest",
      setupFilesAfterEnv: ["./src/tests/setup/componentSetup.ts"],
      testMatch: [
        "**/tests/components/**/*.test.ts",
        "**/tests/components/**/*.test.tsx",
      ],
      moduleNameMapper: {
        // Custom mappings
        "\\.(css|less|scss)$": "identity-obj-proxy",
        "\\.(ttf|woff|woff2|eot|svg|png|jpg|jpeg|gif)$":
          "<rootDir>/src/tests/__mocks__/fileMock.ts",

        // Add TypeScript path aliases
        ...pathsToModuleNameMapper(compilerOptions.paths, {
          prefix: "<rootDir>/",
        }),
      },
      transform: {
        "^.+\\.(js|ts)x?$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }], // Transform TypeScript files
      },
    },
    {
      displayName: "contexts",
      testEnvironment: "jsdom",
      preset: "ts-jest",
      setupFilesAfterEnv: ["./src/tests/setup/componentSetup.ts"],
      testMatch: [
        "**/tests/contexts/**/*.test.ts",
        "**/tests/contexts/**/*.test.tsx",
      ],
      moduleNameMapper: {
        // Custom mappings
        "\\.(css|less|scss)$": "identity-obj-proxy",
        "\\.(ttf|woff|woff2|eot|svg|png|jpg|jpeg|gif)$":
          "<rootDir>/src/tests/__mocks__/fileMock.ts",

        // Add TypeScript path aliases
        ...pathsToModuleNameMapper(compilerOptions.paths, {
          prefix: "<rootDir>/",
        }),
      },
      transform: {
        "^.+\\.(js|ts)x?$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }], // Transform TypeScript files
      },
    },
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
