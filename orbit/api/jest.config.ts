import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
