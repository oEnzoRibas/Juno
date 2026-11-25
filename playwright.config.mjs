import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  reporter: [['list'], ['./tests/browser/review-reporter.mjs']],
  use: {
    baseURL: process.env.JUNO_SMOKE_WEB ?? 'http://127.0.0.1:3000',
    browserName: 'chromium',
    channel: process.env.JUNO_BROWSER_CHANNEL,
  },
});
