import { test, expect } from '@playwright/test';

test('events on buttons and flag class toggle', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/events_on_btn/');

  const p = page.locator('p');

  // Use exact labels
  const btnFn = page.getByRole('button', { name: 'fn', exact: true });
  const btnFnWithParam = page.getByRole('button', { name: 'fn(with_parameter)', exact: true });
  const btnFnParens = page.getByRole('button', { name: 'fn()', exact: true });
  const btnAssign = page.getByRole('button', { name: 'ok = "OK"', exact: true });
  const btnArrow = page.getByRole('button', { name: 'Arrow function', exact: true });
  const btnArrowBracket = page.getByRole('button', { name: 'Arrow function with bracket', exact: true });
  const btnFnVarNoParam = page.getByRole('button', { name: 'Function as var without parameter', exact: true });
  const btnFnVarWithParam = page.getByRole('button', { name: 'Function as var with parameter', exact: true });
  const btnArrowVarNoParam = page.getByRole('button', { name: 'Arrow Function as var without parameter', exact: true });
  const btnArrowVarWithParam = page.getByRole('button', { name: 'Arrow Function as var with parameter', exact: true });

  const h1Dynamic = page.getByRole('heading', { name: 'Dynamic Class' });
  const h1Directive = page.getByRole('heading', { name: 'Class directive' });
  const btnToggleFlag = page.getByRole('button', { name: 'Mude', exact: true });

  // Initial state
  await expect(p).toHaveText('OK');
  await expect(h1Dynamic).toHaveClass(/h1/);
  await expect(h1Directive).toHaveClass(/h1/);

  // fn button
  await btnFn.click();
  await expect(p).toHaveText('ChangedOk!');

  // fn(with_parameter)
  await btnFnWithParam.click();
  await expect(p).toHaveText('changed');

  // fn()
  await btnFnParens.click();
  await expect(p).toHaveText('ChangedOk!');

  // ok = "OK"
  await btnAssign.click();
  await expect(p).toHaveText('OK assignment');

  // Arrow function
  await btnArrow.click();
  await expect(p).toHaveText('OK arrow');

  // Arrow function with bracket
  await btnArrowBracket.click();
  await expect(p).toHaveText('OK arrow with bracket.');

  // Function as var without parameter
  await btnFnVarNoParam.click();
  await expect(p).toHaveText('[object PointerEvent]');

  // Function as var with parameter
  await btnFnVarWithParam.click();
  await expect(p).toHaveText('changed');

  // Arrow Function as var without parameter
  await btnArrowVarNoParam.click();
  await expect(p).toHaveText('[object PointerEvent]');

  // Arrow Function as var with parameter
  await btnArrowVarWithParam.click();
  await expect(p).toHaveText('changedByNamedArrow');

  // Toggle flag class
  let h1_regexp = /exthtml-[a-z0-9]+-h1/
  
  await expect(h1Directive).toHaveClass(h1_regexp);
  await expect(h1Dynamic).toHaveClass(h1_regexp);

  await btnToggleFlag.click();
  await expect(h1Dynamic).not.toHaveClass(h1_regexp);
  await expect(h1Directive).not.toHaveClass(h1_regexp);
  
  await btnToggleFlag.click();
  await expect(h1Dynamic).toHaveClass(h1_regexp);
  await expect(h1Dynamic).toHaveClass(h1_regexp);
});
