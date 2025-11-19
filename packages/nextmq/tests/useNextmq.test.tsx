// tests/useNextmq.test.tsx
/**
 * Tests for the useNextmq hook
 */

import { renderHook } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Processor } from '../src'
import { NextMQClientProvider, useNextmq } from '../src'

describe('useNextmq hook', () => {
  it('should return JobQueue instance when used inside Provider', () => {
    const processor: Processor = async () => {}

    const wrapper = ({ children }: { children: React.ReactNode }) => <NextMQClientProvider processor={processor}>{children}</NextMQClientProvider>

    const { result } = renderHook(() => useNextmq(), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current).toHaveProperty('enqueue')
    expect(result.current).toHaveProperty('setProcessor')
    expect(result.current).toHaveProperty('setRenderCallback')
    expect(result.current).toHaveProperty('getDebugState')
  })

  it('should throw error when used outside Provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useNextmq())
    }).toThrow('[nextmq]')

    consoleSpy.mockRestore()
  })

  it('should allow enqueueing jobs via hook', async () => {
    const processorSpy = vi.fn()

    const processor: Processor = async (job) => {
      processorSpy(job.type)
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => <NextMQClientProvider processor={processor}>{children}</NextMQClientProvider>

    const { result } = renderHook(() => useNextmq(), { wrapper })

    // Enqueue a job via hook
    const jobId = result.current.enqueue('hook.test', { data: 'test' })

    expect(jobId).toBeDefined()
    expect(typeof jobId).toBe('string')

    // Wait for processing
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(processorSpy).toHaveBeenCalledWith('hook.test')
  })
})
