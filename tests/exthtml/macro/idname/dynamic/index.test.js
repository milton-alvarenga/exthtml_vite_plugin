import { test, expect } from '@playwright/test';

test('macro idname should render correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/exthtml/macro/idname/dynamic/index.html');

  const paragraph = page.locator('#idname_here');

  // Check that the paragraph exists with correct text
  await expect(paragraph).toHaveText('idname_here');

  // Check that the sibling text is also present
  await expect(page.locator('body')).toContainText('Is it ok?');

  // Verify that the CSS is applied (color: red)
  let color = await paragraph.evaluate(el => getComputedStyle(el).color);
  expect(color).toBe('rgb(255, 0, 0)'); // red in RGB

  const btnChange = page.locator('button', { hasText: 'Change' });

  await btnChange.click();

  // Check that the paragraph exists with correct text
  const paragraph2 = page.locator('#ok');
  await expect(paragraph2).toHaveText('ok');

  // Check that the sibling text is also present
  await expect(page.locator('body')).toContainText('Is it ok?');

  // Verify that the CSS is applied (color: red)
  color = await paragraph2.evaluate(el => getComputedStyle(el).color);
  expect(color).toBe('rgb(0, 0, 0)'); // red in RGB

  await btnChange.click();

  // Check that the paragraph exists with correct text
  await expect(paragraph).toHaveText('idname_here');

  // Check that the sibling text is also present
  await expect(page.locator('body')).toContainText('Is it ok?');

  // Verify that the CSS is applied (color: red)
  color = await paragraph.evaluate(el => getComputedStyle(el).color);
  expect(color).toBe('rgb(255, 0, 0)'); // red in RGB
});
