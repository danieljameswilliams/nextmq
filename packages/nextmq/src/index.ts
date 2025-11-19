/**
 * NextMQ - Message Queue for Next.js
 *
 * A simple, code-split message queue system for Next.js applications.
 *
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 *
 * ## Quick Start
 *
 * 1. **Set up EventBridge and Provider** in your root layout:
 * ```tsx
 * // app/layout.tsx
 * import { NextMQRootClientEventBridge, NextMQClientProvider } from 'nextmq';
 * import processor from './processors';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <NextMQRootClientEventBridge />
 *         <NextMQClientProvider processor={processor}>
 *           {children}
 *         </NextMQClientProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * 2. **Create a processor** with dynamic imports:
 * ```tsx
 * // app/processors.ts
 * import type { Processor } from 'nextmq';
 *
 * const processor: Processor = async (job) => {
 *   switch (job.type) {
 *     case 'cart.add':
 *       const handler = await import('./handlers/cartAdd');
 *       return handler.default(job);
 *     default:
 *       console.warn('Unknown job type:', job.type);
 *   }
 * };
 *
 * export default processor;
 * ```
 *
 * 3. **Create handlers** (code-split):
 * ```tsx
 * // app/handlers/cartAdd.tsx
 * import type { Job } from 'nextmq';
 *
 * export default async function cartAddHandler(job: Job<{ ean: string }>) {
 *   // Your handler logic
 *   return <div>Added to cart!</div>; // Optional: return JSX
 * }
 * ```
 *
 * 4. **Dispatch jobs** via CustomEvent:
 * ```tsx
 * import { NEXTMQ_EVENT_NAME } from 'nextmq';
 *
 * window.dispatchEvent(
 *   new CustomEvent(NEXTMQ_EVENT_NAME, {
 *     detail: {
 *       type: 'cart.add',
 *       payload: { ean: '123' },
 *       requirements: ['necessaryConsent'], // Optional
 *       dedupeKey: 'cart-add-123', // Optional: prevent duplicates
 *       delay: 1000 // Optional: delay in milliseconds
 *       // 💡 Tip: delay + dedupeKey = automatic debouncing!
 *     }
 *   })
 * );
 * ```
 *
 * 5. **Track job status** with React hooks:
 * ```tsx
 * import { useJobStatus, useNextmq } from 'nextmq';
 *
 * function MyComponent() {
 *   const [jobId, setJobId] = useState<string | null>(null);
 *   const { status, result, error } = useJobStatus(jobId);
 *   const queue = useNextmq();
 *
 *   const handleClick = () => {
 *     const id = queue.add('cart.add', { ean: '123' }, [], undefined, 1000);
 *     if (id) setJobId(id);
 *   };
 *
 *   if (status === 'processing') return <Spinner />;
 *   if (status === 'failed') return <Error error={error} />;
 *   return <Success data={result} />;
 * }
 * ```
 *
 * @packageDocumentation
 */

// Re-export React types for convenience
export type { ReactElement } from 'react'
export * from './dev-tools'
// React components and hooks
export * from './event-bridge'
export * from './events'
// Core types and classes
export * from './job-queue'
export * from './provider'
export * from './requirements'
export * from './use-job-status'
