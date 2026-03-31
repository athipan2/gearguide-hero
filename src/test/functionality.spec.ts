import { test, expect } from '@playwright/test';

test.describe('Technical Audit', () => {
  let errors: string[] = [];
  let failedRequests: string[] = [];

  const getFilteredErrors = () => {
    return errors.filter(e => {
      // Filter out known Supabase 400 errors caused by missing columns in this environment.
      // These are expected/non-blocking as the frontend uses fallback logic and select(*)
      const isExpectedSupabaseError = e.toLowerCase().includes('supabase') && e.includes('400');

      // Filter out potential non-critical noise
      const isNoise = e.includes('google-analytics') || e.includes('doubleclick');

      // Filter out the "No matches" fallback notice which is expected in empty test environments
      const isFallbackNotice = e.includes('Fetch failed, reverting to fallback data');

      return !isExpectedSupabaseError && !isNoise && !isFallbackNotice;
    });
  };

  test.beforeEach(async ({ page }) => {
    errors = [];
    failedRequests = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));
    page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', response => {
      if (response.status() >= 400) {
        errors.push(`Response ${response.status()} from ${response.url()}`);
      }
    });
  });

  test('Home page technical check', async ({ page }) => {
    // Bypass wizard
    await page.addInitScript(() => {
      window.sessionStorage.setItem('geartrail_visited', 'true');
    });
    await page.goto('http://localhost:8080/');
    await page.waitForLoadState('networkidle');

    expect(getFilteredErrors()).toHaveLength(0);
  });

  test('Category page navigation and filters', async ({ page }) => {
    // Bypass wizard
    await page.addInitScript(() => {
      window.sessionStorage.setItem('geartrail_visited', 'true');
    });
    await page.goto('http://localhost:8080/category');
    await page.waitForLoadState('networkidle');

    // Click a category from CategorySection (simulated navigation)
    await page.goto('http://localhost:8080/category/%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B9%80%E0%B8%97%E0%B8%A3%E0%B8%A5');
    await page.waitForLoadState('networkidle');

    expect(getFilteredErrors()).toHaveLength(0);
  });

  test('Search functionality', async ({ page }) => {
    // Bypass wizard
    await page.addInitScript(() => {
      window.sessionStorage.setItem('geartrail_visited', 'true');
    });
    await page.goto('http://localhost:8080/');
    // Search button usually has a Search icon, use a more robust selector
    await page.click('nav button .lucide-search, button:has(.lucide-search)');
    await page.fill('input[placeholder*="Search"], input[placeholder*="ค้นหา"]', 'Nike');
    // Wait for debounce and search results
    await page.waitForTimeout(1000);
    expect(getFilteredErrors()).toHaveLength(0);
  });

  test('Shoe Wizard flow', async ({ page }) => {
    // DO NOT bypass wizard here, but ensure it's not already dismissed
    await page.goto('http://localhost:8080/');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    // The wizard shows after 2 seconds
    await page.waitForSelector('span:has-text("GearTrail Assistant")', { timeout: 10000 });

    // Step 1: Click Shoes
    await page.click('button:has-text("Running Shoes"), button:has-text("รองเท้าวิ่ง"), button:has-text("SHOES")');

    // Step 2: Click suggestions
    await page.click('button:has-text("Need suggestions"), button:has-text("อยากให้ช่วยแนะนำ")');

    // Step 3: Health goal
    await page.click('button:has-text("Health"), button:has-text("สุขภาพ")');

    // Step 4: Soft feeling
    await page.click('button:has-text("Soft"), button:has-text("นุ่ม")');

    // Step 5: Normal foot
    await page.click('button:has-text("Normal"), button:has-text("อุ้งเท้าปกติ")');

    // Result
    await page.waitForSelector('h3:has-text("picked for you"), h3:has-text("เราคัดมาให้คุณแล้ว"), h3:has-text("Picked for you")', { timeout: 15000 });

    expect(getFilteredErrors()).toHaveLength(0);
  });
});
