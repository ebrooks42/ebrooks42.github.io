import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    transformMode: {
      web: [/\.[jt]sx?$/]
    }
  }
});
