import { test, expect } from '@playwright/test';

test('renders the conditional div when ok is truthy', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/if_directive/simple_and_direct_before/');

  // Scope to the root container
  const app = page.locator('#app');

  // Locate only the direct child div (not the root #app)
  const conditionalDiv = app.locator(':scope > div', { hasText: 'Is it working?' });

  // Expect it to be visible and have the correct text
  await expect(conditionalDiv).toBeVisible();
  await expect(conditionalDiv).toHaveText(/Is it working\?/);

  // Verify the h1 content
  const header = app.locator('h1[name="ok"]');
  await expect(header).toHaveText('Before');


  // Verify the DOM order: Before -> div
  const bodyHTML = await page.locator('body').innerHTML();
  const beforeIndex = bodyHTML.indexOf('Before');
  const divIndex = bodyHTML.indexOf('Is it working?');

  expect(beforeIndex).toBeLessThan(divIndex);
});
