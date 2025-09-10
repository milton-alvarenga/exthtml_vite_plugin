import { test, expect } from '@playwright/test';

test('implicit reactive vars render correctly', async ({ page }) => {
  // Navigate to your test page
  await page.goto('http://localhost:5173/tests/svelte_based/vars/samples/implicit-reactive/index.html');

  // Locate the paragraph
  const p = page.locator('p');

  // Check that it has the expected text
  await expect(p).toHaveText('1 + 1 = 2');
});
