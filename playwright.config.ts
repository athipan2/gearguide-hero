import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'bun run dev --port 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
