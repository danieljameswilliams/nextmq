'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { Processor } from './JobQueue';
import type { ReactNode } from 'react';
import type { ComponentType } from 'react';

function isProcessorReference(
  processor: unknown,
): processor is { __nextmq_path: string; __nextmq_ref: true } {
  return (
    typeof processor === 'object' &&
    processor !== null &&
    typeof (processor as any).__nextmq_path === 'string' &&
    (processor as any).__nextmq_ref === true
  );
}

// Lazy-load the provider component - this will code-split the processing logic
const LazyNextMQRootClientContextProvider = dynamic(
  () =>
    import('./NextMQRootClientContextProvider.js').then(
      (mod) => ({ default: mod.NextMQRootClientContextProvider }),
    ),
  {
    ssr: false,
  },
) as ComponentType<{
  children: ReactNode;
  processor?: Processor<any>;
}>;

/**
 * Convenience wrapper around NextMQRootClientContextProvider that handles
 * dynamic importing for code-splitting. Use this in your root layout instead
 * of directly using NextMQRootClientContextProvider.
 * 
 * IMPORTANT: The `from` prop is not supported due to Next.js static analysis requirements.
 * You must import your processor directly and pass it via the `processor` prop.
 * 
 * For Server Components, create a Client Component wrapper that imports the processor:
 * 
 * ```tsx
 * // app/NextMQWrapper.tsx (Client Component)
 * 'use client';
 * import { NextMQClientProvider } from 'nextmq';
 * import processor from './processors';
 * 
 * export default function NextMQWrapper({ children }) {
 *   return <NextMQClientProvider processor={processor}>{children}</NextMQClientProvider>;
 * }
 * ```
 * 
 * Then use it in your layout:
 * ```tsx
 * // app/layout.tsx (Server Component)
 * import NextMQWrapper from './NextMQWrapper';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <NextMQWrapper>{children}</NextMQWrapper>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 * 
 * @param children - React children
 * @param processor - Single processor function (required)
 * @param from - DEPRECATED: Not supported due to Next.js static analysis requirements.
 *               Import your processor directly and pass it via the `processor` prop instead.
 */
export function NextMQClientProvider({
  children,
  processor,
  from,
}: {
  children: React.ReactNode;
  processor?: Processor<any>; // Required in practice, but optional for backward compatibility
  from?: string; // Deprecated - kept for backward compatibility but will show error
}) {
  const [loadedProcessor, setLoadedProcessor] = useState<Processor<any> | undefined>(() => {
    // If processor function is provided directly, use it
    if (typeof processor === 'function') {
      return processor;
    }
    return undefined;
  });

  useEffect(() => {
    // Processor function is required
    if (typeof processor !== 'function') {
      if (from) {
        console.error(
          `[nextmq] The "from" prop is not supported due to Next.js static analysis requirements. ` +
          `Next.js cannot analyze dynamic imports with variable paths.\n\n` +
          `Solution: Import your processor directly and pass it via the "processor" prop.\n\n` +
          `For Server Components, create a Client Component wrapper:\n` +
          `  1. Create app/NextMQWrapper.tsx:\n` +
          `     'use client';\n` +
          `     import { NextMQClientProvider } from 'nextmq';\n` +
          `     import processor from './processors';\n` +
          `     export default function NextMQWrapper({ children }) {\n` +
          `       return <NextMQClientProvider processor={processor}>{children}</NextMQClientProvider>;\n` +
          `     }\n\n` +
          `  2. Use in layout.tsx:\n` +
          `     import NextMQWrapper from './NextMQWrapper';\n` +
          `     <NextMQWrapper>{children}</NextMQWrapper>`,
        );
      } else {
        console.error(
          '[nextmq] NextMQClientProvider requires a "processor" function. ' +
          'Import your processor and pass it via the processor prop.',
        );
      }
      return;
    }
  }, [processor, from]);

  return (
    <LazyNextMQRootClientContextProvider processor={loadedProcessor}>
      {children}
    </LazyNextMQRootClientContextProvider>
  );
}

