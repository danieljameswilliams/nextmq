// src/useJobStatus.ts
/**
 * useJobStatus - React hook for tracking job status
 *
 * Subscribe to job status changes and get real-time updates on job processing.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { status, result, error } = useJobStatus(jobId);
 *
 *   if (status === 'processing') return <Spinner />;
 *   if (status === 'failed') return <Error error={error} />;
 *   return <Success data={result} />;
 * }
 * ```
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import type { JobStatus, JobStatusInfo } from './job-queue'
import { useNextmq } from './provider'

export interface UseJobStatusReturn {
  /** Current job status */
  status: JobStatus | null
  /** Job result (if completed successfully) */
  result: unknown
  /** Job error (if failed) */
  error: Error | unknown | undefined
}

/**
 * Hook to track job status in real-time
 *
 * @param jobId - The job ID to track (from enqueue return value)
 * @returns Object with status, result, and error
 *
 * @example
 * ```tsx
 * function AddToCartButton({ productId }) {
 *   const [jobId, setJobId] = useState<string | null>(null);
 *   const { status, error } = useJobStatus(jobId);
 *
 *   const handleClick = () => {
 *     const id = dispatchCartAdd(productId);
 *     setJobId(id);
 *   };
 *
 *   if (status === 'processing') {
 *     return <button disabled>Adding...</button>;
 *   }
 *   if (status === 'failed') {
 *     return <button onClick={handleClick}>Retry</button>;
 *   }
 *   return <button onClick={handleClick}>Add to Cart</button>;
 * }
 * ```
 */
export function useJobStatus(jobId: string | null): UseJobStatusReturn {
  const queue = useNextmq()
  const [statusInfo, setStatusInfo] = useState<JobStatusInfo | null>(() => {
    // Get initial status if jobId is provided
    if (jobId) {
      return queue.getJobStatus(jobId)
    }
    return null
  })

  // Track the current jobId to avoid stale updates
  const currentJobIdRef = useRef(jobId)

  useEffect(() => {
    currentJobIdRef.current = jobId

    // Get initial status
    if (jobId) {
      const initialStatus = queue.getJobStatus(jobId)
      if (initialStatus) {
        setStatusInfo(initialStatus)
      } else {
        // Job not found yet, set to pending
        setStatusInfo({
          status: 'pending',
        })
      }
    } else {
      setStatusInfo(null)
    }
  }, [jobId, queue])

  // Subscribe to status changes
  useEffect(() => {
    if (!jobId) return

    const unsubscribe = queue.subscribeToJobStatus((updatedJobId, updatedStatus) => {
      // Only update if this is the job we're tracking
      if (updatedJobId === currentJobIdRef.current) {
        setStatusInfo(updatedStatus)
      }
    })

    return unsubscribe
  }, [jobId, queue])

  return {
    status: statusInfo?.status ?? null,
    result: statusInfo?.result,
    error: statusInfo?.error,
  }
}
