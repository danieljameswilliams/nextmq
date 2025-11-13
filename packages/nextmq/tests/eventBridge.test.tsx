// tests/eventBridge.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { NextMQRootClientContextProvider } from '../src/NextMQRootClientContextProvider';
import { NextMQRootClientEventBridge } from '../src/NextMQRootClientEventBridge';
import { NEXTMQ_EVENT_NAME } from '../src/events';
import type { Job } from '../src/JobQueue';

describe('NextMQRootClientEventBridge', () => {
  it('enqueues jobs triggered via CustomEvent', async () => {
    const spy = vi.fn();

    const processor = async (job: Job) => {
      if (job.type === 'track.relewise') {
        spy(job.payload);
      }
    };

    render(
      <NextMQRootClientContextProvider processor={processor}>
        <NextMQRootClientEventBridge />
      </NextMQRootClientContextProvider>,
    );

    window.dispatchEvent(
      new CustomEvent(NEXTMQ_EVENT_NAME, {
        detail: {
          type: 'track.relewise',
          payload: { event: 'Test' },
        },
      }),
    );

    await new Promise((r) => setTimeout(r, 10));

    expect(spy).toHaveBeenCalledWith({ event: 'Test' });
  });
});