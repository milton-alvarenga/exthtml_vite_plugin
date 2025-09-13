import { test, expect } from '@playwright/test';

test('should show alert "test" and render Hello World paragraph', async ({ page }) => {

    // Start waiting for the dialog *before* navigating
    const dialogPromise = page.waitForEvent('dialog');

    page.goto('http://localhost:5173/tests/kindergarten/script_on_html/');

    const dialog = await dialogPromise;

    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('test');
    await dialog.accept();

    const paragraph = page.locator('p');

    // Get the computed CSS value of "color"
    const color = await paragraph.evaluate((el) =>
        window.getComputedStyle(el).color
    );

    expect(color).toBe('rgb(255, 0, 0)'); // red in RGB

    // Check that the <p> element contains "Hello World"
    await expect(paragraph).toHaveText('Hello World');
});
