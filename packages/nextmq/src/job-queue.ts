/**
 * JobQueue - Core queue system for processing jobs asynchronously
 *
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 *
 * Queues jobs, gates until requirements are met, renders JSX from processors,
 * and processes one job at a time to avoid blocking.
 */

'use client'

import type React from 'react'
import { isValidElement } from 'react'
import { getRequirement, onRequirementsChange, type RequirementKey } from './requirements'

/** Job type identifier (e.g., 'cart.add', 'track.event') */
export type JobType = string

/** Job structure containing type, payload, and optional requirements */
export interface Job<TPayload = unknown> {
  /** Unique job identifier */
  id: string
  /** Job type (used to route to handler) */
  type: JobType
  /** Job payload data */
  payload: TPayload
  /** Optional requirement keys that must be met before processing */
  requirements?: RequirementKey[]
  /** Optional deduplication key - jobs with the same dedupeKey will replace previous queued jobs (enables debouncing when combined with delay) */
  dedupeKey?: string
  /** Optional delay in milliseconds before processing. Job will wait until createdAt + delay has passed. Combine with dedupeKey for debouncing. */
  delay?: number
  /** Timestamp when job was created */
  createdAt: number
}

/** Result that a processor can return (void, JSX, or null) */
export type ProcessorResult = undefined | React.ReactElement | null

/** Processor function that routes jobs to handlers using dynamic imports */
export type Processor<TPayload = unknown> = (job: Job<TPayload>) => Promise<ProcessorResult>

/** Callback for rendering JSX components returned from processors */
export type RenderCallback = (element: React.ReactElement | null, jobId: string) => void

/** Job status type */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

/** Job status information */
export interface JobStatusInfo {
  status: JobStatus
  result?: ProcessorResult
  error?: Error | unknown
  job?: Job
}

/** Callback for job status changes */
export type JobStatusCallback = (jobId: string, status: JobStatusInfo) => void

export class JobQueue {
  private queue: Job[] = []
  private processor: Processor<unknown> | null = null
  private isProcessing = false
  private renderCallback: RenderCallback | null = null
  /** Track completed jobs by dedupeKey to prevent duplicates across page lifecycle */
  private completedJobs: Set<string> = new Set()
  /** Track job status and results */
  private jobStatuses: Map<string, JobStatusInfo> = new Map()
  /** Subscribers to job status changes */
  private statusSubscribers: Set<JobStatusCallback> = new Set()

  constructor() {
    onRequirementsChange(() => {
      void this.process()
    })
  }

  /**
   * Register the single processor function that handles all job types.
   * The processor should handle routing to code-split handlers based on job.type.
   */
  setProcessor(processor: Processor<unknown>) {
    if (typeof processor !== 'function') {
      const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
      if (isDevelopment) {
        console.error('[nextmq] ❌ JobQueue.setProcessor() requires a function.\n' + 'The processor must be an async function that routes jobs to handlers.')
      }
      return
    }

    this.processor = processor
    void this.process()
  }

  /**
   * Register a callback to handle JSX rendering from processors.
   * When a processor returns JSX, this callback will be invoked.
   */
  setRenderCallback(callback: RenderCallback | null) {
    this.renderCallback = callback
  }

  /**
   * Enqueue a new job for processing.
   *
   * @param type - Job type identifier (e.g., 'cart.add')
   * @param payload - Job payload data
   * @param requirements - Optional requirement keys that must be met before processing
   * @param dedupeKey - Optional deduplication key. Behavior depends on job state:
   *   - If already completed: job is skipped (deduplication)
   *   - If already queued: previous job is replaced (enables debouncing when combined with delay)
   * @param delay - Optional delay in milliseconds before processing. Job will wait until createdAt + delay has passed
   * @returns Job ID for tracking, or null if job was deduplicated (already completed)
   *
   * @example
   * // Debouncing: delay + dedupeKey
   * queue.enqueue('search.perform', { query: 'nextjs' }, [], 'search-query', 300);
   * // Multiple calls with same dedupeKey:
   * // - If already queued: replaces previous job (resets delay timer)
   * // - If already completed: skipped (deduplication)
   * // Only the last queued job executes after 300ms delay
   */
  enqueue<TPayload>(type: JobType, payload: TPayload, requirements: RequirementKey[] = [], dedupeKey?: string, delay?: number): string | null {
    if (dedupeKey) {
      if (this.completedJobs.has(dedupeKey)) {
        const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
        if (isDevelopment) {
          console.log(`[nextmq] ⏭️ Job skipped (duplicate): "${type}" with dedupeKey "${dedupeKey}" - already processed`)
        }
        return null
      }

      const existingJobIndex = this.queue.findIndex((job) => job.dedupeKey === dedupeKey)
      if (existingJobIndex !== -1) {
        const existingJob = this.queue[existingJobIndex]
        if (existingJob) {
          this.queue.splice(existingJobIndex, 1)
          this.updateJobStatus(existingJob.id, {
            status: 'pending',
            job: existingJob,
          })
          const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
          if (isDevelopment) {
            console.log(`[nextmq] 🔄 Job replaced (debounce): "${type}" with dedupeKey "${dedupeKey}" - previous queued job cancelled`)
          }
        }
      }
    }

    const job: Job<TPayload> = {
      id: this.generateJobId(),
      type,
      payload,
      requirements,
      dedupeKey,
      delay,
      createdAt: Date.now(),
    }

    this.updateJobStatus(job.id, {
      status: 'pending',
      job,
    })

    this.queue.push(job)
    void this.process()
    return job.id
  }

