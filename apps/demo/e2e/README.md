# E2E Tests for NextMQ Demo

This directory contains end-to-end tests using Playwright to verify the NextMQ functionality.

## Running Tests

### Install Playwright Browsers

First time setup:
```bash
npx playwright install
```

### Run Tests

```bash
# Run all tests headless
npm run test:e2e

# Run tests with UI (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed
```

## Test Coverage

### Add to Cart Flow (`add-to-cart.spec.ts`)

Tests verify the complete NextMQ flow:
1. **CustomEvent Dispatch** - Verifies that clicking "Add to Cart" dispatches the correct CustomEvent
2. **Notification Display** - Verifies that the notification dialog appears with correct content
3. **Full Integration** - Verifies the complete flow: CustomEvent → EventBridge → Provider → Processor → Handler → JSX rendering

## Test Structure

```
e2e/
  ├── add-to-cart.spec.ts    # Tests for Add to Cart functionality
  └── README.md               # This file
```

## What Gets Tested

- ✅ CustomEvent is dispatched with correct structure
- ✅ Notification dialog appears after button click
- ✅ Notification shows correct content (EAN and quantity)
- ✅ Notification has correct styling (green background, fixed position)
- ✅ Notification is positioned correctly (top-right corner)
- ✅ Full NextMQ flow works end-to-end

## CI/CD Integration

The tests are configured to:
- Automatically start the dev server before running tests
- Run on Chromium, Firefox, and WebKit
- Retry failed tests on CI
- Generate HTML reports

## Debugging Failed Tests

1. Run tests in UI mode: `npm run test:e2e:ui`
2. Run tests in headed mode: `npm run test:e2e:headed`
3. Check the HTML report in `playwright-report/`
4. Use Playwright Inspector: `PWDEBUG=1 npm run test:e2e`

