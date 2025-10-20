import { test, expect } from '@playwright/test';


test('nested if directives toggle correctly and maintain hierarchy', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/if_directive/nested_ifs/');

  // Scope everything to inside #app
  const app = page.locator('#app');

  const btnFirst  = app.getByRole('button', { name: 'First Level change state' });
  const btnSecond = app.getByRole('button', { name: 'Second Level change state' });
  const btnThird  = app.getByRole('button', { name: 'Third Level change state' });
  const btnFourth = app.getByRole('button', { name: 'Fourth Level change state' });

  // Helper to extract visible div structure within #app
  async function getState() {
    return app.evaluate(node => {
      const findVisibleDiv = (text) => {
        const divs = Array.from(node.querySelectorAll(':scope > div, :scope div'));
        return divs.find(d => d.textContent.includes(text));
      };

      return {
        first: !!findVisibleDiv('First Level'),
        second: !!findVisibleDiv('Second Level'),
        third: !!findVisibleDiv('Third Level'),
        fourth: !!findVisibleDiv('Fourth Level'),
      };
    });
  }

  // Initial state: all visible
  let state = await getState();
  expect(state).toEqual({
    first: true,
    second: true,
    third: true,
    fourth: true,
  });

  // 1 Toggle FIRST → everything should disappear
  await btnFirst.click();
  state = await getState();
  expect(state).toEqual({
    first: false,
    second: false,
    third: false,
    fourth: false,
  });

  // Toggle FIRST again → restore all
  await btnFirst.click();
  state = await getState();
  expect(state).toEqual({
    first: true,
    second: true,
    third: true,
    fourth: true,
  });

  // 2 Toggle SECOND → hide 2–4
  await btnSecond.click();
  state = await getState();
  expect(state).toEqual({
    first: true,
    second: false,
    third: false,
    fourth: false,
  });

  await btnSecond.click();
  state = await getState();
  expect(state).toEqual({
    first: true,
    second: true,
    third: true,
    fourth: true,
  });

  // 3 Toggle THIRD → hide 3–4
  await btnThird.click();
  state = await getState();
  expect(state).toEqual({
    first: true,
    second: true,
    third: false,
    fourth: false,
  });

  await btnThird.click();
  state = await getState();
  expect(state).toEqual({
    first: true,
    second: true,
    third: true,
    fourth: true,
  });

  // 4 Toggle FOURTH → hide only 4
  await btnFourth.click();
  state = await getState();
  expect(state).toEqual({
    first: true,
    second: true,
    third: true,
    fourth: false,
  });

  await btnFourth.click();
  state = await getState();
  expect(state).toEqual({
    first: true,
    second: true,
    third: true,
    fourth: true,
  });
});
