import { test, expect } from '@playwright/test';

test('console variable shadowed and module script logs', async ({ page }) => {
  const messages = [];

  // Capture console logs from the page
  page.on('console', msg => {
    messages.push(msg.text());
  });

  await page.goto('http://localhost:5173/tests/svelte_based/vars/samples/duplicate-non-hoistable/index.html');

  // Wait a bit for logs
  await page.waitForTimeout(300);

  // 1 should be logged
  expect(messages).toContain('1');

  // <p> should contain "42"
  const p = page.locator('p');
  await expect(p).toHaveText('42');
});
