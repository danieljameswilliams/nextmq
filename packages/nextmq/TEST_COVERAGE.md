# Test Coverage for NextMQ Package

This document outlines the comprehensive test coverage for all features in the nextmq package.

## Test Files

### 1. `tests/jobQueue.test.tsx`
**Coverage:**
- ✅ Requirements gating (jobs wait until requirements are met)
- ✅ Sequential job processing
- ✅ Unique job ID generation
- ✅ Job timestamps (createdAt)
- ✅ JSX rendering from processors
- ✅ Error handling and recovery
- ✅ Debug state

### 2. `tests/debounceDedupeDelay.test.tsx` (NEW)
**Coverage:**
- ✅ **Delay Feature:**
  - Jobs with delay wait until delay time elapses
  - Jobs with different delays process in correct order
  - Jobs with delay and requirements wait for both
  - Jobs without delay process immediately
  - Zero delay handling
  - Very long delays

- ✅ **DedupeKey Feature:**
  - Jobs with duplicate dedupeKey skip if already completed
  - Queued jobs with same dedupeKey replace previous (debouncing)
  - Different dedupeKeys process independently
  - Jobs without dedupeKey process independently
  - Deduplication works even on job failure
  - Empty string dedupeKey handling

- ✅ **Debounce Feature (Delay + DedupeKey):**
  - Rapid calls with same dedupeKey only process the last one
  - Delay timer resets when job is replaced
  - Different dedupeKeys don't debounce
  - Debouncing with requirements
  - Edge cases with different delays but same dedupeKey

### 3. `tests/jobStatus.test.tsx` (NEW)
**Coverage:**
- ✅ **Job Status Tracking:**
  - `getJobStatus()` returns null for non-existent jobs
  - Status transitions: pending → processing → completed
  - Status transitions: pending → processing → failed
  - Status includes job details (type, payload, requirements, etc.)
  - Status for jobs with delay
  - Status for jobs with requirements

- ✅ **Status Subscriptions:**
  - `subscribeToJobStatus()` notifies on status changes
  - Immediate notification of existing job statuses
  - Unsubscribe stops notifications
  - Multiple subscribers work correctly
  - Subscriber errors handled gracefully

- ✅ **useJobStatus Hook:**
  - Returns null status when jobId is null
  - Tracks job status from pending to completed
  - Tracks job status from pending to failed
  - Handles non-existent jobIds
  - Gets initial status if job already exists

### 4. `tests/integration.test.tsx`
**Coverage:**
- ✅ Full flow: CustomEvent → EventBridge → Provider → Processor → Handler
- ✅ Multiple jobs processed in sequence
- ✅ Jobs with requirements
- ✅ Jobs with multiple requirements
- ✅ Event buffering when processor not ready
- ✅ JSX rendering from processors
- ✅ Error handling
- ✅ Unique job IDs
- ✅ Job timestamps

### 5. `tests/eventBridge.test.tsx`
**Coverage:**
- ✅ EventBridge component mounting
- ✅ CustomEvent dispatching
- ✅ Custom event names

### 6. `tests/useNextmq.test.tsx`
**Coverage:**
- ✅ Hook returns JobQueue instance
- ✅ Hook throws error when used outside Provider
- ✅ Hook allows adding jobs

### 7. `tests/requirements.test.ts`
**Coverage:**
- ✅ Requirement setting and getting
- ✅ Requirement change callbacks
- ✅ Multiple requirement keys

## Features Tested

### Core Features
- ✅ Job queuing and processing
- ✅ Sequential processing (one at a time)
- ✅ Requirements gating
- ✅ JSX rendering from processors
- ✅ Error handling

### New Features (Comprehensive Coverage)
- ✅ **Delay**: Jobs can be delayed before processing
- ✅ **DedupeKey**: Jobs can be deduplicated or debounced
- ✅ **Debounce**: Combination of delay + dedupeKey for automatic debouncing
- ✅ **Status Tracking**: Real-time job status updates
  - `getJobStatus()` method
  - `subscribeToJobStatus()` method
  - `useJobStatus()` React hook

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:coverage
```

### Run tests with UI:
```bash
npm run test:ui
```

## Test Process Before Build

Tests automatically run before building:
- `prebuild` script runs `npm test` before `npm run build`
- `prepublishOnly` script runs tests before publishing

This ensures all features are working correctly before any build or publish.

## Test Statistics

- **Total Test Files**: 7
- **Total Tests**: 69+ (and growing)
- **Coverage**: All major features and edge cases

## Notes

- All tests use Vitest with jsdom environment for React component testing
- Fake timers are used for delay/debounce tests to ensure deterministic behavior
- Integration tests verify the complete flow from CustomEvent to handler execution
- Hook tests verify React integration and context usage

