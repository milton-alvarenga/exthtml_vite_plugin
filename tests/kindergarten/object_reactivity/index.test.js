import { test, expect } from '@playwright/test';

test('object reactivity test', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/object_reactivity/');

  const app = page.locator('#app') || page.locator('body'); // container of text
  const btnA = page.locator('button', { hasText: 'Change A' });
  const btnB = page.locator('button', { hasText: 'Change B' });
  const btnC = page.locator('button', { hasText: 'Change C' });

  // Initial values
  let a = 1;
  let b = 2;
  let c = 3;

  await expect(app).toContainText(`A: ${a}`);
  await expect(app).toContainText(`B: ${b}`);
  await expect(app).toContainText(`C: ${c}`);

  // --- Click Change A 5 times ---
  for (let i = 0; i < 5; i++) {
    await btnA.click();
    a += 1;
    await expect(app).toContainText(`A: ${a}`);
  }

  // --- Click Change B 5 times ---
  for (let i = 0; i < 5; i++) {
    await btnB.click();
    b *= 2;
    await expect(app).toContainText(`B: ${b}`);
  }

  // --- Click Change C 5 times ---
  for (let i = 0; i < 5; i++) {
    await btnC.click();
    c *= 3;
    await expect(app).toContainText(`C: ${c}`);
  }
});
