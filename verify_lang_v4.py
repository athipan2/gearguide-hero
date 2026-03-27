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
        print("Navigating to home...")
        await page.goto('http://localhost:8080/')
        await page.wait_for_load_state('networkidle')
        await asyncio.sleep(5) # Give it extra time for hydration

        # Take a larger screenshot
        await page.screenshot(path='/home/jules/verification/v4_home_th.png', full_page=True)

        # Try to click the language toggle by looking for 'EN'
        print("Attempting to toggle language...")
        await page.evaluate("() => { const btns = Array.from(document.querySelectorAll('button')); const enBtn = btns.find(b => b.innerText.includes('EN') || b.innerText.includes('English')); if (enBtn) enBtn.click(); }")

        await asyncio.sleep(2)
        await page.screenshot(path='/home/jules/verification/v4_home_en.png', full_page=True)

        await browser.close()

if __name__ == '__main__':
    if not os.path.exists('/home/jules/verification'):
        os.makedirs('/home/jules/verification')
    asyncio.run(verify())
