import { test, expect } from '@playwright/test';

test('module vs instance variable scope', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/svelte_based/vars/samples/duplicate-vars/index.html');

  const p = page.locator('p');
  await expect(p).toHaveText('2');
});
