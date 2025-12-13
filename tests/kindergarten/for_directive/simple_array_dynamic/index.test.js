import { test, expect } from "@playwright/test";

const url = "http://localhost:5173/tests/kindergarten/for_directive/simple_array_dynamic/"

test("dynamic *for directive reconciliation should be correct", async ({ page }) => {
	await page.goto(url);

	// Wait for ExtHTML to mount inside #app
	const table = page.locator("#app table");
	await expect(table).toBeVisible();

	// Utility function to get row texts
	const getRows = async () =>
		(await page.locator("#app table tr td").allTextContents()).map(text => text.trim());

	// Utility function to get TR references for stability checks
	const getRowHandles = async () =>
		await page.locator("#app table tr").elementHandles();

	// Initial state check
	let rows = await getRows();
	expect(rows.map(e=> e.trim())).toEqual(["A", "B", "C", "D", "E"]);

	let handlesBefore = await getRowHandles();

	//-----------------------------------------------------
	// 1️⃣ PUSH — ADD "F"
	//-----------------------------------------------------
	await page.getByRole("button", { name: "Add item" }).click();

	rows = await getRows();
	expect(rows.map(e=> e.trim())).toEqual(["A", "B", "C", "D", "E", "F"]);

	let handlesAfterPush = await getRowHandles();

	// (A) Check that all previous rows kept their DOM identity
	for (let i = 0; i < handlesBefore.length; i++) {
		expect(handlesAfterPush[i]).toBe(handlesBefore[i]);
	}

	// (B) Check that last row is a new DOM node (only F is newly created)
	expect(handlesAfterPush.at(-1)).not.toBe(handlesBefore.at(-1));

	//-----------------------------------------------------
	// 2️⃣ POP — REMOVE LAST ITEM
	//-----------------------------------------------------
	await page.getByRole("button", { name: "Remove item" }).click();

	rows = await getRows();
	expect(rows.map(e=> e.trim())).toEqual(["A", "B", "C", "D", "E"]); // back to original

	let handlesAfterPop = await getRowHandles();

	// (C) Original first 5 rows must still be exactly the same DOM nodes
	for (let i = 0; i < handlesBefore.length; i++) {
		expect(handlesAfterPop[i]).toBe(handlesBefore[i]);
	}

	//-----------------------------------------------------
	// 3️⃣ MULTIPLE MUTATIONS STRESS TEST
	//-----------------------------------------------------

	// push F, G, H
	await page.getByRole("button", { name: "Add item" }).click();
	await page.getByRole("button", { name: "Add item" }).click();
	await page.getByRole("button", { name: "Add item" }).click();

	rows = await getRows();
	expect(rows.map(e=> e.trim())).toEqual(["A", "B", "C", "D", "E", "F", "F", "F"]);

	let handlesAfterManyPushes = await getRowHandles();

	// (D) first 5 should remain stable
	for (let i = 0; i < handlesBefore.length; i++) {
		expect(handlesAfterManyPushes[i]).toBe(handlesBefore[i]);
	}

	// (E) last 3 must be new nodes
	expect(handlesAfterManyPushes[5]).not.toBe(handlesBefore[4]);
	expect(handlesAfterManyPushes[6]).not.toBe(handlesBefore[4]);
	expect(handlesAfterManyPushes[7]).not.toBe(handlesBefore[4]);

	//-----------------------------------------------------
	// 4️⃣ POP × 3 — REMOVE F, F, F
	//-----------------------------------------------------
	await page.getByRole("button", { name: "Remove item" }).click();
	await page.getByRole("button", { name: "Remove item" }).click();
	await page.getByRole("button", { name: "Remove item" }).click();

	rows = await getRows();
	expect(rows.map(e=> e.trim())).toEqual(["A", "B", "C", "D", "E"]);

	let handlesAfterFinal = await getRowHandles();

	// (F) Back to the original state, re-check DOM identity stability
	for (let i = 0; i < handlesBefore.length; i++) {
		expect(handlesAfterFinal[i]).toBe(handlesBefore[i]);
	}

	//-----------------------------------------------------
	// 5️⃣ Edge-case stress test: push/pop alternating
	//-----------------------------------------------------
	for (let i = 0; i < 5; i++) {
		await page.getByRole("button", { name: "Add item" }).click();
		await page.getByRole("button", { name: "Remove item" }).click();
	}

	rows = await getRows();
	expect(rows.map(e=> e.trim())).toEqual(["A", "B", "C", "D", "E"]);

	let handlesAfterStress = await getRowHandles();

	// (G) all nodes must STILL be the original DOM nodes
	for (let i = 0; i < handlesBefore.length; i++) {
		expect(handlesAfterStress[i]).toBe(handlesBefore[i]);
	}

	//-----------------------------------------------------
	// 6️⃣ Final assertion — DOM reconciliation is correct
	//-----------------------------------------------------
	console.log("All reconciliation tests passed.");
});

