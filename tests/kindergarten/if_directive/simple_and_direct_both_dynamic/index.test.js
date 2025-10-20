import { test, expect } from '@playwright/test';

test('dynamic if-directives: presence and DOM order before/after toggles', async ({ page }) => {
  await page.goto('http://localhost:5173/tests/kindergarten/if_directive/simple_and_direct_both_dynamic/');

  const btnBefore = page.getByRole('button', { name: 'Change before state', exact: true });
  const btnAfter  = page.getByRole('button', { name: 'Change after state', exact: true });
  const btnOk     = page.getByRole('button', { name: 'Change ok state', exact: true });

  // Helper function: check order of elements inside #app (runs in browser context)
  const getPositions = async () => {
    return page.evaluate(() => {
      const root = document.querySelector('#app');
      if (!root) return { beforeIdx: -1, middleIdx: -1, afterIdx: -1 };

      const children = Array.from(root.children);
      const textOf = (el) => (el.textContent || '').trim();

      const findIndex = (predicate) => {
        for (let i = 0; i < children.length; i++) {
          const el = children[i];
          if (predicate(textOf(el), el)) return i;
        }
        return -1;
      };

      const beforeIdx = findIndex((txt, el) =>
        txt === 'Before' &&
        el.tagName.toLowerCase() === 'h1' &&
        el.getAttribute('name') === 'ok'
      );

      const middleIdx = findIndex((txt, el) =>
        txt.includes('Is it working?') &&
        el.tagName.toLowerCase() === 'div'
      );

      const afterIdx = findIndex((txt, el) =>
        txt === 'After' &&
        el.tagName.toLowerCase() === 'h1' &&
        el.getAttribute('name') === 'ok'
      );

      return { beforeIdx, middleIdx, afterIdx };
    });
  };

  // ---- Initial state ----
  let pos = await getPositions();
  expect(pos.beforeIdx).toBeGreaterThanOrEqual(0);
  expect(pos.middleIdx).toBeGreaterThanOrEqual(0);
  expect(pos.afterIdx).toBeGreaterThanOrEqual(0);
  expect(pos.beforeIdx).toBeLessThan(pos.middleIdx);
  expect(pos.middleIdx).toBeLessThan(pos.afterIdx);

  // ---- Toggle BEFORE ----
  await btnBefore.click();
  pos = await getPositions();
  expect(pos.beforeIdx).toBe(-1);
  expect(pos.middleIdx).toBeGreaterThanOrEqual(0);
  expect(pos.afterIdx).toBeGreaterThanOrEqual(0);
  expect(pos.middleIdx).toBeLessThan(pos.afterIdx);

  await btnBefore.click();
  pos = await getPositions();
  expect(pos.beforeIdx).toBeGreaterThanOrEqual(0);
  expect(pos.beforeIdx).toBeLessThan(pos.middleIdx);

  // ---- Toggle AFTER ----
  await btnAfter.click();
  pos = await getPositions();
  expect(pos.afterIdx).toBe(-1);
  expect(pos.beforeIdx).toBeGreaterThanOrEqual(0);
  expect(pos.middleIdx).toBeGreaterThanOrEqual(0);
  expect(pos.beforeIdx).toBeLessThan(pos.middleIdx);

  await btnAfter.click();
  pos = await getPositions();
  expect(pos.afterIdx).toBeGreaterThanOrEqual(0);
  expect(pos.middleIdx).toBeLessThan(pos.afterIdx);

  // ---- Toggle OK ----
  await btnOk.click();
  pos = await getPositions();
  expect(pos.middleIdx).toBe(-1);
  expect(pos.beforeIdx).toBeGreaterThanOrEqual(0);
  expect(pos.afterIdx).toBeGreaterThanOrEqual(0);
  expect(pos.beforeIdx).toBeLessThan(pos.afterIdx);

  await btnOk.click();
  pos = await getPositions();
  expect(pos.beforeIdx).toBeGreaterThanOrEqual(0);
  expect(pos.middleIdx).toBeGreaterThanOrEqual(0);
  expect(pos.afterIdx).toBeGreaterThanOrEqual(0);
  expect(pos.beforeIdx).toBeLessThan(pos.middleIdx);
  expect(pos.middleIdx).toBeLessThan(pos.afterIdx);
});
