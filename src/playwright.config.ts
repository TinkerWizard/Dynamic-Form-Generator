import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,                  // Run tests in headless mode
    screenshot: 'only-on-failure',   // Take screenshots for failed tests
    video: 'retain-on-failure',      //Record video for failed tests
  },
});