test.describe('dynamic *for directive reconciliation – FULL SUITE', () => {

	async function getRowHandles(page) {
		return await page.locator("table tr").elementHandles();
	}

	async function getRowTexts(page) {
		return (await page.locator("table tr").allTextContents()).map(text => text.trim());
	}

	test.beforeEach(async ({ page }) => {
		await page.goto(url);
	});

	// ─────────────────────────────────────────────────────────────
	// 1. PUSH TEST – identity must be preserved
	// ─────────────────────────────────────────────────────────────
	test("push: identity preserved + new at end", async ({ page }) => {

		const handlesBefore = await getRowHandles(page);
		const textsBefore = await getRowTexts(page);

		await page.click("text=Add item");

		const handlesAfter = await getRowHandles(page);
		const textsAfter = await getRowTexts(page);

		// (A) All existing rows must preserve identity
		for (let i = 0; i < handlesBefore.length; i++) {
			expect(handlesAfter[i]).toBe(handlesBefore[i]);
		}

		// (B) Last row must be new
		expect(handlesAfter[handlesAfter.length - 1]).not.toBe(
			handlesBefore[handlesBefore.length - 1]
		);

		// (C) Check full data integrity
		expect(textsAfter).toEqual([...textsBefore, "F"]);
	});

	// ─────────────────────────────────────────────────────────────
	// 2. POP TEST – identity preserved + last removed
	// ─────────────────────────────────────────────────────────────
	test("pop: identity preserved + last removed", async ({ page }) => {

		// push first so pop is meaningful
		await page.click("text=Add item");

		const handlesBefore = await getRowHandles(page);
		const textsBefore = await getRowTexts(page);

		await page.click("text=Remove item");

		const handlesAfter = await getRowHandles(page);
		const textsAfter = await getRowTexts(page);

		// Length should return to original
		expect(handlesAfter.length).toBe(handlesBefore.length - 1);

		// All remaining should preserve identity
		for (let i = 0; i < handlesAfter.length; i++) {
			expect(handlesAfter[i]).toBe(handlesBefore[i]);
		}

		// Last element must be gone
		expect(textsAfter).toEqual(textsBefore.slice(0, -1));
	});

	// ─────────────────────────────────────────────────────────────
	// 3. INSERT AT START
	// ─────────────────────────────────────────────────────────────
	test("insert at start: only first is new", async ({ page }) => {

		await page.click("text=Unshift item");

		const handlesAfter = await getRowHandles(page);
		const textsAfter = await getRowTexts(page);

		expect(textsAfter[0]).toBe("X");

		// Check identity preservation for others
		const handlesBeforeAfterUnshift = await getRowHandles(page);
		for (let i = 1; i < handlesAfter.length; i++) {
			expect(handlesAfter[i]).toBe(handlesBeforeAfterUnshift[i]);
		}
	});

	// ─────────────────────────────────────────────────────────────
	// 4. INSERT IN MIDDLE
	// ─────────────────────────────────────────────────────────────
	test("insert in middle: correct shifting of identities", async ({ page }) => {

		const handlesBefore = await getRowHandles(page);

		await page.click("text=Insert X at 2");

		const handlesAfter = await getRowHandles(page);
		const textsAfter = await getRowTexts(page);

		expect(textsAfter[2]).toBe("X");

		// Identity: A,B,(new X),C,D,E
		expect(handlesAfter[0]).toBe(handlesBefore[0]);
		expect(handlesAfter[1]).toBe(handlesBefore[1]);
		expect(handlesAfter[3]).toBe(handlesBefore[2]);
		expect(handlesAfter[4]).toBe(handlesBefore[3]);
		expect(handlesAfter[5]).toBe(handlesBefore[4]);
	});

	// ─────────────────────────────────────────────────────────────
	// 5. REPLACE ELEMENT
	// ─────────────────────────────────────────────────────────────
	test("replace element: identity preserved, content updated", async ({ page }) => {

		const handlesBefore = await getRowHandles(page);

		await page.click("text=Replace item at 2 with Z");

		const handlesAfter = await getRowHandles(page);
		const textsAfter = await getRowTexts(page);

		// Same node reused
		expect(handlesAfter[2]).toBe(handlesBefore[2]);
		expect(textsAfter[2]).toBe("Z");
	});

	// ─────────────────────────────────────────────────────────────
	// 6. SWAP ELEMENTS
	// ─────────────────────────────────────────────────────────────
	test("swap two elements: identities must follow positions", async ({ page }) => {

		const handlesBefore = await getRowHandles(page);
		const textsBefore = await getRowTexts(page);

		// Swap index 1 and 3
		await page.click("text=Swap 1 and 3");

		const handlesAfter = await getRowHandles(page);
		const textsAfter = await getRowTexts(page);

		// The element originally at 1 must now be at 3
		expect(handlesAfter[3]).toBe(handlesBefore[1]);
		expect(handlesAfter[1]).toBe(handlesBefore[3]);

		// Check content
		expect(textsAfter).toEqual(textsBefore.map((v, i) =>
			i === 1 ? textsBefore[3] :
			i === 3 ? textsBefore[1] : v
		));
	});

	// ─────────────────────────────────────────────────────────────
	// 7. REVERSE TEST
	// ─────────────────────────────────────────────────────────────
	test("reverse: nodes reversed, identities preserved correctly", async ({ page }) => {

		const handlesBefore = await getRowHandles(page);
		const textsBefore = await getRowTexts(page);

		await page.click("text=Reverse items");

		const handlesAfter = await getRowHandles(page);
		const textsAfter = await getRowTexts(page);

		for (let i = 0; i < handlesBefore.length; i++) {
			expect(handlesAfter[i]).toBe(handlesBefore[handlesBefore.length - 1 - i]);
		}

		expect(textsAfter).toEqual([...textsBefore].reverse());
	});

	// ─────────────────────────────────────────────────────────────
	// 8. CLEAR + READD
	// ─────────────────────────────────────────────────────────────
	test("clear array: empty list then refill correctly", async ({ page }) => {

		await page.click("text=Clear items");

		let handles = await getRowHandles(page);
		expect(handles.length).toBe(0);

		// Re-add items
		await page.click("text=Re-add A,B,C");

		const textsAfter = await getRowTexts(page);
		expect(textsAfter).toEqual(["A", "B", "C"]);
	});

	// ─────────────────────────────────────────────────────────────
	// 9. RANDOMIZED STRESS TEST
	// ─────────────────────────────────────────────────────────────
	test("stress test: 50 random ops, DOM integrity must hold", async ({ page }) => {

		for (let i = 0; i < 50; i++) {
			await page.evaluate(() => {
				const ops = ["push", "pop", "unshift", "shift", "splice", "replace"];
				const op = ops[Math.floor(Math.random() * ops.length)];

				switch (op) {
					case "push":
						window.items.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
						break;
					case "pop":
						window.items.pop();
						break;
					case "unshift":
						window.items.unshift("X");
						break;
					case "shift":
						window.items.shift();
						break;
					case "splice":
						if (window.items.length > 0) {
							window.items.splice(
								Math.floor(Math.random() * window.items.length),
								0,
								"Y"
							);
						}
						break;
					case "replace":
						if (window.items.length > 0) {
							window.items[Math.floor(Math.random() * window.items.length)] = "Z";
						}
						break;
				}
			});

			// Verify DOM matches items exactly
			const domTexts = await getRowTexts(page);
			const jsItems = await page.evaluate(() => window.items);
			expect(domTexts).toEqual(jsItems);
		}
	});
});