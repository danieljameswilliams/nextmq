// tests/requirements.test.ts
/**
 * Tests for the requirements system
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getRequirement, onRequirementsChange, setRequirement } from '../src/requirements'

describe('Requirements System', () => {
  beforeEach(() => {
    // Reset requirements before each test
    setRequirement('test:req1', false)
    setRequirement('test:req2', false)
  })

  it('should return false for unset requirements', () => {
    expect(getRequirement('test:unset')).toBe(false)
  })

  it('should set and get requirement values', () => {
    setRequirement('test:req1', true)
    expect(getRequirement('test:req1')).toBe(true)

    setRequirement('test:req1', false)
    expect(getRequirement('test:req1')).toBe(false)
  })

  it('should not trigger listeners when setting same value', () => {
    setRequirement('test:req1', true)
    const listener = vi.fn()

    onRequirementsChange(listener)
    setRequirement('test:req1', true) // Same value

    // Listener should not be called
    expect(listener).not.toHaveBeenCalled()
  })

  it('should trigger listeners when requirement changes', () => {
    const listener = vi.fn()
    const unsubscribe = onRequirementsChange(listener)

    setRequirement('test:req1', true)
    expect(listener).toHaveBeenCalledTimes(1)

    setRequirement('test:req1', false)
    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()
    setRequirement('test:req1', true)
    // Should not be called after unsubscribe
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('should handle multiple requirements independently', () => {
    setRequirement('test:req1', true)
    setRequirement('test:req2', false)

    expect(getRequirement('test:req1')).toBe(true)
    expect(getRequirement('test:req2')).toBe(false)

    setRequirement('test:req2', true)
    expect(getRequirement('test:req1')).toBe(true)
    expect(getRequirement('test:req2')).toBe(true)
  })

  it('should return unsubscribe function', () => {
    const listener = vi.fn()
    const unsubscribe = onRequirementsChange(listener)

    expect(typeof unsubscribe).toBe('function')

    unsubscribe()
    setRequirement('test:req1', true)
    expect(listener).not.toHaveBeenCalled()
  })
})
