import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/\$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
};

export default createJestConfig(customJestConfig);


