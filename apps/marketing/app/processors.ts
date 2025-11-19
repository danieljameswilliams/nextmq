'use client'

import type { Job, Processor } from 'nextmq'

const processor: Processor = async (job) => {
  switch (job.type) {
    case 'demo.notification': {
      const handler = await import('./handlers/demoNotification')
      return handler.default(job as Job<{ message: string }>)
    }
    case 'demo.portal': {
      const handler = await import('./handlers/demoPortal')
      return handler.default(job as Job<{ title: string; content: string }>)
    }
    case 'demo.analytics': {
      const handler = await import('./handlers/demoAnalytics')
      return handler.default(job as Job<{ event: string; data?: Record<string, unknown> }>)
    }
    case 'cart.add': {
      const handler = await import('./handlers/cartAdd')
      return handler.default(job as Job<{ ean: string; quantity: number }>)
    }
    default:
      console.warn('[nextmq] Unknown job type:', job.type)
  }
}

export default processor
