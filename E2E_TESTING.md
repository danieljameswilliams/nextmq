# E2E Testing with Playwright

This document describes the end-to-end testing setup for NextMQ using Playwright.

## Overview

E2E tests verify that NextMQ works correctly in a real Next.js application by:
1. Starting the demo app
2. Interacting with the UI
3. Verifying the complete flow: CustomEvent → EventBridge → Provider → Processor → Handler → JSX rendering

## Setup

### Install Dependencies

```bash
cd apps/demo
npm install
```

### Install Playwright Browsers

```bash
cd apps/demo
npx playwright install
```

Or install only Chromium (faster):
```bash
npx playwright install --with-deps chromium
```

## Running Tests

### From Root Directory

```bash
# Run all E2E tests
npm run test:e2e

# Run with Playwright UI (interactive)
npm run test:e2e:ui
```

### From Demo App Directory

```bash
cd apps/demo

# Run all tests headless
npm run test:e2e

# Run with Playwright UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

## Test Files

### `apps/demo/e2e/add-to-cart.spec.ts`

Tests the complete Add to Cart flow:

1. **Notification Display Test**
   - Clicks "Add to Cart" button
   - Verifies notification appears
   - Checks notification content (EAN, quantity)
   - Validates styling (green background, fixed position)

2. **CustomEvent Dispatch Test**
   - Verifies CustomEvent is dispatched correctly
   - Checks event structure (type, payload)

3. **Full Integration Test**
   - Verifies complete NextMQ flow works
   - Checks notification positioning
   - Confirms JSX rendering from processor

## What Gets Tested

✅ **CustomEvent Dispatch**
- Event is dispatched with correct structure
- Event detail contains type and payload

✅ **Event Processing**
- EventBridge receives the event
- Provider processes the event
- Processor routes to correct handler

✅ **JSX Rendering**
- Handler returns JSX component
- Component is rendered in the DOM
- Component has correct styling and content

✅ **User Experience**
- Notification appears after button click
- Notification shows correct information
- Notification is positioned correctly

## Test Configuration

The Playwright configuration (`playwright.config.ts`) includes:

- **Automatic Server Start**: Dev server starts before tests
- **Multiple Browsers**: Tests run on Chromium, Firefox, and WebKit
- **Retries**: Failed tests retry on CI
- **HTML Reports**: Test results saved to `playwright-report/`

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: cd apps/demo && npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: apps/demo/playwright-report/
```

## Debugging Failed Tests

1. **Run in UI Mode**: `npm run test:e2e:ui`
   - Interactive test runner
   - Step through tests
   - Inspect page state

2. **Run in Headed Mode**: `npm run test:e2e:headed`
   - See browser window
   - Watch test execution
   - Debug visually

3. **Use Playwright Inspector**: `PWDEBUG=1 npm run test:e2e`
   - Step-by-step debugging
   - Inspect selectors
   - View console logs

4. **Check HTML Report**: Open `playwright-report/index.html`
   - View test results
   - See screenshots
   - Check trace files

## Adding New Tests

1. Create test file in `apps/demo/e2e/`
2. Use Playwright's test API
3. Follow existing test patterns
4. Add descriptive test names
5. Use `data-testid` attributes for reliable selectors

Example:
```typescript
import { test, expect } from '@playwright/test';

test('my new test', async ({ page }) => {
  await page.goto('/');
  // Your test code
});
```

## Best Practices

1. **Use Test IDs**: Add `data-testid` attributes to important elements
2. **Wait for Elements**: Use `waitFor` or `toBeVisible()` instead of fixed timeouts
3. **Isolate Tests**: Each test should be independent
4. **Clean Up**: Tests should clean up after themselves
5. **Descriptive Names**: Test names should clearly describe what they test

## Troubleshooting

### Tests Fail to Start

- Check that dev server can start: `cd apps/demo && npm run dev`
- Verify port 3000 is available
- Check for build errors

### Tests Timeout

- Increase timeout in test: `{ timeout: 5000 }`
- Check that notification appears (may need delay)
- Verify handler is loading correctly

### Notification Not Found

- Check that `data-testid="cart-added-notification"` is present
- Verify handler is returning JSX
- Check browser console for errors

### Browser Not Found

- Run `npx playwright install`
- Check Playwright version matches package.json
- Try reinstalling: `npx playwright install --force`

