// in src/requirements.ts
export type RequirementKey = string;

type RequirementState = Record<RequirementKey, boolean>;

let state: RequirementState = {};

type Listener = () => void;
const listeners = new Set<Listener>();

export function getRequirement(key: RequirementKey): boolean {
  return !!state[key];
}

export function setRequirement(key: RequirementKey, value: boolean) {
  if (state[key] === value) return;
  state = { ...state, [key]: value };
  listeners.forEach((cb) => cb());
}

export function onRequirementsChange(cb: Listener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}