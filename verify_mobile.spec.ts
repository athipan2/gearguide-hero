import { test, expect } from '@playwright/test';

test('review detail page mobile view', async ({ page }) => {
  // Use a mobile device preset
  await page.setViewportSize({ width: 375, height: 667 });

  // Go to a review page. Based on fallbackData, 'nike-vaporfly-3' should work.
  await page.goto('http://localhost:8080/review/nike-vaporfly-3');

  // Wait for content
  await page.waitForSelector('h1');

  // Take a screenshot
  await page.screenshot({ path: 'mobile_review_detail.png', fullPage: true });
});
