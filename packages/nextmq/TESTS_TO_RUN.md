# Tests to Run on Every Build

## ✅ Required Tests (Must Pass Before Build)

### Unit & Integration Tests

Run these tests before every build or publish:

```bash
npm test
```

This runs all test suites:

1. **Integration Tests** (`tests/integration.test.tsx`)
   - Full flow: CustomEvent → EventBridge → Provider → Processor → Handler
   - Sequential processing
   - Requirements (single & multiple)
   - Event buffering
   - JSX rendering
   - Error handling

2. **JobQueue Tests** (`tests/jobQueue.test.ts`)
   - Requirements gating
   - Sequential processing
   - Job ID generation
   - JSX rendering callbacks
   - Error handling
   - Debug state

3. **EventBridge Tests** (`tests/eventBridge.test.tsx`)
   - CustomEvent handling
   - Requirements in events
   - Cleanup on unmount

4. **Requirements Tests** (`tests/requirements.test.ts`)
   - Get/set values
   - Listener notifications
   - Multiple requirements
   - Unsubscribe

5. **useNextmq Hook Tests** (`tests/useNextmq.test.tsx`)
   - Returns JobQueue instance
   - Error when used outside Provider
   - Job enqueueing

## Quick Commands

```bash
# Run all unit/integration tests (required before build)
npm test

# Watch mode (development)
npm run test:watch

# With coverage
npm run test:coverage

# With UI
npm run test:ui
```

### E2E Tests (Demo App)

End-to-end tests verify the complete NextMQ flow in a real Next.js application:

```bash
# From root directory
npm run test:e2e

# Or from apps/demo directory
cd apps/demo
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Run with Playwright UI
npm run test:e2e:headed # Run in headed mode (see browser)
```

**E2E Test Coverage:**
- ✅ CustomEvent dispatch when clicking "Add to Cart"
- ✅ Notification dialog appears with correct content
- ✅ Full flow: CustomEvent → EventBridge → Provider → Processor → Handler → JSX rendering
- ✅ Notification styling and positioning

## Pre-Build Checklist

- [ ] All unit/integration tests pass: `npm test`
- [ ] E2E tests pass: `npm run test:e2e` (from root)
- [ ] Build succeeds: `npm run build`
- [ ] No linting errors (if configured)

## CI/CD

The `prepublishOnly` script automatically runs tests before publishing:

```json
"prepublishOnly": "npm test && npm run build"
```

This ensures tests always pass before publishing to npm.

