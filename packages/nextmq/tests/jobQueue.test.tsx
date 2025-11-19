// tests/jobQueue.test.ts
/**
 * Tests for JobQueue core functionality
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Processor } from '../src/job-queue'
import { JobQueue } from '../src/job-queue'
import { setRequirement } from '../src/requirements'

describe('JobQueue', () => {
  beforeEach(() => {
    setRequirement('cookieConsent:marketing', false)
  })

  describe('Requirements', () => {
    it('does not process jobs until requirements are met', async () => {
      const queue = new JobQueue()
      const handler = vi.fn<Parameters<Processor>, ReturnType<Processor>>()

      queue.setProcessor(handler)

      queue.enqueue('track.relewise', { event: 'TestEvent' }, ['cookieConsent:marketing'])

      // Give queue time to run (it shouldn't)
      await new Promise((r) => setTimeout(r, 50))
      expect(handler).not.toHaveBeenCalled()

      setRequirement('cookieConsent:marketing', true)

      // Now it should process
      await new Promise((r) => setTimeout(r, 50))
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('processes jobs without requirements immediately', async () => {
      const queue = new JobQueue()
      const handler = vi.fn<Parameters<Processor>, ReturnType<Processor>>()

      queue.setProcessor(handler)

      queue.enqueue('immediate.job', { data: 'test' })

      await new Promise((r) => setTimeout(r, 50))
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('Job Processing', () => {
    it('processes jobs sequentially', async () => {
      const queue = new JobQueue()
      const processingOrder: string[] = []

      const processor: Processor = async (job) => {
        processingOrder.push(job.type)
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      queue.setProcessor(processor)

      queue.enqueue('job.1', {})
      queue.enqueue('job.2', {})
      queue.enqueue('job.3', {})

      await new Promise((r) => setTimeout(r, 100))
      expect(processingOrder).toEqual(['job.1', 'job.2', 'job.3'])
    })

    it('generates unique job IDs', () => {
      const queue = new JobQueue()
      const ids = new Set<string>()

      for (let i = 0; i < 10; i++) {
        const id = queue.enqueue('test.job', { index: i })
        ids.add(id)
      }

      expect(ids.size).toBe(10)
    })

    it('includes createdAt timestamp in jobs', async () => {
      const queue = new JobQueue()
      const beforeTime = Date.now()
      let jobCreatedAt = 0

      const processor: Processor = async (job) => {
        jobCreatedAt = job.createdAt
      }

      queue.setProcessor(processor)
      queue.enqueue('timestamp.test', {})

      await new Promise((r) => setTimeout(r, 50))
      expect(jobCreatedAt).toBeGreaterThanOrEqual(beforeTime)
      expect(jobCreatedAt).toBeLessThanOrEqual(Date.now())
    })
  })

  describe('JSX Rendering', () => {
    it('calls render callback when processor returns JSX', async () => {
      const queue = new JobQueue()
      const renderCallback = vi.fn()

      const TestComponent = () => <div>Test</div>

      const processor: Processor = async (job) => {
        if (job.type === 'render.test') {
          return <TestComponent />
        }
      }

      queue.setRenderCallback(renderCallback)
      queue.setProcessor(processor)
      queue.enqueue('render.test', {})

      await new Promise((r) => setTimeout(r, 50))
      expect(renderCallback).toHaveBeenCalledTimes(1)
      expect(renderCallback).toHaveBeenCalledWith(expect.any(Object), expect.any(String))
    })

    it('does not call render callback for void returns', async () => {
      const queue = new JobQueue()
      const renderCallback = vi.fn()

      const processor: Processor = async () => {
        // Return nothing
      }

      queue.setRenderCallback(renderCallback)
      queue.setProcessor(processor)
      queue.enqueue('void.test', {})

      await new Promise((r) => setTimeout(r, 50))
      expect(renderCallback).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('continues processing after error', async () => {
      const queue = new JobQueue()
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const successSpy = vi.fn()

      const processor: Processor = async (job) => {
        if (job.type === 'error.job') {
          throw new Error('Test error')
        } else {
          successSpy()
        }
      }

      queue.setProcessor(processor)
      queue.enqueue('error.job', {})
      queue.enqueue('success.job', {})

      await new Promise((r) => setTimeout(r, 100))
      expect(errorSpy).toHaveBeenCalled()
      expect(successSpy).toHaveBeenCalled()

      errorSpy.mockRestore()
    })
  })

  describe('Debug State', () => {
    it('returns correct debug state', () => {
      const queue = new JobQueue()

      queue.enqueue('test.job', {}, ['test:requirement'])

      const debugState = queue.getDebugState()
      expect(debugState.queue).toHaveLength(1)
      expect(debugState.queue[0]?.type).toBe('test.job')
      expect(debugState.queue[0]?.requirementsMet).toBe(false)
      expect(debugState.processorReady).toBe(false)
      expect(debugState.isProcessing).toBe(false)
    })
  })
})
