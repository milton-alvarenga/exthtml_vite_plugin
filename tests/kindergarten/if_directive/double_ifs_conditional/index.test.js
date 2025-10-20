import { test, expect } from '@playwright/test';

test('if_directive toggles elements correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/if_directive/double_ifs_conditional/');

  // Header check
  await expect(page.locator('h1')).toHaveText('IF Directive');

  // Initial state
  await expect(page.locator('p')).toContainText(['Current count value is 0']);
  await expect(page.locator('p')).toContainText(['I am odd']);
  await expect(page.locator('p')).not.toContainText(['I am even']);

  const button = page.locator('button');
  await expect(button).toHaveText('Add +1 on count');

  // --- Click 1 ---
  await button.click();
  await expect(page.locator('p')).toContainText(['Current count value is 1']);
  await expect(page.locator('p')).toContainText(['I am even']);
  await expect(page.locator('p')).not.toContainText(['I am odd']);

  // --- Click 2 ---
  await button.click();
  await expect(page.locator('p')).toContainText(['Current count value is 2']);
  await expect(page.locator('p')).toContainText(['I am odd']);
  await expect(page.locator('p')).not.toContainText(['I am even']);

  // --- Click 3 ---
  await button.click();
  await expect(page.locator('p')).toContainText(['Current count value is 3']);
  await expect(page.locator('p')).toContainText(['I am even']);
  await expect(page.locator('p')).not.toContainText(['I am odd']);
});
