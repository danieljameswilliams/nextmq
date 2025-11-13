// src/NextMQRootClientContextProvider.tsx
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
import { NEXTMQ_EVENT_NAME, type NextmqEventDetail } from './events';

export const NextmqContext = createContext<JobQueue | null>(null);

interface RenderedComponent {
  id: string;
  element: React.ReactElement;
  jobId: string;
}

/**
 * Root-level client context provider that creates a single JobQueue instance
 * and processes events. This component should be code-split/dynamic/lazy-loaded
 * as it contains the processing logic.
 * 
 * @param children - React children
 * @param processor - Single processor function that handles all job types.
 *                    The processor should route to code-split handlers based on job.type
 *                    to keep InitialJS small.
 * 
 * @example
 * ```tsx
 * <NextMQRootClientContextProvider
 *   processor={async (job) => {
 *     switch (job.type) {
 *       case 'cart.add':
 *         const handler = await import('./handlers/cartAdd');
 *         return handler.default(job);
 *       // ...
 *     }
 *   }}
 * >
 *   {children}
 * </NextMQRootClientContextProvider>
 * ```
 * 
 * Place this component in your root layout, wrapped in a dynamic import.
 */
export function NextMQRootClientContextProvider({
  children,
  processor,
}: {
  children: ReactNode;
  processor?: Processor<any>;
}) {
  const [queue] = useState(() => new JobQueue());
  const [renderedComponents, setRenderedComponents] = useState<
    Map<string, RenderedComponent>
  >(new Map());

  // Render callback: when a processor returns JSX, add it to rendered components
  const handleRender = useCallback<RenderCallback>((element, jobId) => {
    if (!element) {
      // Remove component if element is null
      setRenderedComponents((prev) => {
        const next = new Map(prev);
        // Find and remove component by jobId
        for (const [id, comp] of next.entries()) {
          if (comp.jobId === jobId) {
            next.delete(id);
            break;
          }
        }
        return next;
      });
      return;
    }

    // Add new component with unique ID
    const id = `nextmq-render-${jobId}-${Date.now()}`;
    setRenderedComponents((prev) => {
      const next = new Map(prev);
      next.set(id, { id, element, jobId });
      return next;
    });
  }, []);

  useEffect(() => {
    // Set up render callback
    queue.setRenderCallback(handleRender);

    // Cleanup: remove callback when component unmounts
    return () => {
      queue.setRenderCallback(null);
    };
  }, [queue, handleRender]);

  useEffect(() => {
    // Set up the event processor callback
    const processEvent = (event: CustomEvent<NextmqEventDetail>) => {
      const { type, payload, requirements } = event.detail;
      queue.enqueue(type, payload as any, requirements);
    };

    setProcessEventCallback(processEvent);

    // Cleanup: remove callback when component unmounts
    return () => {
      clearProcessEventCallback();
    };
  }, [queue]);

  useEffect(() => {
    // Set the single processor if provided
    if (processor) {
      queue.setProcessor(processor);
    }
  }, [queue, processor]);

  return (
    <NextmqContext.Provider value={queue}>
      {children}
      {/* 
        Render slot for JSX components returned from processors.
        Components rendered here appear as siblings to {children} in the DOM.
        They are placed after all page content, inside the Context.Provider.
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

export function useNextmq() {
  const ctx = useContext(NextmqContext);
  if (!ctx) {
    throw new Error(
      'useNextmq must be used inside <NextMQRootClientContextProvider>',
    );
  }
  return ctx;
}

