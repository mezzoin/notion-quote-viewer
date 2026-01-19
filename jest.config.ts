/**
 * Jest 설정 파일
 * Next.js 16 + React 19 환경에 최적화된 설정
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공하여 테스트 환경에서 next.config.ts와 .env 파일을 로드
  dir: "./",
});

const config: Config = {
  // 테스트 환경 설정
  testEnvironment: "jsdom",

  // 셋업 파일 (테스트 실행 전에 로드)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // 테스트 파일 패턴
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],

  // 모듈 경로 별칭 (@/* -> src/*)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 테스트 제외 경로
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
  ],

  // 커버리지 설정
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/app/**/layout.tsx",
    "!src/app/**/loading.tsx",
    "!src/app/**/error.tsx",
    "!src/app/**/not-found.tsx",
  ],

  // 커버리지 리포트 디렉토리
  coverageDirectory: "coverage",

  // 변환 무시 패턴 (ESM 모듈 처리)
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
};

export default createJestConfig(config);
