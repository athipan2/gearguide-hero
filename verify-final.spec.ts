import { test, expect } from '@playwright/test';

test('verify review detail layout final', async ({ page }) => {
  await page.goto('http://localhost:5173/review/nike-vaporfly-3');
  await page.waitForLoadState('networkidle');

  const article = page.locator('article');
  await expect(article).toBeVisible();

  const box = await article.boundingBox();
  console.log('Article width:', box?.width);
  expect(box?.width).toBeLessThanOrEqual(800);

  const relatedHeading = page.getByRole('heading', { name: 'รีวิวที่เกี่ยวข้อง' });
  await expect(relatedHeading).toBeVisible();

  const relatedSection = page.locator('section').filter({ has: relatedHeading });
  const relatedBox = await relatedSection.boundingBox();
  console.log('RelatedReviews width:', relatedBox?.width);
  expect(relatedBox?.width).toBeLessThanOrEqual(800);

  await page.screenshot({ path: 'final-verification.png', fullPage: true });
});
