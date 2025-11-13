'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import type { Processor } from './JobQueue';
import type { ReactNode } from 'react';
import type { ComponentType } from 'react';

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
 * **Usage:**
 * ```tsx
 * // app/processors.ts
 * 'use client';
 * import type { Processor } from 'nextmq';
 * 
 * const processor: Processor = async (job) => {
 *   switch (job.type) {
 *     case 'cart.add': {
 *       const handler = await import('./handlers/cartAdd');
 *       return handler.default(job);
 *     }
 *     case 'cart.remove': {
 *       const handler = await import('./handlers/cartRemove');
 *       return handler.default(job);
 *     }
 *     default:
 *       console.warn('[nextmq] Unknown job type:', job.type);
 *   }
 * };
 * 
 * export default processor;
 * ```
 * 
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
 * 
 * @param children - React children
 * @param processor - Processor function that handles job routing with static imports
 */
export function NextMQClientProvider({
  children,
  processor,
}: {
  children: React.ReactNode;
  processor: Processor<any>;
}) {
  useEffect(() => {
    if (typeof processor !== 'function') {
      console.error(
        '[nextmq] NextMQClientProvider requires a "processor" function. ' +
        'Create a processor with static import() calls for Next.js code splitting.',
      );
    }
  }, [processor]);

  return (
    <LazyNextMQRootClientContextProvider processor={processor}>
      {children}
    </LazyNextMQRootClientContextProvider>
  );
}

