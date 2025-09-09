import { test, expect } from '@playwright/test';

test('extHTML input reactivity and red class', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/input_reactivity_with_event/'); // adjust URL

  const input = page.locator('input[type="text"]');
  const output = page.locator('div, body'); // container displaying "a = _text"

  // Initial state
  await expect(input).toHaveValue('ok');
  await expect(input).not.toHaveClass(/a/); // red class should not be applied initially
  await expect(page.locator('body')).toContainText('a = ok');


  // Type a value that does NOT match /ok[0-9]+$/
  await input.fill('okXYZ');
  await expect(input).not.toHaveClass(/a/);
  await expect(page.locator('body')).toContainText('a = okXYZ');


  // Type a value that DOES match /ok[0-9]+$/ (e.g., "ok123")
  await input.fill('ok123');
  await expect(input).toHaveClass(/a/); // red class applied
  await expect(page.locator('body')).toContainText('a = ok123');


  // Type another matching value
  await input.fill('ok4567');
  await expect(input).toHaveClass(/a/);
  await expect(page.locator('body')).toContainText('a = ok4567');


  // Clear input or set non-matching again
  await input.fill('okABC');
  await expect(input).not.toHaveClass(/a/);
  await expect(page.locator('body')).toContainText('a = okABC');
});