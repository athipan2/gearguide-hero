import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 12'],
});

test('verify mobile layout on major pages', async ({ page }) => {
  // 1. Home Page
  await page.goto('http://localhost:8080/');
  await expect(page.locator('h1')).toContainText('GEAR FOR THE');
  // Check if Hero buttons are stacked (full width or nearly full width)
  const heroButton = page.locator('button:has-text("ดูรีวิวล่าสุด")');
  const box = await heroButton.boundingBox();
  if (box) {
    // On iPhone 12 (390px width), a full width button with margin should be > 300px
    expect(box.width).toBeGreaterThan(300);
  }
  await page.screenshot({ path: 'mobile-home.png' });

  // 2. Category Page
  await page.goto('http://localhost:8080/category');
  await expect(page.locator('h1')).toBeVisible();
  // Check if filter button exists on mobile
  await expect(page.locator('[data-testid="mobile-filter-button"]')).toBeVisible();
  await page.screenshot({ path: 'mobile-category.png' });

  // 3. Review Detail Page
  // We need a slug. Let's try the fallback one.
  await page.goto('http://localhost:8080/review/nike-vaporfly-3');
  await expect(page.locator('h1')).toBeVisible();
  await page.screenshot({ path: 'mobile-review-detail.png' });

  // 4. Guides Page
  await page.goto('http://localhost:8080/guides');
  await expect(page.locator('h1')).toContainText('คู่มือ');
  await page.screenshot({ path: 'mobile-guides.png' });
});
