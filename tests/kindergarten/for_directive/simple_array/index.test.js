import { test, expect } from '@playwright/test';

test("simple array for-directive renders correctly", async ({ page }) => {
	await page.goto("http://localhost:5173/tests/kindergarten/for_directive/simple_array/");

	// Wait for ExtHTML to mount inside #app
	await page.waitForSelector("#app table");

	const rows = await page.locator("#app table tr").allTextContents();

    // Trim whitespace from each cell and then compare
  	const trimmedrows = rows.map(rows => rows.trim());

	expect(trimmedrows).toEqual(["A", "B", "C", "D", "E"]);

  	const cells = await page.locator("#app table tr td").allTextContents();
  	// Trim whitespace from each cell and then compare
  	const trimmedCells = cells.map(cell => cell.trim());
  	expect(trimmedCells).toEqual(["A", "B", "C", "D", "E"]);
});