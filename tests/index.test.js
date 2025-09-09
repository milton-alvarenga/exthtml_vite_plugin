import { test, expect } from '@playwright/test';

test('count all <a> elements on page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const linksCount = await page.locator('a').count();
  console.log('Total <a> elements:', linksCount);
  
  expect(linksCount).toEqual(11);
});

test('click all <a> elements and check page opens correctly', async ({ page }) => {
  test.slow();
  await page.goto('http://localhost:5173/');
  
  const links = page.locator('a');
  const count = await links.count();

  for (let i = 0; i < count; i++) {
    // Use Promise.all to wait for navigation after click if any
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load', timeout: 5000 }).catch(() => {}),
      links.nth(i).click()
    ]);

    // Check page error (you can customize this depending on your app)
    const pageErrors = await page.evaluate(() => window.jsErrors || []);
    expect(pageErrors.length).toBe(0);

    // Optional: Go back to main page if navigation happened
    if (page.url() !== 'http://localhost:5173/') {
      await page.goto('http://localhost:5173/');
    }
  }
});
