import { test, expect } from '@playwright/test';

test('should show alert "test" and render Hello World paragraph', async ({ page }) => {
    
    await page.goto('http://localhost:5173/tests/kindergarten/script_on_html/');

    // Listen for the alert dialog
    const dialogPromise = page.waitForEvent('dialog');
    
    // Wait for and check the alert
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


