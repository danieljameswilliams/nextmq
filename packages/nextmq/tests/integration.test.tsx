// tests/integration.test.tsx
/**
 * Integration tests for the complete NextMQ flow:
 * CustomEvent → EventBridge → Provider → Processor → Handler
 */

import { render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Job, Processor } from '../src'
import { NEXTMQ_EVENT_NAME, NextMQClientProvider, NextMQRootClientEventBridge, setRequirement } from '../src'
import { clearEventBuffer, clearProcessEventCallback } from '../src/event-bridge'

describe('NextMQ Integration Tests', () => {
  beforeEach(() => {
    // Reset requirements before each test
    setRequirement('test:requirement', false)
    setRequirement('test:requirement2', false)

    // Clear event buffer and callbacks
    clearProcessEventCallback()
    clearEventBuffer()

    // Clear any existing providers from DOM
    if (typeof document !== 'undefined') {
      const providers = document.querySelectorAll('[data-nextmq-provider]')
      providers.forEach((p) => {
        p.remove()
      })
    }
  })

  afterEach(() => {
    // Clean up any rendered components
    if (typeof document !== 'undefined') {
      const providers = document.querySelectorAll('[data-nextmq-provider]')
      providers.forEach((p) => {
        p.remove()
      })
    }
  })

  afterEach(() => {
    // Clean up requirements after each test
    setRequirement('test:requirement', false)
    setRequirement('test:requirement2', false)
  })

  describe('Full Flow: CustomEvent → EventBridge → Provider → Processor → Handler', () => {
    it('should process a job dispatched via CustomEvent', async () => {
      const processorSpy = vi.fn<Parameters<Processor>, ReturnType<Processor>>()

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        processorSpy(job)
        if (job.type === 'test.job') {
          return undefined
        }
      }

      render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      // Dispatch a CustomEvent
      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: {
            type: 'test.job',
            payload: { message: 'Hello World' },
          },
        })
      )

      // Wait for processing
      await waitFor(
        () => {
          expect(processorSpy).toHaveBeenCalledTimes(1)
        },
        { timeout: 1000 }
      )

      const calledJob = processorSpy.mock.calls[0]?.[0]
      expect(calledJob).toBeDefined()
      expect(calledJob?.type).toBe('test.job')
      expect(calledJob?.payload).toEqual({ message: 'Hello World' })
    })

    it('should process multiple jobs in sequence', async () => {
      const processingOrder: string[] = []

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        processingOrder.push(job.type)
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      // Dispatch multiple events
      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'job.1', payload: {} },
        })
      )

      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'job.2', payload: {} },
        })
      )

      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'job.3', payload: {} },
        })
      )

      // Wait for all jobs to process
      await waitFor(
        () => {
          // Filter out validation test jobs
          const actualJobs = processingOrder.filter((type) => type !== '__nextmq_validation_test__')
          // Allow for validation jobs but ensure our 3 jobs are processed
          expect(actualJobs.length).toBeGreaterThanOrEqual(3)
          expect(actualJobs).toContain('job.1')
          expect(actualJobs).toContain('job.2')
          expect(actualJobs).toContain('job.3')
        },
        { timeout: 2000 }
      )

      // Verify sequential processing (filter out validation jobs)
      const actualJobs = processingOrder.filter((type) => type !== '__nextmq_validation_test__')
      // Find our jobs in order (they should be sequential)
      const job1Index = actualJobs.indexOf('job.1')
      const job2Index = actualJobs.indexOf('job.2')
      const job3Index = actualJobs.indexOf('job.3')
      expect(job1Index).toBeGreaterThanOrEqual(0)
      expect(job2Index).toBeGreaterThanOrEqual(0)
      expect(job3Index).toBeGreaterThanOrEqual(0)
      expect(job1Index).toBeLessThan(job2Index)
      expect(job2Index).toBeLessThan(job3Index)
    })

    it('should handle jobs with requirements', async () => {
      const processorSpy = vi.fn()

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        processorSpy(job.type)
      }

      render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      // Dispatch job with requirement that is not met
      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: {
            type: 'test.requirement',
            payload: {},
            requirements: ['test:requirement'],
          },
        })
      )

      // Wait a bit - job should not process
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(processorSpy).not.toHaveBeenCalled()

      // Set requirement to true
      setRequirement('test:requirement', true)

      // Now job should process
      await waitFor(
        () => {
          expect(processorSpy).toHaveBeenCalledWith('test.requirement')
        },
        { timeout: 1000 }
      )
    })

    it('should handle jobs with multiple requirements', async () => {
      const processorSpy = vi.fn()

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        processorSpy(job.type)
      }

      render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      // Dispatch job with multiple requirements
      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: {
            type: 'test.multi',
            payload: {},
            requirements: ['test:requirement', 'test:requirement2'],
          },
        })
      )

      // Set only one requirement - job should not process
      setRequirement('test:requirement', true)
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(processorSpy).not.toHaveBeenCalled()

      // Set second requirement - now job should process
      setRequirement('test:requirement2', true)
      await waitFor(
        () => {
          expect(processorSpy).toHaveBeenCalledWith('test.multi')
        },
        { timeout: 1000 }
      )
    })

    it('should buffer events when processor is not ready', async () => {
      const processorSpy = vi.fn()

      // Render EventBridge first (without Provider)
      const { rerender } = render(<NextMQRootClientEventBridge />)

      // Dispatch events before processor is ready
      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'buffered.job', payload: { id: 1 } },
        })
      )

      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'buffered.job', payload: { id: 2 } },
        })
      )

      // Events should be buffered
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(processorSpy).not.toHaveBeenCalled()

      // Now add Provider with processor - keep EventBridge mounted
      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        processorSpy(job.payload)
      }

      // Rerender with Provider - this should trigger processing of buffered events
      rerender(
        <>
          <NextMQRootClientEventBridge />
          <NextMQClientProvider processor={processor}>
            <div />
          </NextMQClientProvider>
        </>
      )

      // Wait for React effects to run and processor to be set
      // The callback effect runs first (enqueuing buffered events),
      // then the processor effect runs (processing queued jobs)
      await new Promise((resolve) => setTimeout(resolve, 200))

      // Buffered events should now process
      await waitFor(
        () => {
          // Filter out validation test calls - look for our buffered jobs
          const actualCalls = processorSpy.mock.calls.map((call) => call[0]).filter((payload) => payload && typeof payload === 'object' && 'id' in payload && (payload as { id: unknown }).id !== '__nextmq_validation_test__')
          expect(actualCalls.length).toBeGreaterThanOrEqual(2)
        },
        { timeout: 3000 }
      )

      // Verify the buffered events were processed
      const actualCalls = processorSpy.mock.calls
        .map((call) => call[0])
        .filter((payload) => payload && typeof payload === 'object' && 'id' in payload)
        .filter((payload) => (payload as { id: unknown }).id !== '__nextmq_validation_test__')

      const callIds = actualCalls.map((call) => (call as { id: number }).id)
      expect(callIds).toContain(1)
      expect(callIds).toContain(2)
    })
  })

  describe('JSX Rendering from Processors', () => {
    it('should render JSX components returned from processors', async () => {
      const TestComponent = ({ message }: { message: string }) => <div data-testid="rendered-component">{message}</div>

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        if (job.type === 'render.test') {
          return <TestComponent message={job.payload as string} />
        }
      }

      const { getByTestId } = render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      // Dispatch event that returns JSX
      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: {
            type: 'render.test',
            payload: 'Hello from processor',
          },
        })
      )

      // Wait for component to render
      await waitFor(
        () => {
          const element = getByTestId('rendered-component')
          expect(element).toBeDefined()
          expect(element.textContent).toBe('Hello from processor')
        },
        { timeout: 1000 }
      )
    })

    it('should handle null/undefined returns from processors', async () => {
      const processorSpy = vi.fn()

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        processorSpy(job.type)
        // Return nothing (undefined)
        return undefined
      }

      const { container } = render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'void.job', payload: {} },
        })
      )

      await waitFor(
        () => {
          expect(processorSpy).toHaveBeenCalledWith('void.job')
        },
        { timeout: 1000 }
      )

      // Should not have render slot
      const renderSlot = container.querySelector('[data-nextmq-render-slot]')
      expect(renderSlot).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should continue processing after a processor error', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const successSpy = vi.fn()

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        if (job.type === 'error.job') {
          throw new Error('Processor error')
        } else if (job.type === 'success.job') {
          successSpy()
        }
      }

      render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      // Dispatch error job
      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'error.job', payload: {} },
        })
      )

      // Dispatch success job
      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'success.job', payload: {} },
        })
      )

      // Wait for both to process
      await waitFor(
        () => {
          expect(errorSpy).toHaveBeenCalled()
          expect(successSpy).toHaveBeenCalled()
        },
        { timeout: 1000 }
      )

      errorSpy.mockRestore()
    })

    it('should log error details correctly', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        throw new Error('Test error')
      }

      render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'error.test', payload: { data: 'test' } },
        })
      )

      await waitFor(
        () => {
          expect(errorSpy).toHaveBeenCalled()
          const errorCall = errorSpy.mock.calls.find((call) => call[0]?.toString().includes('error.test'))
          expect(errorCall).toBeDefined()
          if (errorCall?.[0]) {
            const errorMsg = String(errorCall[0])
            expect(errorMsg).toContain('[nextmq]')
            expect(errorMsg).toContain('error.test')
          }
        },
        { timeout: 1000 }
      )

      errorSpy.mockRestore()
    })
  })

  describe('Job Queue Behavior', () => {
    it('should generate unique job IDs', async () => {
      const jobIds = new Set<string>()
      const processedTypes = new Set<string>()

      const processor: Processor = async (job: Job) => {
        // Skip validation test jobs completely
        if (job.type === '__nextmq_validation_test__') {
          return undefined
        }
        // Only count jobs of type 'unique.test'
        if (job.type === 'unique.test') {
          jobIds.add(job.id)
          processedTypes.add(job.type)
        }
      }

      render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      // Wait a bit for validation to complete
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Dispatch multiple jobs
      for (let i = 0; i < 5; i++) {
        window.dispatchEvent(
          new CustomEvent(NEXTMQ_EVENT_NAME, {
            detail: { type: 'unique.test', payload: { index: i } },
          })
        )
      }

      await waitFor(
        () => {
          // Filter to only count 'unique.test' jobs, ignoring validation jobs
          expect(jobIds.size).toBeGreaterThanOrEqual(5)
        },
        { timeout: 2000 }
      )

      // Verify we have at least 5 unique job IDs (may have more due to validation)
      expect(jobIds.size).toBeGreaterThanOrEqual(5)
      // Verify all are unique
      expect(jobIds.size).toBe(new Set(Array.from(jobIds)).size)
    })

    it('should include createdAt timestamp in jobs', async () => {
      const beforeTime = Date.now()
      let jobCreatedAt = 0

      const processor: Processor = async (job: Job) => {
        jobCreatedAt = job.createdAt
      }

      render(
        <NextMQClientProvider processor={processor}>
          <NextMQRootClientEventBridge />
        </NextMQClientProvider>
      )

      window.dispatchEvent(
        new CustomEvent(NEXTMQ_EVENT_NAME, {
          detail: { type: 'timestamp.test', payload: {} },
        })
      )

      await waitFor(
        () => {
          expect(jobCreatedAt).toBeGreaterThanOrEqual(beforeTime)
          expect(jobCreatedAt).toBeLessThanOrEqual(Date.now())
        },
        { timeout: 1000 }
      )
    })
  })
})
