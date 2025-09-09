import { test, expect } from '@playwright/test';

test('counter with double and triple values', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/var_reactivity/');

  const app = page.locator('#app');
  const button = app.locator('button');

  // Initial state
  await expect(app).toContainText('Count: 1');
  await expect(app).toContainText('Double: 2');
  await expect(app).toContainText('Triple: 3');
  await expect(button).toHaveText('Add +1 on count');

  // After 1 click -> Count: 2, Double: 4, Triple: 6
  await button.click();
  await expect(app).toContainText('Count: 2');
  await expect(app).toContainText('Double: 4');
  await expect(app).toContainText('Triple: 6');

  // After 2 clicks -> Count: 3, Double: 6, Triple: 9
  await button.click();
  await expect(app).toContainText('Count: 3');
  await expect(app).toContainText('Double: 6');
  await expect(app).toContainText('Triple: 9');

  // After 10 total clicks (from initial Count=1) -> Count: 13, Double: 26, Triple: 39
  for (let i = 0; i < 10; i++) {
    await button.click();
  }
  await expect(app).toContainText('Count: 13');
  await expect(app).toContainText('Double: 26');
  await expect(app).toContainText('Triple: 39');
});
