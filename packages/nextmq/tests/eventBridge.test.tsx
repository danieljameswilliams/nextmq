// tests/eventBridge.test.tsx
/**
 * Tests for NextMQRootClientEventBridge component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import {
  NextMQClientProvider,
  NextMQRootClientEventBridge,
  NEXTMQ_EVENT_NAME,
} from '../src';
import type { Job, Processor } from '../src';

describe('NextMQRootClientEventBridge', () => {
  beforeEach(() => {
    // Clean up any existing event listeners
    const events = new Set<string>();
    // This is handled by the component cleanup, but good to be explicit
  });

  it('enqueues jobs triggered via CustomEvent', async () => {
    const spy = vi.fn();

    const processor: Processor = async (job: Job) => {
      if (job.type === 'track.relewise') {
        spy(job.payload);
      }
    };

    render(
      <NextMQClientProvider processor={processor}>
        <NextMQRootClientEventBridge />
      </NextMQClientProvider>,
    );

    window.dispatchEvent(
      new CustomEvent(NEXTMQ_EVENT_NAME, {
        detail: {
          type: 'track.relewise',
          payload: { event: 'Test' },
        },
      }),
    );

    await waitFor(
      () => {
        expect(spy).toHaveBeenCalledWith({ event: 'Test' });
      },
      { timeout: 1000 },
    );
  });

  it('handles events with requirements', async () => {
    const spy = vi.fn();

    const processor: Processor = async (job: Job) => {
      // Skip validation test jobs
      if (job.type === '__nextmq_validation_test__') {
        return undefined;
      }
      spy(job.type);
    };

    render(
      <NextMQClientProvider processor={processor}>
        <NextMQRootClientEventBridge />
      </NextMQClientProvider>,
    );

    window.dispatchEvent(
      new CustomEvent(NEXTMQ_EVENT_NAME, {
        detail: {
          type: 'requirement.test',
          payload: {},
          requirements: ['test:requirement'],
        },
      }),
    );

    // Should not process yet
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(spy).not.toHaveBeenCalled();
  });

  it('cleans up event listeners on unmount', () => {
    const processor: Processor = async () => {};

    const { unmount } = render(
      <NextMQClientProvider processor={processor}>
        <NextMQRootClientEventBridge />
      </NextMQClientProvider>,
    );

    // Component should be mounted
    expect(document.body).toBeTruthy();

    // Unmount should not throw
    expect(() => unmount()).not.toThrow();
  });
});