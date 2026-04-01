import asyncio
from playwright.async_api import async_playwright
import json
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        # Mock data with Thai labels
        mock_items = [
            {
                'name': 'Nike Alphafly 3',
                'brand': 'Nike',
                'price': '9,400 THB',
                'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
                'slug': 'nike-alphafly-3',
                'rating': 4.8,
                'badge': 'TOP PICK',
                'aspectRatings': [
                    {'label': 'การรับแรงกระแทก', 'score': 9.5},
                    {'label': 'การคืนตัว', 'score': 10}
                ],
                'specs': [
                    {'label': 'น้ำหนัก', 'value': '218g'},
                    {'label': 'ดรอป', 'value': '8mm'}
                ]
            }
        ]

        # Test Thai Language
        await page.goto('http://localhost:8080/')
        await page.evaluate(f"""
            localStorage.setItem('gear-comparison-storage', JSON.stringify({{
                'state': {{
                    'selectedItems': {json.dumps(mock_items)},
                    'version': 0
                }}
            }}));
            localStorage.setItem('language-storage', JSON.stringify({{
                'state': {{
                    'language': 'th'
                }}
            }}));
        """)

        await page.goto('http://localhost:8080/compare')
        await page.wait_for_selector('h1')

        # Check Thai content
        title = await page.inner_text('h1')
        print(f"Thai Title: {title}")

        # Check labels (should be Thai)
        labels = await page.query_selector_all('span.uppercase.tracking-widest')
        label_texts = [await l.inner_text() for l in labels]
        print(f"Thai Labels: {label_texts}")

        await page.screenshot(path='/home/jules/verification/lang_th.png')

        # Test English Language
        await page.evaluate("""
            localStorage.setItem('language-storage', JSON.stringify({
                'state': {
                    'language': 'en'
                }
            }));
        """)

        await page.reload()
        await page.wait_for_selector('h1')

        # Check English content
        title_en = await page.inner_text('h1')
        print(f"English Title: {title_en}")

        # Check labels (should be Translated to English)
        labels_en = await page.query_selector_all('span.uppercase.tracking-widest')
        label_texts_en = [await l.inner_text() for l in labels_en]
        print(f"English (Translated) Labels: {label_texts_en}")

        await page.screenshot(path='/home/jules/verification/lang_en.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