  /**
   * Update job status and notify subscribers
   */
  private updateJobStatus(jobId: string, statusInfo: JobStatusInfo) {
    this.jobStatuses.set(jobId, statusInfo)
    // Notify all subscribers
    this.statusSubscribers.forEach((callback) => {
      try {
        callback(jobId, statusInfo)
      } catch (err) {
        // Ignore errors from subscribers
        const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
        if (isDevelopment) {
          console.error('[nextmq] Error in job status subscriber:', err)
        }
      }
    })
  }

  /**
   * Subscribe to job status changes
   * @returns Unsubscribe function
   */
  subscribeToJobStatus(callback: JobStatusCallback): () => void {
    this.statusSubscribers.add(callback)
    // Immediately notify about existing job statuses
    this.jobStatuses.forEach((statusInfo, jobId) => {
      try {
        callback(jobId, statusInfo)
      } catch (_err) {
        // Ignore errors
      }
    })
    return () => {
      this.statusSubscribers.delete(callback)
    }
  }

  /**
   * Get current job status
   */
  getJobStatus(jobId: string): JobStatusInfo | null {
    return this.jobStatuses.get(jobId) || null
  }

  /**
   * Generate a unique job ID.
   * Uses crypto.randomUUID() if available, otherwise falls back to random string.
   */
  private generateJobId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  private requirementsMet(job: Job) {
    if (!job.requirements?.length) return true
    return job.requirements.every((k) => getRequirement(k))
  }

  private delayElapsed(job: Job) {
    if (!job.delay) return true
    return Date.now() >= job.createdAt + job.delay
  }

  /**
   * Process jobs from the queue sequentially.
   * Only processes jobs that meet their requirements.
   * Yields to the event loop between jobs to avoid blocking.
   */
  private async process() {
    if (this.isProcessing || !this.processor) return

    this.isProcessing = true

    try {
      while (this.queue.length > 0) {
        const jobIndex = this.queue.findIndex((job) => this.requirementsMet(job) && this.delayElapsed(job))

        if (jobIndex === -1) {
          const hasDelayedJobs = this.queue.some((job) => job.delay && !this.delayElapsed(job))
          if (hasDelayedJobs) {
            const delayedJobs = this.queue.filter((job) => job.delay && !this.delayElapsed(job))
            if (delayedJobs.length > 0) {
              const earliestDelay = Math.min(...delayedJobs.map((job) => job.createdAt + (job.delay || 0) - Date.now()))
              await new Promise((resolve) => setTimeout(resolve, Math.max(0, Math.min(earliestDelay, 1000))))
              continue
            }
          }
          break
        }

        const job = this.queue.splice(jobIndex, 1)[0]
        if (!job) break

        this.updateJobStatus(job.id, {
          status: 'processing',
          job,
        })

        try {
          const result = await this.processor(job)

          if (job.dedupeKey) {
            this.completedJobs.add(job.dedupeKey)
          }

          this.updateJobStatus(job.id, {
            status: 'completed',
            result,
            job,
          })

          if (result && isValidElement(result) && this.renderCallback) {
            this.renderCallback(result, job.id)
          }
        } catch (err) {
          if (job.dedupeKey) {
            this.completedJobs.add(job.dedupeKey)
          }

          this.updateJobStatus(job.id, {
            status: 'failed',
            error: err,
            job,
          })

          const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

          if (isDevelopment) {
            console.error(`[nextmq] ❌ Job processing failed: "${job.type}"\nJob ID: ${job.id}\nError: ${err instanceof Error ? err.message : String(err)}\n${err instanceof Error && err.stack ? `\nStack trace:\n${err.stack}` : ''}`)
          } else {
            console.error('[nextmq] Job processing failed:', {
              jobId: job.id,
              jobType: job.type,
              error: err,
            })
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Debug method: Get current queue state
   * @internal For DevTools only
   */
  getDebugState() {
    return {
      queue: this.queue.map((job) => ({
        ...job,
        requirementsMet: this.requirementsMet(job),
        hasProcessor: this.processor !== null,
      })),
      isProcessing: this.isProcessing,
      processorReady: this.processor !== null,
      completedJobsCount: this.completedJobs.size,
    }
  }
}
