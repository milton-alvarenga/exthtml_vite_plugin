## Running Playwright End-to-End Tests

This project uses [Playwright](https://playwright.dev) for end-to-end testing of the generated HTML output.

### Setup

Make sure you have installed the dev dependencies including Playwright and browser binaries:

```bash
npm install
npx playwright install
```


### Running Tests

Start your Vite development server in one terminal:

```bash
npm run dev
```

In another terminal, run the Playwright tests:

```bash
npm run test:e2e
```

This will execute all Playwright tests in the configured test folder (e.g., `tests/`) against the running Vite app at `http://localhost:5173/`.

#### Test specific script and not all availables tests
```bash
npm run test:e2e:headed -- tests/var_modified_but_could_be_reseted/
```

This will execute only the tests on the target directory informed

### Test Script Configuration

Make sure your `package.json` includes the following script:

```json
"scripts": {
  "test:e2e": "playwright test"
}
```


### Writing Tests

Example test file `tests/index.test.js`:

```js
import { test, expect } from '@playwright/test';

test('count all <a> elements on page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const linksCount = await page.locator('a').count();
  expect(linksCount).toBeGreaterThan(0);
});
```
