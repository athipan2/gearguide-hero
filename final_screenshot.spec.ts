import { test, expect } from '@playwright/test';

test('capture screenshots', async ({ page }) => {
  await page.goto('http://localhost:8081/');
  await page.waitForTimeout(2000); // Wait for animations

  // Desktop
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: 'final_desktop.png', fullPage: true });

  // Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'final_mobile.png', fullPage: true });
});
