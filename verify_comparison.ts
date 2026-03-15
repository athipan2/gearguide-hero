import { test, expect } from '@playwright/test';

test('verify comparison table with specs and aspect ratings', async ({ page }) => {
  // Mock data for the comparison store
  const comparisonData = {
    state: {
      items: [
        {
          id: '1',
          name: 'Nike Pegasus 40',
          brand: 'Nike',
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
          rating: 4.5,
          price: '4,500',
          aspectRatings: {
            'ความนุ่ม': 4,
            'การตอบสนอง': 5,
            'ความทนทาน': 4
          },
          specs: [
            { label: 'น้ำหนัก', value: '280 กรัม' },
            { label: 'Drop', value: '10 มม.' },
            { label: 'ประเภทเท้า', value: 'เท้าปกติ' }
          ]
        },
        {
          id: '2',
          name: 'Adidas Adizero SL',
          brand: 'Adidas',
          image_url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb',
          rating: 4.2,
          price: '4,000',
          aspectRatings: {
            'ความนุ่ม': 3,
            'การตอบสนอง': 4,
            'ความทนทาน': 5,
            'ความมั่นคง': 4
          },
          specs: [
            { label: 'น้ำหนัก', value: '250 กรัม' },
            { label: 'Drop', value: '8 มม.' },
            { label: 'หน้าผ้า', value: 'Engineered Mesh' }
          ]
        }
      ]
    },
    version: 0
  };

  await page.goto('http://localhost:8080/');

  // Inject the comparison data into localStorage
  await page.evaluate((data) => {
    localStorage.setItem('gear-comparison-storage', JSON.stringify(data));
  }, comparisonData);

  // Navigate to the compare page
  await page.goto('http://localhost:8080/compare');

  // Wait for the table to render
  await page.waitForSelector('table');

  // Verify the product names are present
  await expect(page.locator('text=Nike Pegasus 40')).toBeVisible();
  await expect(page.locator('text=Adidas Adizero SL')).toBeVisible();

  // Verify Aspect Ratings section is visible
  await expect(page.locator('text=คะแนนการทดสอบ')).toBeVisible();
  await expect(page.locator('text=ความนุ่ม')).toBeVisible();

  // Verify Specs section is visible
  await expect(page.locator('text=ข้อมูลสเปค')).toBeVisible();
  await expect(page.locator('text=น้ำหนัก')).toBeVisible();
  await expect(page.locator('text=Drop')).toBeVisible();

  // Take a screenshot of the comparison table
  await page.screenshot({ path: 'comparison_table_filled.png', fullPage: true });
});
