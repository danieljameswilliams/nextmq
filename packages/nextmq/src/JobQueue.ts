// src/JobQueue.ts
'use client';

import type React from 'react';
import { getRequirement, onRequirementsChange, type RequirementKey } from './requirements';

export type JobType = string; // also generic

export interface Job<TPayload = any> {
  id: string;
  type: JobType;
  payload: TPayload;
  requirements?: RequirementKey[];
  createdAt: number;
}

export type ProcessorResult = void | React.ReactElement | null;
export type Processor<TPayload = any> = (job: Job<TPayload>) => Promise<ProcessorResult>;
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

  enqueue<TPayload>(
    type: JobType,
    payload: TPayload,
    requirements: RequirementKey[] = [],
  ) {
    const job: Job<TPayload> = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      type,
      payload,
      requirements,
      createdAt: Date.now(),
    };

    this.queue.push(job);
    void this.process();
    return job.id;
  }

  private requirementsMet(job: Job) {
    if (!job.requirements?.length) return true;
    return job.requirements.every((k) => getRequirement(k));
  }

  private async process() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Process one job at a time to avoid blocking the event loop
      // This ensures the queue is checked efficiently without CPU hogging
      while (this.queue.length > 0) {
        // Find the first job that meets requirements and has a processor
        let jobIndex = -1;
        let job: Job | null = null;
        let handler: Processor<any> | null = null;

        for (let i = 0; i < this.queue.length; i++) {
          const candidateJob = this.queue[i];
          if (!candidateJob) continue;

          if (!this.requirementsMet(candidateJob)) continue;

          // Check if processor is set
          if (!this.processor) break;

          // Found a processable job
          jobIndex = i;
          job = candidateJob;
          handler = this.processor;
          break;
        }

        // No processable job found, exit
        if (jobIndex === -1 || !job || !handler) {
          break;
        }

        // Remove job from queue before processing
        this.queue.splice(jobIndex, 1);

        // Process the job asynchronously
        try {
          const result = await handler(job);
          // If processor returned JSX, render it via callback
          // Check if it's a React element (has type, props, and key properties)
          if (
            result &&
            typeof result === 'object' &&
            'type' in result &&
            'props' in result &&
            (typeof (result as any).type === 'string' ||
              typeof (result as any).type === 'function' ||
              typeof (result as any).type === 'object')
          ) {
            // It's a React element
            if (this.renderCallback) {
              this.renderCallback(result as React.ReactElement, job.id);
            }
          }
        } catch (err) {
          // In v0 we just log
          console.error('[nextmq] Job failed', job, err);
        }

        // Yield to event loop after processing each job
        // This prevents blocking and keeps CPU usage low
        await new Promise((resolve) => {
          // Use setTimeout(0) to yield to event loop
          // This is more performant than requestIdleCallback for this use case
          setTimeout(resolve, 0);
        });
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