// src/NextMQRootClientEventBridge.tsx
/**
 * NextMQ Event Bridge - Listens for CustomEvents and routes them to the JobQueue.
 *
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 *
 * This component:
 * 1. Listens for CustomEvents on the window (default: 'nextmq', configurable via eventName prop)
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
 *
 * @example
 * ```tsx
 * // Using a custom event name
 * <NextMQRootClientEventBridge eventName="helloMcNerd" />
 *
 * // Then dispatch events with the same name:
 * window.dispatchEvent(
 *   new CustomEvent('helloMcNerd', {
 *     detail: { type: 'cart.add', payload: { ean: '123' } }
 *   })
 * );
 * ```
 */

'use client'

import { useEffect } from 'react'
import { NEXTMQ_EVENT_NAME, type NextmqEventDetail } from './events'

/** Event buffer to store events until the processor is ready */
const eventBuffer: CustomEvent<NextmqEventDetail>[] = []

/** Callback to process events (set by NextMQClientProvider) */
let processEventCallback: ((event: CustomEvent<NextmqEventDetail>) => void) | null = null

/** Track if EventBridge has been mounted */
let eventBridgeMounted = false

/** Track if Provider has been mounted */
let providerMounted = false

/** Development mode check */
const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

/**
 * Set the callback to process events.
 * When set, processes any buffered events immediately.
 * @internal Used by NextMQClientProvider
 */
export function setProcessEventCallback(callback: (event: CustomEvent<NextmqEventDetail>) => void) {
  processEventCallback = callback

  // Process any buffered events now that processor is ready
  while (eventBuffer.length > 0) {
    const event = eventBuffer.shift()
    if (event) {
      callback(event)
    }
  }
}

/**
 * Clear the event processing callback.
 * @internal Used by NextMQClientProvider on unmount
 */
export function clearProcessEventCallback() {
  processEventCallback = null
}

/**
 * Clear the event buffer (for testing only)
 * @internal For tests only
 */
export function clearEventBuffer() {
  eventBuffer.length = 0
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
  }
}

/**
 * NextMQ Event Bridge Component
 *
 * Listens for CustomEvents and routes them to the JobQueue.
 * Events are buffered if the processor isn't ready yet.
 *
 * ⚠️ **IMPORTANT:** This component must be placed in your root layout (app/layout.tsx)
 * alongside NextMQClientProvider, not in nested layouts or pages.
 *
 * @param eventName - Optional custom event name to listen for. Defaults to 'nextmq'.
 *                    If you use a custom name, make sure to dispatch events with the same name.
 */
export function NextMQRootClientEventBridge({ eventName = NEXTMQ_EVENT_NAME }: { eventName?: string } = {}) {
  useEffect(() => {
    eventBridgeMounted = true

    // Warn if Provider is not mounted (common mistake)
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    if (isDevelopment) {
      const checkProvider = () => {
        if (!providerMounted) {
          console.warn(
            '[nextmq] ⚠️ NextMQRootClientEventBridge is mounted but NextMQClientProvider is not found.\n' +
              'Make sure to include <NextMQClientProvider> in your root layout (app/layout.tsx).\n' +
              'Example:\n' +
              '  <NextMQRootClientEventBridge />\n' +
              '  <NextMQClientProvider processor={processor}>\n' +
              '    {children}\n' +
              '  </NextMQClientProvider>'
          )
        }
      }

      // Check after a delay to allow Provider to mount
      timeoutId = setTimeout(checkProvider, 200)
    }

    const handleEvent = (evt: Event) => {
      const customEvent = evt as CustomEvent<NextmqEventDetail>

      // Validate event structure
      if (isDevelopment && !customEvent.detail) {
        console.error(
          `[nextmq] ❌ Invalid CustomEvent: missing "detail" property.\n` +
            'Events must be dispatched with this structure:\n' +
            `  window.dispatchEvent(\n` +
            `    new CustomEvent("${eventName}", {\n` +
            '      detail: {\n' +
            '        type: "your.job.type",\n' +
            '        payload: { /* your data */ },\n' +
            '        requirements: [] // optional\n' +
            '      }\n' +
            '    })\n' +
            '  );'
        )
        return
      }

      if (isDevelopment && !customEvent.detail.type) {
        console.error('[nextmq] ❌ Invalid CustomEvent: missing "type" in detail.\n' + 'The event detail must include a "type" property:\n' + '  detail: { type: "your.job.type", payload: {...} }')
        return
      }

      if (processEventCallback) {
        // Processor is ready, process immediately
        processEventCallback(customEvent)
      } else {
        // Processor not ready yet, buffer the event
        if (isDevelopment) {
          console.warn(`[nextmq] ⏳ Event buffered: "${customEvent.detail.type}". Waiting for NextMQClientProvider to initialize processor...`)
        }
        eventBuffer.push(customEvent)
      }
    }

    window.addEventListener(eventName, handleEvent)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      window.removeEventListener(eventName, handleEvent as EventListener)
      eventBridgeMounted = false
    }
  }, [eventName])

  return null
}

/**
 * Mark provider as mounted (for development warnings)
 * @internal
 */
export function markProviderMounted() {
  providerMounted = true
}

/**
 * Mark provider as unmounted
 * @internal
 */
export function markProviderUnmounted() {
  providerMounted = false
}

/**
 * Check if EventBridge is mounted
 * @internal
 */
export function isEventBridgeMounted() {
  return eventBridgeMounted
}
