/**
 * useJobStatus - React hook for tracking job status
 *
 * Subscribe to job status changes and get real-time updates on job processing.
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
 * @param jobId - The job ID to track (from add return value)
 * @returns Object with status, result, and error
 *
 * @example
 * ```tsx
 * function AddToCartButton({ productId }) {
 *   const [jobId, setJobId] = useState<string | null>(null);
 *   const { status, error } = useJobStatus(jobId);
 *   const queue = useNextmq();
 *
 *   const handleClick = () => {
 *     const id = queue.add('cart.add', { ean: productId });
 *     if (id) setJobId(id);
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
    if (jobId) {
      return queue.getJobStatus(jobId)
    }
    return null
  })

  const currentJobIdRef = useRef(jobId)

  useEffect(() => {
    currentJobIdRef.current = jobId

    if (jobId) {
      const initialStatus = queue.getJobStatus(jobId)
      if (initialStatus) {
        setStatusInfo(initialStatus)
      } else {
        setStatusInfo({
          status: 'pending',
        })
      }
    } else {
      setStatusInfo(null)
    }
  }, [jobId, queue])

  useEffect(() => {
    if (!jobId) return

    const unsubscribe = queue.subscribeToJobStatus((updatedJobId, updatedStatus) => {
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
