import type { Job } from 'nextmq'

export default async function demoAnalyticsHandler(job: Job<{ event: string; data?: Record<string, unknown> }>): Promise<void> {
  // Simulate analytics tracking
  await new Promise((resolve) => setTimeout(resolve, 50))

  console.log('[Analytics]', job.payload.event, job.payload.data)

  // This handler doesn't return JSX, just performs side effects
}
