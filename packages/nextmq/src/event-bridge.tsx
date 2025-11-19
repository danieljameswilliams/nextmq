/**
 * NextMQ Event Bridge - Listens for CustomEvents and routes them to the JobQueue.
 *
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 *
 * Listens for CustomEvents (default: 'nextmq'), buffers if processor isn't ready,
 * and routes to JobQueue when ready. Place in root layout alongside NextMQClientProvider.
 */

'use client'

import { useEffect } from 'react'
import { NEXTMQ_EVENT_NAME, type NextmqEventDetail } from './events'

/** Event buffer to store events until the processor is ready */
const eventBuffer: CustomEvent<NextmqEventDetail>[] = []
/** Maximum buffer size to prevent memory issues */
const MAX_BUFFER_SIZE = 1000

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

      timeoutId = setTimeout(checkProvider, 200)
    }

    const handleEvent = (evt: Event) => {
      const customEvent = evt as CustomEvent<NextmqEventDetail>

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
        processEventCallback(customEvent)
      } else {
        // Prevent buffer overflow
        if (eventBuffer.length >= MAX_BUFFER_SIZE) {
          if (isDevelopment) {
            console.warn(`[nextmq] ⚠️ Event buffer is full (${MAX_BUFFER_SIZE} events). Dropping oldest event. Consider initializing NextMQClientProvider earlier.`)
          } else {
            console.error('[nextmq] Event buffer is full. Dropping event.')
          }
          eventBuffer.shift() // Remove oldest event
        }
        
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
