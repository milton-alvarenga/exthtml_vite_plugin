import { test, expect } from "@playwright/test";

const url = "http://localhost:5173/tests/kindergarten/for_directive/double_array_dynamic/"

test.describe('double *for directive – independent reconciliation', () => {

	const table1 = '#app table:nth-of-type(1)';
	const table2 = '#app table:nth-of-type(2)';

	function rows(page, table) {
		return page.locator(`${table} tr`);
	}

	async function rowHandles(page, table) {
		const locator = rows(page, table);
		return await locator.elementHandles();
	}

	async function rowTexts(page, table) {
		const locator = rows(page, table);
		return (await locator.allTextContents()).map(text => text.trim());
	}

	test.beforeEach(async ({ page }) => {
		await page.goto(url);
	});

	// ─────────────────────────────────────────────
	// 1. Initial state
	// ─────────────────────────────────────────────
	test('initial render is correct for both arrays', async ({ page }) => {
		await expect(await rowTexts(page, table1))
			.toEqual(['A', 'B', 'C', 'D', 'E']);

		await expect(await rowTexts(page, table2))
			.toEqual(['a', 'b', 'c', 'd', 'e']);
	});

	// ─────────────────────────────────────────────
	// 2. Push affects only its own table
	// ─────────────────────────────────────────────
	test('push on items does not affect items2', async ({ page }) => {

		const h1Before = await rowHandles(page, table1);
		const h2Before = await rowHandles(page, table2);

		await page.click('text=Add item');

		const h1After = await rowHandles(page, table1);
		const h2After = await rowHandles(page, table2);

		// table1: identity preserved + new node
		for (let i = 0; i < h1Before.length; i++) {
			expect(h1After[i]).toBe(h1Before[i]);
		}
		expect(h1After.length).toBe(h1Before.length + 1);

		// table2: completely untouched
		for (let i = 0; i < h2Before.length; i++) {
			expect(h2After[i]).toBe(h2Before[i]);
		}
	});

	// ─────────────────────────────────────────────
	// 3. Interleaved operations
	// ─────────────────────────────────────────────
	test('interleaved mutations do not interfere', async ({ page }) => {

		await page.click('text=Unshift item');      // items
		await page.click('text=Add item', { nth: 1 }); // items2
		await page.click('text=Insert X at 2');     // items
		await page.click('text=Reverse items', { nth: 1 }); // items2

		const t1 = await rowTexts(page, table1);
		const t2 = await rowTexts(page, table2);

		expect(t1).toEqual(['X', 'A', 'X', 'B', 'C', 'D', 'E']);
		expect(t2).toEqual(['f', 'e', 'd', 'c', 'b', 'a']);
	});

	// ─────────────────────────────────────────────
	// 4. Replace preserves DOM identity
	// ─────────────────────────────────────────────
	test('replace updates text but preserves DOM node (both tables)', async ({ page }) => {

		const h1Before = await rowHandles(page, table1);
		const h2Before = await rowHandles(page, table2);

		await page.click('text=Replace item at 2 with Z');
		await page.click('text=Replace item at 2 with Z', { nth: 1 });

		const h1After = await rowHandles(page, table1);
		const h2After = await rowHandles(page, table2);

		expect(h1After[2]).toBe(h1Before[2]);
		expect(h2After[2]).toBe(h2Before[2]);

		expect(await rowTexts(page, table1))[2].toBe('Z');
		expect(await rowTexts(page, table2))[2].toBe('z');
	});

	// ─────────────────────────────────────────────
	// 5. Swap nodes correctly
	// ─────────────────────────────────────────────
	test('swap reorders DOM nodes correctly (identity moves)', async ({ page }) => {

		const h1Before = await rowHandles(page, table1);
		const h2Before = await rowHandles(page, table2);

		await page.click('text=Swap 1 and 3');
		await page.click('text=Swap 1 and 3', { nth: 1 });

		const h1After = await rowHandles(page, table1);
		const h2After = await rowHandles(page, table2);

		expect(h1After[3]).toBe(h1Before[1]);
		expect(h2After[3]).toBe(h2Before[1]);
	});

	// ─────────────────────────────────────────────
	// 6. Clear + re-add independently
	// ─────────────────────────────────────────────
	test('clear and re-add works independently', async ({ page }) => {

		await page.click('text=Clear items');
		await page.click('text=Clear items', { nth: 1 });

		await expect(await rowTexts(page, table1)).toEqual([]);
		await expect(await rowTexts(page, table2)).toEqual([]);

		await page.click('text=Re-add A,B,C');
		await page.click('text=Re-add A,B,C', { nth: 1 });

		await expect(await rowTexts(page, table1)).toEqual(['A', 'B', 'C']);
		await expect(await rowTexts(page, table2)).toEqual(['a', 'b', 'c']);
	});
	// ─────────────────────────────────────────────
	// 7. Stress test – random ops per list
	// ─────────────────────────────────────────────
	test('stress test: random independent mutations', async ({ page }) => {

		for (let i = 0; i < 30; i++) {
			await page.evaluate(() => {
				const ops = ['push', 'pop', 'unshift', 'reverse', 'splice'];
				const op = ops[Math.floor(Math.random() * ops.length)];

				if (op === 'push') window.items.push('X');
				if (op === 'pop') window.items.pop();
				if (op === 'unshift') window.items.unshift('Y');
				if (op === 'reverse') window.items.reverse();
				if (op === 'splice' && window.items.length)
					window.items.splice(1, 0, 'Z');
			});

			await page.evaluate(() => {
				const ops = ['push', 'pop', 'unshift', 'reverse', 'splice'];
				const op = ops[Math.floor(Math.random() * ops.length)];

				if (op === 'push') window.items2.push('x');
				if (op === 'pop') window.items2.pop();
				if (op === 'unshift') window.items2.unshift('y');
				if (op === 'reverse') window.items2.reverse();
				if (op === 'splice' && window.items2.length)
					window.items2.splice(1, 0, 'z');
			});

			const dom1 = await rowTexts(page, table1);
			const dom2 = await rowTexts(page, table2);

			const js1 = await page.evaluate(() => window.items);
			const js2 = await page.evaluate(() => window.items2);

			expect(dom1).toEqual(js1);
			expect(dom2).toEqual(js2);
		}
	});
});