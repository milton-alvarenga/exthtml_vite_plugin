import { test, expect } from '@playwright/test';

test('ExtHTML reactive triple count test', async ({ page }) => {
  // Go to the page
  await page.goto('http://localhost:5173/tests/kindergarten/circular_change/js_conditional_change/');
  const app = page.locator('#app');

  // 1️⃣ Initial state
  await expect(app.locator('text=Count: 0')).toBeVisible();
  await expect(app.locator('text=Triple Count: 0')).toBeVisible();

  const button = app.getByRole('button', { name: 'Count++' });

  // 2️⃣ Click several times to increase count
  for (let i = 0; i < 3; i++) {
    await button.click();
  }

  // Now Count should be 3, tripleCount should still show 0 (non-reactive)
  await expect(app.locator('text=Count: 3')).toBeVisible();
  await expect(app.locator('text=Triple Count: 9')).toBeVisible();

  // 3️⃣ Click until count > 6 — tripleCount doesn’t reactively reset count
  for (let i = 0; i < 5; i++) {
    await button.click();
  }

  // Count should now be 8, tripleCount remains 0
  await expect(app.locator('text=Count: 8')).toBeVisible();
  await expect(app.locator('text=Triple Count: 24')).toBeVisible();

  await button.click();

  // 4️⃣ Ensure conditional reset didn’t happen dynamically
  await expect(app.locator('text=Count: 9')).toBeVisible();
});
