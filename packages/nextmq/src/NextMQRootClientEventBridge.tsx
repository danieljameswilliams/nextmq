// src/NextMQRootClientEventBridge.tsx
'use client';

import { useEffect } from 'react';
import { NEXTMQ_EVENT_NAME, type NextmqEventDetail } from './events';

// Event buffer to store events until the processor is ready
const eventBuffer: CustomEvent<NextmqEventDetail>[] = [];

// Callback to process events (set by NextMQRootClientContextProvider)
let processEventCallback: ((event: CustomEvent<NextmqEventDetail>) => void) | null = null;

export function setProcessEventCallback(
  callback: (event: CustomEvent<NextmqEventDetail>) => void,
) {
  processEventCallback = callback;
  // Process any buffered events
  while (eventBuffer.length > 0) {
    const event = eventBuffer.shift();
    if (event) {
      callback(event);
    }
  }
}

export function clearProcessEventCallback() {
  processEventCallback = null;
}

/**
 * Debug function: Get current event buffer state
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
 * Root-level client event bridge that ONLY initializes event listeners.
 * It listens for CustomEvents and either processes them immediately
 * (if processor is ready) or buffers them until the processor loads.
 * 
 * Place this component in your root layout.
 */
export function NextMQRootClientEventBridge() {
  useEffect(() => {
    const handler = (evt: Event) => {
      const customEvent = evt as CustomEvent<NextmqEventDetail>;

      if (processEventCallback) {
        // Processor is ready, process immediately
        processEventCallback(customEvent);
      } else {
        // Processor not ready yet, buffer the event
        eventBuffer.push(customEvent);
      }
    };

    window.addEventListener(NEXTMQ_EVENT_NAME, handler);

    return () => {
      window.removeEventListener(NEXTMQ_EVENT_NAME, handler as EventListener);
    };
  }, []);

  return null;
}

