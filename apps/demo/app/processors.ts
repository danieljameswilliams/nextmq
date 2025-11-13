// app/processors.ts
'use client';

import type { Processor } from 'nextmq';

// Processor with static imports for Next.js code splitting
// Note: We use static import() calls so Next.js can analyze and code-split properly
const processor: Processor = async (job) => {
  switch (job.type) {
    case 'cart.add': {
      const handler = await import('./handlers/cartAdd');
      return handler.default(job as Parameters<typeof handler.default>[0]);
    }

    case 'cart.remove': {
      const handler = await import('./handlers/cartRemove');
      return handler.default(job as Parameters<typeof handler.default>[0]);
    }

    default:
      console.warn('[nextmq] Unknown job type:', job.type);
  }
};

export default processor;
export { processor };

