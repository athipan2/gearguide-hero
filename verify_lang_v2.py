import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Desktop view
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        # Go to home
        await page.goto('http://localhost:8080/')
        await asyncio.sleep(2)
        await page.screenshot(path='/home/jules/verification/home_th.png')

        # Click language toggle (Desktop)
        # It's a button with 'EN' or 'TH' text inside the navbar
        # Try both selectors to be safe
        try:
            await page.click('button:has-text("EN")')
        except:
            await page.click('button:has-text("TH")')

        await asyncio.sleep(1)
        await page.screenshot(path='/home/jules/verification/home_en.png')

        # Go to a category page
        await page.goto('http://localhost:8080/category/%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B9%82%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%96%E0%B8%99%E0%B8%99')
        await asyncio.sleep(2)
        await page.screenshot(path='/home/jules/verification/category_en.png')

        await browser.close()

if __name__ == '__main__':
    if not os.path.exists('/home/jules/verification'):
        os.makedirs('/home/jules/verification')
    asyncio.run(verify())
