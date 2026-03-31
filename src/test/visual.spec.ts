import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Bypass Shoe Wizard
  await page.addInitScript(() => {
    window.sessionStorage.setItem('geartrail_visited', 'true');
  });
});

const pages = [
  { name: 'home', url: '/' },
  { name: 'category', url: '/category' },
  { name: 'guides', url: '/guides' },
  { name: 'compare', url: '/compare' },
  { name: 'review', url: '/review/nike-vaporfly-3' }, // Assuming this exists or falls back
];

for (const p of pages) {
  test(`visual audit - ${p.name} - desktop`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(p.url);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `verification/desktop-${p.name}.png`, fullPage: true });
  });

  test(`visual audit - ${p.name} - mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(p.url);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `verification/mobile-${p.name}.png`, fullPage: true });
  });
}
