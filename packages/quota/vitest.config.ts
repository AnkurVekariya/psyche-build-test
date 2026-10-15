import { defineConfig } from 'vitest/config';

// Its own config, so vitest doesn't pick up the repository root's.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
  },
});
