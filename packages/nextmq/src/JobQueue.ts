// src/JobQueue.ts
/**
 * JobQueue - Core queue system for processing jobs asynchronously
 * 
 * **Simple Flow:** CustomEvent → EventBridge → Provider → Processor → Handler
 * 
 * This queue:
 * - Queues jobs and processes them sequentially
 * - Gates jobs until requirements are met (e.g., user consent)
 * - Renders JSX components returned from processors
 * - Processes one job at a time to avoid blocking
 * 
 * @example
 * ```ts
 * const queue = new JobQueue();
 * queue.setProcessor(async (job) => {
 *   // Route to handler based on job.type
 *   const handler = await import(`./handlers/${job.type}`);
 *   return handler.default(job);
 * });
 * ```
 */

'use client';

import { isValidElement } from 'react';
import type React from 'react';
import { getRequirement, onRequirementsChange, type RequirementKey } from './requirements';

/** Job type identifier (e.g., 'cart.add', 'track.event') */
export type JobType = string;

/** Job structure containing type, payload, and optional requirements */
export interface Job<TPayload = unknown> {
  /** Unique job identifier */
  id: string;
  /** Job type (used to route to handler) */
  type: JobType;
  /** Job payload data */
  payload: TPayload;
  /** Optional requirement keys that must be met before processing */
  requirements?: RequirementKey[];
  /** Timestamp when job was created */
  createdAt: number;
}

/** Result that a processor can return (void, JSX, or null) */
export type ProcessorResult = void | React.ReactElement | null;

/** Processor function that routes jobs to handlers using dynamic imports */
export type Processor<TPayload = unknown> = (job: Job<TPayload>) => Promise<ProcessorResult>;

/** Callback for rendering JSX components returned from processors */
export type RenderCallback = (element: React.ReactElement | null, jobId: string) => void;

export class JobQueue {
  private queue: Job[] = [];
  private processor: Processor<any> | null = null;
  private isProcessing = false;
  private renderCallback: RenderCallback | null = null;

  constructor() {
    onRequirementsChange(() => {
      void this.process();
    });
  }

  /**
   * Register the single processor function that handles all job types.
   * The processor should handle routing to code-split handlers based on job.type.
   */
  setProcessor(processor: Processor<any>) {
    this.processor = processor;
    // Process any queued jobs now that processor is ready
    void this.process();
  }

  /**
   * Register a callback to handle JSX rendering from processors.
   * When a processor returns JSX, this callback will be invoked.
   */
  setRenderCallback(callback: RenderCallback | null) {
    this.renderCallback = callback;
  }

  /**
   * Enqueue a new job for processing.
   * 
   * @param type - Job type identifier (e.g., 'cart.add')
   * @param payload - Job payload data
   * @param requirements - Optional requirement keys that must be met before processing
   * @returns Job ID for tracking
   */
  enqueue<TPayload>(
    type: JobType,
    payload: TPayload,
    requirements: RequirementKey[] = [],
  ): string {
    const job: Job<TPayload> = {
      id: this.generateJobId(),
      type,
      payload,
      requirements,
      createdAt: Date.now(),
    };

    this.queue.push(job);
    void this.process();
    return job.id;
  }

  /**
   * Generate a unique job ID.
   * Uses crypto.randomUUID() if available, otherwise falls back to random string.
   */
  private generateJobId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  private requirementsMet(job: Job) {
    if (!job.requirements?.length) return true;
    return job.requirements.every((k) => getRequirement(k));
  }

  /**
   * Process jobs from the queue sequentially.
   * Only processes jobs that meet their requirements.
   * Yields to the event loop between jobs to avoid blocking.
   */
  private async process() {
    if (this.isProcessing || !this.processor) return;
    
    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        // Find first job that meets requirements
        const jobIndex = this.queue.findIndex((job) => this.requirementsMet(job));
        
        // No processable job found
        if (jobIndex === -1) break;

        // Remove and process the job
        const job = this.queue.splice(jobIndex, 1)[0];
        if (!job) break;

        try {
          const result = await this.processor(job);
          
          // Render JSX if processor returned a React element
          if (result && isValidElement(result) && this.renderCallback) {
            this.renderCallback(result, job.id);
          }
        } catch (err) {
          console.error('[nextmq] Job processing failed:', {
            jobId: job.id,
            jobType: job.type,
            error: err,
          });
        }

        // Yield to event loop before processing next job
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } finally {
      this.isProcessing = false;
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
    };
  }
}