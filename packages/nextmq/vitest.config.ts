import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // for window/CustomEvent tests
    testTimeout: 10000, // Increase timeout for async tests
    env: {
      VITEST: 'true',
    },
  },
});