import { test, expect } from '@playwright/test';

test('button reactive test flow', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/button_reactive/');

  // Check the <p> contains "OK"
  const p = page.locator('p');
  await expect(p).toHaveText('OK');

  // Check there are 3 buttons on the page
  const buttons = page.locator('button');
  const buttonCount = await buttons.count();
  expect(buttonCount).toEqual(3);

  // Click first button with label "Worked?"
  await buttons.nth(0).click();
  await expect(p).toHaveText('Changed!');

  // Click second button with label "Returned?"
  await buttons.nth(1).click();
  await expect(p).toHaveText('OK');

  // Click third button with label "And now?"
  await buttons.nth(2).click();
  await expect(p).toHaveText('-----');

  // After 3 seconds, <p> value is "Changed!"
  await page.waitForTimeout(3000);
  await expect(p).toHaveText('Changed!');

  // After 6 seconds (3 more seconds), <p> value is "YES YES!!!!"
  await page.waitForTimeout(3000);
  await expect(p).toHaveText('YES YES!!!!');
});
