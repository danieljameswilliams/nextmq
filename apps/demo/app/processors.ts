// app/processors.ts
'use client';

// Single processor with code-split handlers - lazy-loaded with the provider
import type { Processor } from 'nextmq';

/**
 * Single processor that routes to code-split handlers based on job.type.
 * This keeps InitialJS small - handlers are only loaded when needed.
 */
const processor: Processor = async (job) => {
  switch (job.type) {
    case 'cart.add': {
      // Code-split: handler only loads when this job type is processed
      // All code in cartAdd.tsx (including JSX components) will be bundled together
      const handler = await import('./handlers/cartAdd');
      return handler.default(job);
    }

    case 'cart.remove': {
      // Code-split: handler only loads when this job type is processed
      const handler = await import('./handlers/cartRemove');
      return handler.default(job);
    }

    default:
      console.warn('[nextmq] Unknown job type:', job.type);
  }
};

// Export as both named and default for flexibility
export { processor };
export default processor;

