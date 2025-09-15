import { test, expect } from '@playwright/test';

test('check attributes and reactivity', async ({ page }) => {
    await page.goto('http://localhost:5173/tests/kindergarten/check_attributes/');

    const firstP = page.locator('#idname_here');

    // --- Initial state checks ---
    await expect(firstP).toHaveText('idname_here');
    await expect(firstP).toHaveAttribute('title', 'idname_here');
    await expect(firstP).toBeHidden(); // because hidden={true}

    // The "hidden" <p> should be visible because visible = true
    await expect(page.locator('p', { hasText: 'hidden' })).toBeVisible();

    // Input bound to _text
    const input = page.locator('input[type="text"]');
    await expect(input).toHaveValue('ok');
    await expect(page.locator('body')).toContainText('= ok');

    // --- Test input reactivity ---
    await input.fill('ok123');
    await expect(page.locator('body')).toContainText('= ok123');

    // --- Test Change nm button ---
    await page.getByRole('button', { name: 'Change nm' }).click();
    const newP = page.locator('#OK'); // nm should now be "OK"
    await expect(newP).toHaveText('OK');
    await expect(newP).toHaveAttribute('title', 'OK');

    // Click again -> back to "idname_here"
    await page.getByRole('button', { name: 'Change nm' }).click();
    const backP = page.locator('#idname_here');
    await expect(backP).toHaveText('idname_here');

    // --- Test Toggle visibility ---
    const toggleBtn = page.getByRole('button', { name: 'Toggle visibility' });

    // First click -> visible = false => first <p> is shown, "hidden" <p> is hidden
    await toggleBtn.click();
    await expect(page.locator('#idname_here')).toBeVisible();
    await expect(page.locator('p', { hasText: 'hidden' })).toBeHidden();

    // Click again -> visible = true => first <p> is hidden, "hidden" <p> is visible
    await toggleBtn.click();
    await expect(page.locator('#idname_here')).toBeHidden();
    await expect(page.locator('p', { hasText: 'hidden' })).toBeVisible();

    // --- CSS test (everything on component is red. On body is black) ---

    // Paragraphs should be red
    const paragraphs = page.locator('p');
    for (let i = 0; i < await paragraphs.count(); i++) {
        const color = await paragraphs.nth(i).evaluate(el => getComputedStyle(el).color);
        expect(color).toBe('rgb(255, 0, 0)'); // red
    }

    // Buttons should be red
    const buttons = page.locator('button');
    for (let i = 0; i < await buttons.count(); i++) {
        const color = await buttons.nth(i).evaluate(el => getComputedStyle(el).color);
        expect(color).toBe('rgb(255, 0, 0)'); // red
    }

    // Input should be red
    const inputColor = await page.locator('input[type="text"]').evaluate(el => getComputedStyle(el).color);
    expect(inputColor).toBe('rgb(255, 0, 0)'); // red

    const divColor = await page.locator('#app').evaluate(el => getComputedStyle(el).color);
    expect(divColor).toBe('rgb(0, 0, 0)'); // black

});
