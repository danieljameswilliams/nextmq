// src/NextMQRootClientEventBridge.tsx
/**
 * NextMQ Event Bridge - Listens for CustomEvents and routes them to the JobQueue.
 * 
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 * 
 * This component:
 * 1. Listens for 'nextmq:invoke' CustomEvents on the window
 * 2. Buffers events if the processor isn't ready yet
 * 3. Routes events to the JobQueue when the processor is ready
 * 
 * Place this component in your root layout, alongside NextMQClientProvider.
 * 
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { NextMQRootClientEventBridge, NextMQClientProvider } from 'nextmq';
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
 */

'use client';

import { useEffect } from 'react';
import { NEXTMQ_EVENT_NAME, type NextmqEventDetail } from './events';

/** Event buffer to store events until the processor is ready */
const eventBuffer: CustomEvent<NextmqEventDetail>[] = [];

/** Callback to process events (set by NextMQClientProvider) */
let processEventCallback: ((event: CustomEvent<NextmqEventDetail>) => void) | null = null;

/**
 * Set the callback to process events.
 * When set, processes any buffered events immediately.
 * @internal Used by NextMQClientProvider
 */
export function setProcessEventCallback(
  callback: (event: CustomEvent<NextmqEventDetail>) => void,
) {
  processEventCallback = callback;
  
  // Process any buffered events now that processor is ready
  while (eventBuffer.length > 0) {
    const event = eventBuffer.shift();
    if (event) {
      callback(event);
    }
  }
}

/**
 * Clear the event processing callback.
 * @internal Used by NextMQClientProvider on unmount
 */
export function clearProcessEventCallback() {
  processEventCallback = null;
}

/**
 * Get current event buffer state for debugging.
 * @internal For DevTools only
 */
export function getEventBufferState() {
  return {
    buffer: eventBuffer.map((event) => ({
      type: event.detail.type,
      payload: event.detail.payload,
      requirements: event.detail.requirements,
      timestamp: event.timeStamp || Date.now(),
    })),
    bufferLength: eventBuffer.length,
    processorReady: processEventCallback !== null,
  };
}

/**
 * NextMQ Event Bridge Component
 * 
 * Listens for 'nextmq:invoke' CustomEvents and routes them to the JobQueue.
 * Events are buffered if the processor isn't ready yet.
 */
export function NextMQRootClientEventBridge() {
  useEffect(() => {
    const handleEvent = (evt: Event) => {
      const customEvent = evt as CustomEvent<NextmqEventDetail>;

      if (processEventCallback) {
        // Processor is ready, process immediately
        processEventCallback(customEvent);
      } else {
        // Processor not ready yet, buffer the event
        eventBuffer.push(customEvent);
      }
    };

    window.addEventListener(NEXTMQ_EVENT_NAME, handleEvent);

    return () => {
      window.removeEventListener(NEXTMQ_EVENT_NAME, handleEvent as EventListener);
    };
  }, []);

  return null;
}

