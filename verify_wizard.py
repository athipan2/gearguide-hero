import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        try:
            print("Navigating to homepage...")
            await page.goto("http://localhost:8080/")
            # Wait for auto-popup (sessionStorage should be empty in a new browser context)
            await page.wait_for_timeout(3000)

            # Check if wizard is open
            print("Checking if wizard is open...")
            wizard = await page.query_selector("h2:has-text('Find Your Perfect Pair')")
            if wizard:
                print("Wizard opened automatically!")
            else:
                print("Wizard NOT opened automatically. Trying manual click...")
                await page.click("button:has-text('ช่วยเลือกจากเป้าหมาย')")
                await page.wait_for_timeout(1000)

            await page.screenshot(path="verification/wizard_after_fix.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
