// src/requirements.ts
/**
 * Requirements System - Gate jobs until requirements are met
 * 
 * Use this to delay job processing until conditions are met
 * (e.g., user consent, authentication, feature flags).
 * 
 * Jobs with requirements will wait in the queue until all specified
 * requirements are set to `true`.
 * 
 * @example
 * ```ts
 * import { setRequirement } from 'nextmq';
 * 
 * // Enable a requirement
 * setRequirement('necessaryConsent', true);
 * 
 * // Jobs with requirements: ['necessaryConsent'] will now process
 * ```
 */

/** Requirement key identifier (e.g., 'necessaryConsent', 'userAuthenticated') */
export type RequirementKey = string;

/** Internal requirement state storage */
type RequirementState = Record<RequirementKey, boolean>;

let state: RequirementState = {};

/** Listener callback type for requirement changes */
type Listener = () => void;

/** Set of listeners notified when requirements change */
const listeners = new Set<Listener>();

/**
 * Get the current state of a requirement.
 * 
 * @param key - Requirement key identifier
 * @returns `true` if requirement is met, `false` otherwise
 */
export function getRequirement(key: RequirementKey): boolean {
  return !!state[key];
}

/**
 * Set a requirement state.
 * Jobs waiting for this requirement will process when it becomes `true`.
 * 
 * @param key - Requirement key identifier
 * @param value - Whether the requirement is met
 */
export function setRequirement(key: RequirementKey, value: boolean): void {
  if (state[key] === value) return;
  state = { ...state, [key]: value };
  listeners.forEach((cb) => cb());
}

/**
 * Subscribe to requirement changes.
 * Notifies listeners when any requirement state changes.
 * 
 * @param cb - Callback function to invoke on requirement changes
 * @returns Unsubscribe function
 * @internal Used by JobQueue
 */
export function onRequirementsChange(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}