import { test, expect } from '@playwright/test';

test('check reactive classes and counter', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/check_classes/');

  const h1 = page.locator('h1');
  const counter = page.locator('body'); // contains {x} text
  const input = page.locator('input[type="text"]');
  const oddEven = page.locator('body');

  // Check initial h1 text
  await expect(h1).toHaveText('Check Classes variable changes');

  // Check initial value of x
  let xValue = parseInt(await counter.evaluate(el => el.innerText.match(/\d+/)?.[0] || '0'));
  expect(xValue).toBeGreaterThanOrEqual(1);

  // Function to check classes based on x
  async function checkClasses(x) {
    const classList = await h1.evaluate(el => Array.from(el.classList));
    if (x % 2 === 0) {
      expect(classList.some(c => c.endsWith('-red'))).toBe(true)
      expect(classList.some(c => c.endsWith('-blue'))).toBe(false)
    } else {
      expect(classList.some(c => c.endsWith('-blue'))).toBe(true)
      expect(classList.some(c => c.endsWith('-red'))).toBe(false)
    }
    if (x % 3 === 0) expect(classList.some(c => c.endsWith('-pink'))).toBe(true)
    else expect(classList.some(c => c.endsWith('-pink'))).toBe(false)
    if (x % 5 === 0) expect(classList.some(c => c.endsWith('-purple'))).toBe(true)
    else expect(classList.some(c => c.endsWith('-purple'))).toBe(false)
  }

  // Check initial classes
  await checkClasses(xValue);

  // Check input value and odd/even text
  await expect(input).toHaveValue(xValue.toString());
  await expect(oddEven).toContainText(xValue % 2 === 0 ? 'even' : 'odd');

  // Wait a few intervals and check reactive updates
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(1600); // wait slightly longer than interval
    xValue = parseInt(await counter.evaluate(el => el.innerText.match(/\d+/)?.[0] || '0'));
    await checkClasses(xValue);
    await expect(input).toHaveValue(xValue.toString());
    await expect(oddEven).toContainText(xValue % 2 === 0 ? 'even' : 'odd');
  }
});
