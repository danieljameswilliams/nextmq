// tests/jobQueue.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobQueue } from '../src/JobQueue';
import { setRequirement } from '../src/requirements';

describe('JobQueue requirements', () => {
  beforeEach(() => {
    // Optional: reset requirements if you add a reset helper
    setRequirement('cookieConsent:marketing', false);
  });

  it('does not process jobs until requirements are met', async () => {
    const queue = new JobQueue();
    const handler = vi.fn(async () => { });

    queue.registerProcessor('track.relewise', handler);

    queue.enqueue(
      'track.relewise',
      { event: 'TestEvent' },
      ['cookieConsent:marketing'],
    );

    // Give queue time to run (it shouldn’t)
    await new Promise((r) => setTimeout(r, 10));
    expect(handler).not.toHaveBeenCalled();

    setRequirement('cookieConsent:marketing', true);

    // Now it should process
    await new Promise((r) => setTimeout(r, 10));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});