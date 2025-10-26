import { test, expect } from '@playwright/test';

test('reactive count and tripleCount with reset logic', async ({ page }) => {
  // Go to the page
  await page.goto('http://localhost:5173/tests/kindergarten/circular_change/js_fn_change_for_reactiveness_conditional/');
  const app = page.locator('#app');
  const button = app.getByRole('button', { name: 'Count++' });

  // 1️⃣ Initial state
  await expect(app.locator('text=Count: 0')).toBeVisible();
  await expect(app.locator('text=Triple Count: 0')).toBeVisible();

  // 2️⃣ Click 1 → count = 1, tripleCount = 3
  await button.click();
  await expect(app.locator('text=Count: 1')).toBeVisible();
  await expect(app.locator('text=Triple Count: 3')).toBeVisible();

  // 3️⃣ Click 2 → count = 2, tripleCount = 6
  await button.click();
  await expect(app.locator('text=Count: 2')).toBeVisible();
  await expect(app.locator('text=Triple Count: 6')).toBeVisible();

  // 4️⃣ Click 3 → tripleCount = 9 > 6 ⇒ reset count = 0
  await button.click();
  await expect(app.locator('text=Count: 0')).toBeVisible();
  await expect(app.locator('text=Triple Count: 0')).toBeVisible();

  // 5️⃣ Click again to verify it restarts correctly
  await button.click();
  await expect(app.locator('text=Count: 1')).toBeVisible();
  await expect(app.locator('text=Triple Count: 3')).toBeVisible();
});
