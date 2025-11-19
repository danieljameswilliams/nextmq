/**
 * NextMQ Events - CustomEvent definitions for job dispatching
 *
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 *
 * Dispatch jobs using CustomEvents. The EventBridge listens and routes to JobQueue.
 */

import type { JobType } from './job-queue'
import type { RequirementKey } from './requirements'

/** Event name for NextMQ job dispatching */
export const NEXTMQ_EVENT_NAME = 'nextmq'

/** Event detail structure for NextMQ CustomEvents */
export interface NextmqEventDetail {
  /** Job type identifier (e.g., 'cart.add', 'track.event') */
  type: JobType
  /** Job payload data */
  payload: unknown
  /** Optional requirement keys that must be met before processing */
  requirements?: RequirementKey[]
  /** Optional deduplication key. Jobs with the same dedupeKey will be skipped if already processed or queued */
  dedupeKey?: string
  /** Optional delay in milliseconds before processing. Job will wait until createdAt + delay has passed */
  delay?: number
}
