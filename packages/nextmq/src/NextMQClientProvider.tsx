// src/NextMQClientProvider.tsx
/**
 * NextMQ Client Provider - Creates a JobQueue and connects it to the EventBridge.
 * 
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 * 
 * This is the core component that:
 * 1. Creates a JobQueue instance
 * 2. Connects to NextMQRootClientEventBridge to receive CustomEvents
 * 3. Processes jobs using your processor function (with dynamic imports)
 * 4. Renders JSX components returned from processors
 * 
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { NextMQClientProvider } from 'nextmq';
 * import processor from './processors';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
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

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { JobQueue, type Processor, type RenderCallback } from './JobQueue';
import {
  setProcessEventCallback,
  clearProcessEventCallback,
} from './NextMQRootClientEventBridge';
import type { NextmqEventDetail } from './events';

/** React context for accessing the JobQueue instance */
export const NextmqContext = createContext<JobQueue | null>(null);

/** Internal structure for tracking rendered components */
interface RenderedComponent {
  id: string;
  element: React.ReactElement;
  jobId: string;
}

/**
 * NextMQ Client Provider Component
 * 
 * @param children - React children to render
 * @param processor - Processor function that routes jobs to handlers using dynamic imports
 */
export function NextMQClientProvider({
  children,
  processor,
}: {
  children: ReactNode;
  processor: Processor<unknown>;
}) {
  const [queue] = useState(() => new JobQueue());
  const [renderedComponents, setRenderedComponents] = useState<
    Map<string, RenderedComponent>
  >(new Map());

  /**
   * Render callback: when a processor returns JSX, add it to rendered components.
   * If element is null, remove components for that jobId.
   */
  const handleRender = useCallback<RenderCallback>((element, jobId) => {
    setRenderedComponents((prev) => {
      const next = new Map(prev);
      
      if (!element) {
        // Remove all components for this jobId
        for (const [id, comp] of next.entries()) {
          if (comp.jobId === jobId) {
            next.delete(id);
          }
        }
      } else {
        // Add new component with unique ID
        const id = `nextmq-render-${jobId}-${Date.now()}`;
        next.set(id, { id, element, jobId });
      }
      
      return next;
    });
  }, []);

  // Set up render callback for JSX components returned from processors
  useEffect(() => {
    queue.setRenderCallback(handleRender);
    return () => {
      queue.setRenderCallback(null);
    };
  }, [queue, handleRender]);

  // Connect to EventBridge to receive CustomEvents
  useEffect(() => {
    const processEvent = (event: CustomEvent<NextmqEventDetail>) => {
      const { type, payload, requirements } = event.detail;
      queue.enqueue(type, payload, requirements);
    };

    setProcessEventCallback(processEvent);
    return () => {
      clearProcessEventCallback();
    };
  }, [queue]);

  // Set the processor function
  useEffect(() => {
    if (typeof processor !== 'function') {
      console.error(
        '[nextmq] NextMQClientProvider requires a "processor" function. ' +
        'Create a processor with static import() calls for Next.js code splitting.',
      );
      return;
    }
    queue.setProcessor(processor);
  }, [queue, processor]);

  return (
    <NextmqContext.Provider value={queue}>
      {children}
      {/* 
        Render slot for JSX components returned from processors.
        Components rendered here appear as siblings to {children} in the DOM.
      */}
      {renderedComponents.size > 0 && (
        <div data-nextmq-render-slot style={{ display: 'contents' }}>
          {Array.from(renderedComponents.values()).map(({ id, element }) => (
            <React.Fragment key={id}>{element}</React.Fragment>
          ))}
        </div>
      )}
    </NextmqContext.Provider>
  );
}

/**
 * Hook to access the JobQueue instance from context.
 * 
 * @throws Error if used outside of NextMQClientProvider
 * @returns JobQueue instance
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const queue = useNextmq();
 *   // Use queue methods if needed
 *   return <div>...</div>;
 * }
 * ```
 */
export function useNextmq(): JobQueue {
  const ctx = useContext(NextmqContext);
  if (!ctx) {
    throw new Error(
      'useNextmq must be used inside <NextMQClientProvider>',
    );
  }
  return ctx;
}

