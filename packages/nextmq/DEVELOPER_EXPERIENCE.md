# NextMQ Developer Experience Guide

This document describes the error messages, warnings, and helpful guidance provided by NextMQ to ensure a great developer experience.

## Error Messages & Warnings

NextMQ provides helpful error messages and warnings in development mode to guide you when something is misconfigured.

### 🔴 Critical Errors

#### Missing Processor Function

**When:** `NextMQClientProvider` receives a non-function processor prop

**Error Message:**
```
[nextmq] ❌ NextMQClientProvider requires a "processor" function.
The processor prop must be a function that routes jobs to handlers.

Example processor:
  // app/processors.ts
  import type { Processor } from "nextmq";
  
  const processor: Processor = async (job) => {
    switch (job.type) {
      case "cart.add":
        const handler = await import("./handlers/cartAdd");
        return handler.default(job);
      default:
        console.warn("Unknown job type:", job.type);
    }
  };
  
  export default processor;
```

#### Processor Not Returning Promise

**When:** Processor function doesn't return a Promise

**Error Message:**
```
[nextmq] ❌ Processor function must return a Promise.
Make sure your processor is an async function:
  const processor: Processor = async (job) => {
    // your code
  };
```

#### useNextmq Hook Used Outside Provider

**When:** `useNextmq()` is called outside of `NextMQClientProvider`

**Error Message:**
```
[nextmq] ❌ useNextmq() must be used inside <NextMQClientProvider>.

Make sure to:
1. Wrap your app with <NextMQClientProvider> in your root layout (app/layout.tsx)
2. Use useNextmq() only in components that are children of the Provider

Example:
  // app/layout.tsx
  <NextMQClientProvider processor={processor}>
    {children}
  </NextMQClientProvider>

  // app/page.tsx
  function Page() {
    const queue = useNextmq(); // ✅ Works here
    return <div>...</div>;
  }
```

#### Invalid CustomEvent Structure

**When:** CustomEvent is dispatched without proper `detail` structure

**Error Message:**
```
[nextmq] ❌ Invalid CustomEvent: missing "detail" property.
Events must be dispatched with this structure:
  window.dispatchEvent(
    new CustomEvent("nextmq:invoke", {
      detail: {
        type: "your.job.type",
        payload: { /* your data */ },
        requirements: [] // optional
      }
    })
  );
```

**When:** CustomEvent detail is missing `type`

**Error Message:**
```
[nextmq] ❌ Invalid CustomEvent: missing "type" in detail.
The event detail must include a "type" property:
  detail: { type: "your.job.type", payload: {...} }
```

### ⚠️ Warnings

#### EventBridge Without Provider

**When:** `NextMQRootClientEventBridge` is mounted but `NextMQClientProvider` is not found

**Warning:**
```
[nextmq] ⚠️ NextMQRootClientEventBridge is mounted but NextMQClientProvider is not found.
Make sure to include <NextMQClientProvider> in your root layout (app/layout.tsx).
Example:
  <NextMQRootClientEventBridge />
  <NextMQClientProvider processor={processor}>
    {children}
  </NextMQClientProvider>
```

#### Provider Without EventBridge

**When:** `NextMQClientProvider` is mounted but `NextMQRootClientEventBridge` is not found

**Warning:**
```
[nextmq] ⚠️ NextMQClientProvider is mounted but NextMQRootClientEventBridge is not found.
Make sure to include <NextMQRootClientEventBridge> in your root layout (app/layout.tsx).
Example:
  <NextMQRootClientEventBridge />
  <NextMQClientProvider processor={processor}>
    {children}
  </NextMQClientProvider>

Without the EventBridge, CustomEvents will not be received.
```

#### Multiple Providers Detected

**When:** Multiple `NextMQClientProvider` instances are detected

**Warning:**
```
[nextmq] ⚠️ Multiple NextMQClientProvider instances detected.
You should only have one NextMQClientProvider in your root layout.
```

#### Event Buffered (Waiting for Processor)

**When:** Event is dispatched before processor is ready

**Warning:**
```
[nextmq] ⏳ Event buffered: "your.job.type". Waiting for NextMQClientProvider to initialize processor...
```

This is informational - events are automatically processed once the processor is ready.

### 📝 Job Processing Errors

**When:** A job fails during processing

**Error Message (Development):**
```
[nextmq] ❌ Job processing failed: "your.job.type"
Job ID: abc-123-def-456
Error: Your error message here

Stack trace:
  at YourHandler (handler.ts:10:5)
  ...
```

**Error Message (Production):**
```
[nextmq] Job processing failed: {
  jobId: "abc-123-def-456",
  jobType: "your.job.type",
  error: ErrorObject
}
```

## Common Mistakes & Solutions

### ❌ Mistake: Forgetting EventBridge

**Symptom:** Events are dispatched but nothing happens

**Solution:** Add `<NextMQRootClientEventBridge />` to your root layout

```tsx
// app/layout.tsx
<NextMQRootClientEventBridge />
<NextMQClientProvider processor={processor}>
  {children}
</NextMQClientProvider>
```

### ❌ Mistake: Using Provider Without Processor

**Symptom:** Provider mounts but jobs don't process

**Solution:** Always pass a processor function

```tsx
// ✅ Correct
<NextMQClientProvider processor={processor}>
  {children}
</NextMQClientProvider>

// ❌ Wrong
<NextMQClientProvider>
  {children}
</NextMQClientProvider>
```

### ❌ Mistake: Wrong CustomEvent Structure

**Symptom:** Events are dispatched but rejected

**Solution:** Use the correct structure

```tsx
// ✅ Correct
window.dispatchEvent(
  new CustomEvent('nextmq:invoke', {
    detail: {
      type: 'cart.add',
      payload: { ean: '123' },
    },
  }),
);

// ❌ Wrong
window.dispatchEvent(
  new CustomEvent('nextmq:invoke', {
    type: 'cart.add', // Missing 'detail' wrapper
  }),
);
```

### ❌ Mistake: Using useNextmq Outside Provider

**Symptom:** Runtime error when component renders

**Solution:** Ensure component is inside Provider

```tsx
// ✅ Correct - Component is inside Provider
function MyComponent() {
  const queue = useNextmq(); // Works!
  return <div>...</div>;
}

// ❌ Wrong - Component is outside Provider
function MyComponent() {
  const queue = useNextmq(); // Throws error!
  return <div>...</div>;
}
```

## Development vs Production

All helpful error messages and warnings are **only shown in development mode**. In production:

- Errors are logged minimally (job ID, type, error object)
- Warnings are suppressed
- Stack traces are not included

This ensures your production bundle stays small and your console stays clean.

## Best Practices

1. **Always include both components** in your root layout:
   ```tsx
   <NextMQRootClientEventBridge />
   <NextMQClientProvider processor={processor}>
     {children}
   </NextMQClientProvider>
   ```

2. **Use TypeScript** - TypeScript will catch many errors at compile time

3. **Check console in development** - Warnings help you catch issues early

4. **Test your processor** - Make sure it handles all job types correctly

5. **Use DevTools** - The `<NextMQDevTools />` component helps debug issues

## Getting Help

If you encounter an error:

1. Check the error message - it usually includes a solution
2. Verify your setup matches the examples
3. Check the console for warnings
4. Use `<NextMQDevTools />` to inspect the queue state
5. Review the [README](../README.md) for setup instructions

