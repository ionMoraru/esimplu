import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@esimplu/types$": "<rootDir>/../packages/types/index.ts",
  },
}

export default config
