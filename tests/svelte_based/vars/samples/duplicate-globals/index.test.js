import { test, expect } from '@playwright/test';

test('duplicate-globals scripts run correctly', async ({ page }) => {
  const messages = [];

  // Capture console logs
  page.on('console', msg => {
    messages.push(msg.text());
  });

  await page.goto('http://localhost:5173/tests/svelte_based/vars/samples/duplicate-globals/index.html');

  // Give time for console logs to appear
  await page.waitForTimeout(500);

  // Check logs include 1 and 2
  expect(messages).toContain('1');
  expect(messages).toContain('2');
});
