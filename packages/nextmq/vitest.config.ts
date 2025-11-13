import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // for window/CustomEvent tests
    env: {
      VITEST: 'true',
    },
  },
});