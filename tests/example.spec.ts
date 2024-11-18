import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('http://localhost:5143');
  await expect(page).toHaveTitle(/Vite/);
});
    