import { test, expect } from '@playwright/test';

test('counter should increment to 10, switch to decrement, and switch back', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/var_modified_but_could_be_reseted/');

  const app = page.locator('#app');
  const button = app.locator('button');

  // Initial state
  await expect(app).toContainText('Count: 1');
  await expect(button).toHaveText('Add +1 on count');

  // Increment up to 10
  for (let i = 2; i <= 10; i++) {
    await button.click();
    await expect(app).toContainText(`Count: ${i}`);
  }

  // After the 10th click, button changes and count resets to 9
  await button.click();
  await expect(app).toContainText('Count: 9');
  await expect(button).toHaveText('Remove -1 on count');

  // Decrement down to 1
  for (let i = 8; i >= 1; i--) {
    await button.click();
    await expect(app).toContainText(`Count: ${i}`);
  }

  // At Count: 1, click once more -> flips back to increment mode
  await button.click();
  await expect(app).toContainText('Count: 2');
  await expect(button).toHaveText('Add +1 on count');
});
