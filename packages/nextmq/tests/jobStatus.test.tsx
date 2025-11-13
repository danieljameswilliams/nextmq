// tests/jobStatus.test.tsx
/**
 * Comprehensive tests for job status tracking and useJobStatus hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { JobQueue } from '../src/JobQueue';
import { useJobStatus } from '../src/useJobStatus';
import { NextMQClientProvider, useNextmq, NextmqContext } from '../src/NextMQClientProvider';
import { clearProcessEventCallback, clearEventBuffer } from '../src/NextMQRootClientEventBridge';
import type { Processor, JobStatus } from '../src/JobQueue';

describe('Job Status Tracking', () => {
  beforeEach(() => {
    // Clear any event buffer and callbacks between tests
    clearProcessEventCallback();
    clearEventBuffer();
  });

  describe('getJobStatus', () => {
    it('should return null for non-existent job', () => {
      const queue = new JobQueue();
      expect(queue.getJobStatus('non-existent-id')).toBeNull();
    });

    it('should return pending status for queued job', () => {
      const queue = new JobQueue();
      const jobId = queue.enqueue('test.job', {});
      
      const status = queue.getJobStatus(jobId!);
      expect(status).toBeDefined();
      expect(status?.status).toBe('pending');
      expect(status?.job).toBeDefined();
    });

    it('should return processing status while job is processing', async () => {
      const queue = new JobQueue();
      let statusDuringProcessing: JobStatus | null = null;

      const processor: Processor = async (job) => {
        // Check status while processing
        statusDuringProcessing = queue.getJobStatus(job.id)?.status ?? null;
        await new Promise((resolve) => setTimeout(resolve, 10));
      };

      queue.setProcessor(processor);
      const jobId = queue.enqueue('test.job', {});

      await new Promise((resolve) => setTimeout(resolve, 5));
      expect(statusDuringProcessing).toBe('processing');
    });

    it('should return completed status after successful processing', async () => {
      const queue = new JobQueue();

      const processor: Processor = async () => {
        return 'success';
      };

      queue.setProcessor(processor);
      const jobId = queue.enqueue('test.job', {});

      await new Promise((resolve) => setTimeout(resolve, 50));

      const status = queue.getJobStatus(jobId!);
      expect(status?.status).toBe('completed');
      expect(status?.result).toBe('success');
      expect(status?.error).toBeUndefined();
    });

    it('should return failed status after error', async () => {
      const queue = new JobQueue();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const processor: Processor = async () => {
        throw new Error('Test error');
      };

      queue.setProcessor(processor);
      const jobId = queue.enqueue('test.job', {});

      await new Promise((resolve) => setTimeout(resolve, 50));

      const status = queue.getJobStatus(jobId!);
      expect(status?.status).toBe('failed');
      expect(status?.error).toBeDefined();
      expect(status?.result).toBeUndefined();

      errorSpy.mockRestore();
    });

    it('should include job details in status', async () => {
      const queue = new JobQueue();

      const processor: Processor = async () => {};

      queue.setProcessor(processor);
      const jobId = queue.enqueue('test.job', { data: 'test' }, ['req:1'], 'dedupe-key', 100);

      const status = queue.getJobStatus(jobId!);
      expect(status?.job).toBeDefined();
      expect(status?.job?.type).toBe('test.job');
      expect(status?.job?.payload).toEqual({ data: 'test' });
      expect(status?.job?.requirements).toEqual(['req:1']);
      expect(status?.job?.dedupeKey).toBe('dedupe-key');
      expect(status?.job?.delay).toBe(100);
    });
  });

  describe('subscribeToJobStatus', () => {
    it('should notify subscribers when job status changes', async () => {
      const queue = new JobQueue();
      const statusUpdates: Array<{ jobId: string; status: JobStatus }> = [];

      const unsubscribe = queue.subscribeToJobStatus((jobId, statusInfo) => {
        statusUpdates.push({ jobId, status: statusInfo.status });
      });

      const processor: Processor = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      };

      queue.setProcessor(processor);
      const jobId = queue.enqueue('test.job', {});

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Should have received updates: pending -> processing -> completed
      expect(statusUpdates.length).toBeGreaterThanOrEqual(2);
      expect(statusUpdates.some((u) => u.status === 'pending')).toBe(true);
      expect(statusUpdates.some((u) => u.status === 'processing')).toBe(true);
      expect(statusUpdates.some((u) => u.status === 'completed')).toBe(true);

      unsubscribe();
    });

    it('should immediately notify about existing job statuses', () => {
      const queue = new JobQueue();
      const statusUpdates: Array<{ jobId: string; status: JobStatus }> = [];

      queue.enqueue('test.job', {});

      queue.subscribeToJobStatus((jobId, statusInfo) => {
        statusUpdates.push({ jobId, status: statusInfo.status });
      });

      // Should have received initial status
      expect(statusUpdates.length).toBeGreaterThanOrEqual(1);
      expect(statusUpdates[0]?.status).toBe('pending');
    });

    it('should stop notifying after unsubscribe', async () => {
      const queue = new JobQueue();
      const statusUpdates: Array<{ jobId: string; status: JobStatus }> = [];

      const unsubscribe = queue.subscribeToJobStatus((jobId, statusInfo) => {
        statusUpdates.push({ jobId, status: statusInfo.status });
      });

      const processor: Processor = async () => {};

      queue.setProcessor(processor);
      const jobId1 = queue.enqueue('test.job', {});

      await new Promise((resolve) => setTimeout(resolve, 50));

      const initialCount = statusUpdates.length;
      unsubscribe();

      // Enqueue another job - should not notify
      const jobId2 = queue.enqueue('test.job2', {});
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Should not have received updates for second job
      const updatesForJob2 = statusUpdates.filter((u) => u.jobId === jobId2);
      expect(updatesForJob2.length).toBe(0);
    });

    it('should handle multiple subscribers', async () => {
      const queue = new JobQueue();
      const updates1: Array<JobStatus> = [];
      const updates2: Array<JobStatus> = [];

      queue.subscribeToJobStatus((jobId, statusInfo) => {
        updates1.push(statusInfo.status);
      });

      queue.subscribeToJobStatus((jobId, statusInfo) => {
        updates2.push(statusInfo.status);
      });

      const processor: Processor = async () => {};

      queue.setProcessor(processor);
      queue.enqueue('test.job', {});

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(updates1.length).toBeGreaterThan(0);
      expect(updates2.length).toBeGreaterThan(0);
      expect(updates1).toEqual(updates2);
    });

    it('should handle subscriber errors gracefully', async () => {
      const queue = new JobQueue();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      queue.subscribeToJobStatus(() => {
        throw new Error('Subscriber error');
      });

      const processor: Processor = async () => {};

      queue.setProcessor(processor);
      queue.enqueue('test.job', {});

      await new Promise((resolve) => setTimeout(resolve, 50));

      // Should not crash, error should be logged
      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });
  });

  describe('Status Lifecycle', () => {
    it('should transition through all status states correctly', async () => {
      const queue = new JobQueue();
      const statuses: JobStatus[] = [];

      queue.subscribeToJobStatus((jobId, statusInfo) => {
        statuses.push(statusInfo.status);
      });

      const processor: Processor = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'result';
      };

      queue.setProcessor(processor);
      const jobId = queue.enqueue('test.job', {});

      await new Promise((resolve) => setTimeout(resolve, 50));

      const status = queue.getJobStatus(jobId!);
      expect(status?.status).toBe('completed');
      expect(status?.result).toBe('result');

      // Should have gone through: pending -> processing -> completed
      expect(statuses).toContain('pending');
      expect(statuses).toContain('processing');
      expect(statuses).toContain('completed');
    });

    it('should handle status for jobs with delay', async () => {
      vi.useFakeTimers();
      const queue = new JobQueue();
      const statuses: JobStatus[] = [];

      queue.subscribeToJobStatus((jobId, statusInfo) => {
        statuses.push(statusInfo.status);
      });

      const processor: Processor = async () => {};

      queue.setProcessor(processor);
      const jobId = queue.enqueue('test.job', {}, [], undefined, 100);

      // Initially should be pending
      expect(queue.getJobStatus(jobId!)?.status).toBe('pending');

      vi.advanceTimersByTime(50);
      await Promise.resolve();
      // Still pending (delay not elapsed) - need to check before processing completes
      const statusAfter50ms = queue.getJobStatus(jobId!);
      // Status might be pending or processing, but not completed yet
      expect(['pending', 'processing']).toContain(statusAfter50ms?.status);

      vi.advanceTimersByTime(50);
      await vi.runAllTimersAsync();
      // Should be completed now
      expect(queue.getJobStatus(jobId!)?.status).toBe('completed');
    });

    it('should handle status for jobs with requirements', async () => {
      const queue = new JobQueue();
      const { setRequirement } = await import('../src/requirements');
      const statuses: JobStatus[] = [];

      queue.subscribeToJobStatus((jobId, statusInfo) => {
        statuses.push(statusInfo.status);
      });

      const processor: Processor = async () => {};

      queue.setProcessor(processor);
      const jobId = queue.enqueue('test.job', {}, ['test:req']);

      // Should be pending (requirement not met)
      expect(queue.getJobStatus(jobId!)?.status).toBe('pending');

      // Set requirement - this triggers process() asynchronously
      setRequirement('test:req', true);
      
      // Give process() time to run - it's async and runs in the background
      // Wait for the job status to change from pending to completed
      await waitFor(
        () => {
          const status = queue.getJobStatus(jobId!);
          expect(status).not.toBeNull();
          expect(status?.status).toBe('completed');
        },
        { timeout: 1000, interval: 50 },
      );

      const finalStatus = queue.getJobStatus(jobId!);
      expect(finalStatus?.status).toBe('completed');
    });
  });
});

describe('useJobStatus Hook', () => {
  beforeEach(() => {
    // Clear any event buffer and callbacks between tests
    clearProcessEventCallback();
    clearEventBuffer();
    
    // Clean up any existing providers from DOM
    if (typeof document !== 'undefined') {
      const providers = document.querySelectorAll('[data-nextmq-provider]');
      providers.forEach((p) => p.remove());
    }
  });

  it('should return null status when jobId is null', () => {
    const processor: Processor = async () => {};

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextMQClientProvider processor={processor}>
        {children}
      </NextMQClientProvider>
    );

    const { result } = renderHook(() => useJobStatus(null), { wrapper });

    // Should return null status immediately
    expect(result.current).toBeDefined();
    expect(result.current.status).toBeNull();
    expect(result.current.result).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('should track job status from pending to completed', async () => {
    const processor: Processor = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return 'success';
    };

    let jobId: string | null = null;
    
    // Component that enqueues a job
    const EnqueueJob = () => {
      const queue = useNextmq();
      React.useEffect(() => {
        jobId = queue.enqueue('test.job', {});
      }, [queue]);
      return null;
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextMQClientProvider processor={processor}>
        <EnqueueJob />
        {children}
      </NextMQClientProvider>
    );

    // Render hook with a state that will be updated when jobId is available
    const { result, rerender } = renderHook(
      ({ id }: { id: string | null }) => useJobStatus(id),
      {
        wrapper,
        initialProps: { id: null },
      },
    );

    // Wait for jobId to be set
    await waitFor(
      () => {
        expect(jobId).not.toBeNull();
      },
      { timeout: 500, interval: 10 },
    );

    // Update hook with jobId
    rerender({ id: jobId });

    // Wait for job to complete - the hook should track status changes
    await waitFor(
      () => {
        expect(result.current.status).toBe('completed');
        expect(result.current.result).toBe('success');
      },
      { timeout: 500, interval: 10 },
    );
  });

  it('should track job status from pending to failed', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const processor: Processor = async () => {
      throw new Error('Test error');
    };

    let jobId: string | null = null;
    
    // Component that enqueues a job
    const EnqueueJob = () => {
      const queue = useNextmq();
      React.useEffect(() => {
        jobId = queue.enqueue('error.job', {});
      }, [queue]);
      return null;
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextMQClientProvider processor={processor}>
        <EnqueueJob />
        {children}
      </NextMQClientProvider>
    );

    // Render hook with a state that will be updated when jobId is available
    const { result, rerender } = renderHook(
      ({ id }: { id: string | null }) => useJobStatus(id),
      {
        wrapper,
        initialProps: { id: null },
      },
    );

    // Wait for jobId to be set
    await waitFor(
      () => {
        expect(jobId).not.toBeNull();
      },
      { timeout: 500, interval: 10 },
    );

    // Update hook with jobId
    rerender({ id: jobId });

    // Wait for job to fail - the hook should track status changes
    await waitFor(
      () => {
        expect(result.current.status).toBe('failed');
        expect(result.current.error).toBeDefined();
      },
      { timeout: 500, interval: 10 },
    );
    
    errorSpy.mockRestore();
  });

  it('should handle jobId that does not exist yet', () => {
    const processor: Processor = async () => {};

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextMQClientProvider processor={processor}>
        {children}
      </NextMQClientProvider>
    );

    const { result } = renderHook(() => useJobStatus('non-existent-id'), { wrapper });

    // Should return pending for non-existent job (hook sets pending if job not found)
    expect(result.current).toBeDefined();
    expect(result.current.status).toBe('pending');
    expect(result.current.result).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('should get initial status if job already exists', async () => {
    const processor: Processor = async () => {};

    let jobId: string | null = null;
    let queueInstance: JobQueue | null = null;
    
    // Component that enqueues a job and exposes the queue
    const EnqueueJob = () => {
      const queue = useNextmq();
      queueInstance = queue;
      React.useEffect(() => {
        jobId = queue.enqueue('test.job', {});
      }, [queue]);
      return null;
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextMQClientProvider processor={processor}>
        <EnqueueJob />
        {children}
      </NextMQClientProvider>
    );

    // Render the wrapper to trigger job enqueue
    renderHook(() => null, { wrapper });

    // Wait for jobId to be set and job to complete
    await waitFor(
      () => {
        expect(jobId).not.toBeNull();
        expect(queueInstance).not.toBeNull();
        const status = queueInstance!.getJobStatus(jobId!);
        return status?.status === 'completed';
      },
      { timeout: 500, interval: 10 },
    );

    // Now render the hook with the jobId - should get initial status immediately
    const { result } = renderHook(() => useJobStatus(jobId!), { wrapper });

    // Hook should get initial status immediately (job is completed)
    // The hook's useState initializer should get the status from the queue
    expect(result.current).toBeDefined();
    expect(result.current.status).toBe('completed');
  });
});

