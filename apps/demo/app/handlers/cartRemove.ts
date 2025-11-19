// app/handlers/cartRemove.ts
// Code-split handler for cart.remove jobs - only loads when needed
import type { Job } from 'nextmq'

export default async function cartRemoveHandler(job: Job<{ ean: string }>) {
  console.log('[cart.remove] Processing job:', job)
  // Simulate API call or cart operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  console.log('[cart.remove] Removed from cart:', job.payload)
}
