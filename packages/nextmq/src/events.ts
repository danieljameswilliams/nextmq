// src/events.ts
import type { JobType } from './JobQueue';
import type { RequirementKey } from './requirements';

export const NEXTMQ_EVENT_NAME = 'nextmq:invoke';

export type NextmqEventDetail = {
  type: JobType;
  payload: unknown;
  requirements?: RequirementKey[];
};