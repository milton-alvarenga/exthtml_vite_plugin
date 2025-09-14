import { test, expect } from '@playwright/test';

test('module vs instance and local variables', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/svelte_based/vars/samples/modules-vars/index.html');

  // Verify visible output
  const body = page.locator('body');

  await expect(body).toContainText('a: 1');
  await expect(body).toContainText('b: [object Object]');
  await expect(body).toContainText('c: 1');
  await expect(body).toContainText('d: [object Object]');
});
