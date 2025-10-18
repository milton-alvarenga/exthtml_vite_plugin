import { test, expect } from '@playwright/test';

test('simple_and_direct if directive works correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/if_directive/simple_and_direct_after/');

  // Scope inside #app (the component mount point)
  const app = page.locator('#app');

  // Find the generated div (not the root div#app)
  const conditionalDiv = app.locator(':scope > div', { hasText: 'Is it working?' });
  await expect(conditionalDiv).toBeVisible();
  await expect(conditionalDiv).toHaveText('Is it working?');

  // Check the <h1> element
  const header = app.locator('h1[name="ok"]');
  await expect(header).toHaveText('After');

  // Verify order in DOM: <div> before <h1>
  const html = await app.innerHTML();
  const divIndex = html.indexOf('Is it working?');
  const h1Index = html.indexOf('After');
  expect(divIndex).toBeLessThan(h1Index);
});