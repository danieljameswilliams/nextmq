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
  markProviderMounted,
  markProviderUnmounted,
  isEventBridgeMounted,
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
      const { type, payload, requirements, dedupeKey, delay } = event.detail;
      queue.enqueue(type, payload, requirements, dedupeKey, delay);
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
        '[nextmq] ❌ NextMQClientProvider requires a "processor" function.\n' +
        'The processor prop must be a function that routes jobs to handlers.\n\n' +
        'Example processor:\n' +
        '  // app/processors.ts\n' +
        '  import type { Processor } from "nextmq";\n' +
        '  \n' +
        '  const processor: Processor = async (job) => {\n' +
        '    switch (job.type) {\n' +
        '      case "cart.add":\n' +
        '        const handler = await import("./handlers/cartAdd");\n' +
        '        return handler.default(job);\n' +
        '      default:\n' +
        '        console.warn("Unknown job type:", job.type);\n' +
        '    }\n' +
        '  };\n' +
        '  \n' +
        '  export default processor;',
      );
      return;
    }

    // Validate processor returns a Promise (only in development, skip in test mode)
    const isDevelopment =
      typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';
    const isTestMode =
      typeof process !== 'undefined' &&
      (process.env.VITEST === 'true' || process.env.NODE_ENV === 'test');
    
    if (isDevelopment && !isTestMode) {
      try {
        const testResult = processor({
          id: '__nextmq_validation_test__',
          type: '__nextmq_validation_test__',
          payload: {},
          createdAt: Date.now(),
        });

        if (!(testResult instanceof Promise)) {
          console.error(
            '[nextmq] ❌ Processor function must return a Promise.\n' +
            'Make sure your processor is an async function:\n' +
            '  const processor: Processor = async (job) => {\n' +
            '    // your code\n' +
            '  };',
          );
          return;
        }
        // Don't await - just check it's a Promise
        testResult.catch(() => {
          // Ignore validation test errors
        });
      } catch (err) {
        // Processor validation failed, but continue (might be intentional)
      }
    }

    queue.setProcessor(processor);
  }, [queue, processor]);

  // Development warnings
  useEffect(() => {
    if (typeof window === 'undefined') return; // Server-side

    const isDevelopment =
      typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

    if (isDevelopment) {
      markProviderMounted();

      // Check if EventBridge is mounted (with delay to allow EventBridge to mount first)
      const checkEventBridge = setTimeout(() => {
        if (!isEventBridgeMounted()) {
          console.warn(
            '[nextmq] ⚠️ NextMQClientProvider is mounted but NextMQRootClientEventBridge is not found.\n' +
            'Make sure to include <NextMQRootClientEventBridge> in your root layout (app/layout.tsx).\n' +
            'Example:\n' +
            '  <NextMQRootClientEventBridge />\n' +
            '  <NextMQClientProvider processor={processor}>\n' +
            '    {children}\n' +
            '  </NextMQClientProvider>\n\n' +
            'Without the EventBridge, CustomEvents will not be received.',
          );
        }
      }, 100);

      // Warn about multiple providers
      const checkMultipleProviders = setTimeout(() => {
        const existingProviders = document.querySelectorAll('[data-nextmq-provider]');
        if (existingProviders.length > 1) {
          console.warn(
            '[nextmq] ⚠️ Multiple NextMQClientProvider instances detected.\n' +
            'You should only have one NextMQClientProvider in your root layout.',
          );
        }
      }, 100);

      return () => {
        clearTimeout(checkEventBridge);
        clearTimeout(checkMultipleProviders);
        markProviderUnmounted();
      };
    }
  }, []);

  return (
    <NextmqContext.Provider value={queue}>
      <div data-nextmq-provider style={{ display: 'contents' }}>
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
      </div>
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
      '[nextmq] ❌ useNextmq() must be used inside <NextMQClientProvider>.\n\n' +
      'Make sure to:\n' +
      '1. Wrap your app with <NextMQClientProvider> in your root layout (app/layout.tsx)\n' +
      '2. Use useNextmq() only in components that are children of the Provider\n\n' +
      'Example:\n' +
      '  // app/layout.tsx\n' +
      '  <NextMQClientProvider processor={processor}>\n' +
      '    {children}\n' +
      '  </NextMQClientProvider>\n\n' +
      '  // app/page.tsx\n' +
      '  function Page() {\n' +
      '    const queue = useNextmq(); // ✅ Works here\n' +
      '    return <div>...</div>;\n' +
      '  }',
    );
  }
  return ctx;
}

