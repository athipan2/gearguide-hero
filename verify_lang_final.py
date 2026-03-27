import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Mobile view
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
        )
        page = await context.new_page()

        # Go to home
        await page.goto('http://localhost:8080/')
        await asyncio.sleep(2)
        await page.screenshot(path='/home/jules/verification/current_home_th.png')

        # Click language toggle (assuming it's in the navbar)
        # We need to find the toggle. It's a button with 'TH' or 'EN'
        await page.click('button:has-text("TH"), button:has-text("EN")')
        await asyncio.sleep(1)
        await page.screenshot(path='/home/jules/verification/current_home_en.png')

        # Check a category page
        await page.goto('http://localhost:8080/category/shoes')
        await asyncio.sleep(1)
        await page.screenshot(path='/home/jules/verification/current_category_en.png')

        await browser.close()

if __name__ == '__main__':
    if not os.path.exists('/home/jules/verification'):
        os.makedirs('/home/jules/verification')
    asyncio.run(verify())
