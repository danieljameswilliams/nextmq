// src/events.ts
/**
 * NextMQ Events - CustomEvent definitions for job dispatching
 * 
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 * 
 * Dispatch jobs using CustomEvents. The EventBridge listens for these events
 * and routes them to the JobQueue.
 * 
 * @example
 * ```ts
 * import { NEXTMQ_EVENT_NAME } from 'nextmq';
 * 
 * window.dispatchEvent(
 *   new CustomEvent(NEXTMQ_EVENT_NAME, {
 *     detail: {
 *       type: 'cart.add',
 *       payload: { ean: '123', quantity: 1 },
 *       requirements: ['necessaryConsent'], // Optional: gate until requirement is met
 *       delay: 500 // Optional: delay in milliseconds before processing
 *     }
 *   })
 * );
 * ```
 */

import type { JobType } from './JobQueue';
import type { RequirementKey } from './requirements';

/** Event name for NextMQ job dispatching */
export const NEXTMQ_EVENT_NAME = 'nextmq';

/** Event detail structure for NextMQ CustomEvents */
export interface NextmqEventDetail {
  /** Job type identifier (e.g., 'cart.add', 'track.event') */
  type: JobType;
  /** Job payload data */
  payload: unknown;
  /** Optional requirement keys that must be met before processing */
  requirements?: RequirementKey[];
  /** Optional deduplication key. Jobs with the same dedupeKey will be skipped if already processed or queued */
  dedupeKey?: string;
  /** Optional delay in milliseconds before processing. Job will wait until createdAt + delay has passed */
  delay?: number;
}