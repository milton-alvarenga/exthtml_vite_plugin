import { test, expect } from '@playwright/test';

test('simple_and_direct if directive works correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/if_directive/simple_and_direct_both/');

  // Scope inside #app (the component mount point)
  const app = page.locator('#app');

  // Check both <h1> elements exist and have correct text
  const headers = app.locator('h1[name="ok"]');
  await expect(headers).toHaveCount(2);
  await expect(headers.nth(0)).toHaveText('Before');
  await expect(headers.nth(1)).toHaveText('After');

  // Check the conditional <div> is rendered between them
  const conditionalDiv = app.locator(':scope > div', { hasText: 'Is it working?' });
  await expect(conditionalDiv).toBeVisible();
  await expect(conditionalDiv).toHaveText('Is it working?');

  // Verify the DOM order: Before -> div -> After
  const bodyHTML = await page.locator('body').innerHTML();
  const beforeIndex = bodyHTML.indexOf('Before');
  const divIndex = bodyHTML.indexOf('Is it working?');
  const afterIndex = bodyHTML.indexOf('After');

  expect(beforeIndex).toBeLessThan(divIndex);
  expect(divIndex).toBeLessThan(afterIndex);
});