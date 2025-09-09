import { test, expect } from '@playwright/test';

test('count all <a> elements on page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const linksCount = await page.locator('a').count();
  console.log('Total <a> elements:', linksCount);

  expect(linksCount).toEqual(11);
});

test('click all <a> elements and check page opens correctly in parallel', async ({ browser }) => {
  test.slow();

  const baseUrl = 'http://localhost:5173/';
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(baseUrl);

  const links = page.locator('a');
  const count = await links.count();

  // Collect all hrefs first (so we don't lose them after navigating)
  const hrefs = [];
  for (let i = 0; i < count; i++) {
    hrefs.push(await links.nth(i).getAttribute('href') || '');
  }

  // Run all tests in parallel
  await Promise.all(
    hrefs.map(async (href) => {
      if (!href) return;

      const newPage = await context.newPage();
      await newPage.goto(baseUrl + href, { waitUntil: 'load', timeout: 5000 });

      // Check page errors (assuming your app logs them)
      const pageErrors = await newPage.evaluate(() => (window).jsErrors || []);
      expect(pageErrors.length).toBe(0);

      await newPage.close();
    })
  );

  await context.close();
});
