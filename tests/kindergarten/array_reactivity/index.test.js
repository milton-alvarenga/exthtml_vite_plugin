import { test, expect } from '@playwright/test';

test('extHTML counter buttons test', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/array_reactivity/');

  const app = page.locator('#app');
  const btnA = app.locator('button', { hasText: 'Change A' });
  const btnB = app.locator('button', { hasText: 'Change B' });
  const btnC = app.locator('button', { hasText: 'Change C' });
  const btnD = app.locator('button', { hasText: 'Change D' });

  // Check initial state
  await expect(app).toContainText('A: 0');
  await expect(app).toContainText('B: 1');
  await expect(app).toContainText('C: 2');
  await expect(app).toContainText('D: 3');
  await expect(app).toContainText('E: 1');

  await expect(btnA).toHaveText('Change A');
  await expect(btnB).toHaveText('Change B');
  await expect(btnC).toHaveText('Change C');
  await expect(btnD).toHaveText('Change D');

  // --- Change D ---
  let D = 3;
  for (let i = 0; i < 5; i++) { // example: 5 clicks
    await btnD.click();
    D += 1;
    await expect(app).toContainText(`D: ${D}`);
  }

  // --- Change C ---
  let C = 2;
  for (let i = 0; i < 5; i++) { // example: 5 clicks
    await btnC.click();
    C *= 3;
    await expect(app).toContainText(`C: ${C}`);
  }

  // --- Change A (and E = A + B initially) ---
  let A = 0;
  let B = 1;
  let E = A + B;
  for (let i = 0; i < 5; i++) { // 5 clicks
    await btnA.click();
    A += 1;
    E = A + B;
    await expect(app).toContainText(`A: ${A}`);
    await expect(app).toContainText(`E: ${E}`);
  }

  // --- Change B (and update E = A + B) ---
  for (let i = 0; i < 5; i++) { // 5 clicks
    await btnB.click();
    B *= 2;
    E = A + B;
    await expect(app).toContainText(`B: ${B}`);
    await expect(app).toContainText(`E: ${E}`);
  }
});
