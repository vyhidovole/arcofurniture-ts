//jest.config.ts
import nextJest from 'next/jest';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/\$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  // Добавьте эти настройки для TypeScript
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // Игнорируем node_modules при трансформации
  transformIgnorePatterns: [
    'node_modules/(?!(.*)/)',
  ],
};

export default createJestConfig(customJestConfig);



