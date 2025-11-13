# NextMQ Testing Guide

This document describes the test suite for NextMQ and which tests should run on every build.

## Test Files

The test suite consists of the following test files:

1. **`tests/integration.test.tsx`** - Comprehensive integration tests for the complete flow
2. **`tests/jobQueue.test.ts`** - Core JobQueue functionality tests
3. **`tests/eventBridge.test.tsx`** - EventBridge component tests
4. **`tests/requirements.test.ts`** - Requirements system tests
5. **`tests/useNextmq.test.tsx`** - useNextmq hook tests

## Test Coverage

### Integration Tests (`integration.test.tsx`)
- ✅ Full flow: CustomEvent → EventBridge → Provider → Processor → Handler
- ✅ Sequential job processing
- ✅ Requirements system (single and multiple)
- ✅ Event buffering when processor not ready
- ✅ JSX rendering from processors
- ✅ Error handling and recovery
- ✅ Job ID generation and timestamps

### JobQueue Tests (`jobQueue.test.ts`)
- ✅ Requirements gating
- ✅ Sequential processing
- ✅ Job ID generation
- ✅ Timestamp inclusion
- ✅ JSX rendering callbacks
- ✅ Error handling
- ✅ Debug state

### EventBridge Tests (`eventBridge.test.tsx`)
- ✅ CustomEvent handling
- ✅ Requirements in events
- ✅ Cleanup on unmount

### Requirements Tests (`requirements.test.ts`)
- ✅ Get/set requirement values
- ✅ Listener notifications
- ✅ Multiple requirements
- ✅ Unsubscribe functionality

### useNextmq Hook Tests (`useNextmq.test.tsx`)
- ✅ Returns JobQueue instance
- ✅ Error when used outside Provider
- ✅ Job enqueueing via hook

## Running Tests

### Development
```bash
npm test              # Run all tests once
npm run test:watch     # Run tests in watch mode
npm run test:ui        # Run tests with UI
```

### CI/Build
```bash
npm test              # Run all tests (should pass before build)
npm run test:coverage # Run tests with coverage report
```

## Tests to Run on Every Build

**All tests must pass before building/publishing:**

1. ✅ **Integration tests** - Ensures the complete flow works end-to-end
2. ✅ **JobQueue tests** - Core functionality must work
3. ✅ **EventBridge tests** - Event handling must work
4. ✅ **Requirements tests** - Requirements system must work
5. ✅ **useNextmq hook tests** - Hook must work correctly

### Pre-Build Checklist

Before building or publishing, ensure:

- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint` (if configured)
- [ ] Type checking passes: `npm run check-types` (if configured)
- [ ] Build succeeds: `npm run build`

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test

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
      - run: npm test
      - run: npm run build
```

### Pre-publish Hook

Add to `package.json`:

```json
{
  "scripts": {
    "prepublishOnly": "npm test && npm run build"
  }
}
```

## Test Philosophy

Tests are designed to:

1. **Verify the complete flow** - CustomEvent → EventBridge → Provider → Processor → Handler
2. **Test edge cases** - Error handling, requirements, buffering
3. **Ensure reliability** - Sequential processing, unique IDs, timestamps
4. **Validate React integration** - JSX rendering, hooks, context

## Debugging Failed Tests

If a test fails:

1. Check the error message for specific failure details
2. Run tests in watch mode: `npm run test:watch`
3. Use the UI: `npm run test:ui`
4. Check console output for error details
5. Verify test environment (jsdom for browser APIs)

## Adding New Tests

When adding new features:

1. Add tests to the appropriate test file
2. Add integration test if it affects the complete flow
3. Ensure tests are isolated (use `beforeEach` for cleanup)
4. Use descriptive test names
5. Test both success and error cases

