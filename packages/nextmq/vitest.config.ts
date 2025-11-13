import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // for window/CustomEvent tests
    testTimeout: 5000, // 5 seconds should be enough for async tests
    env: {
      VITEST: 'true',
    },
    // Run tests in sequence to avoid interference between tests
    sequence: {
      shuffle: false,
    },
    // Limit concurrency to avoid interference
    maxConcurrency: 1,
  },
});