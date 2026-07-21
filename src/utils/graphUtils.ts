import type { Script, Step } from '../types/script';

/**
 * Find all step IDs reachable from the start step via BFS.
 */
export function getReachableStepIds(script: Script): Set<string> {
  const visited = new Set<string>();
  const queue: string[] = [script.startStepId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const step = script.steps[current];
    if (!step) continue;

    for (const response of step.responses) {
      if (response.nextStepId && !visited.has(response.nextStepId)) {
        queue.push(response.nextStepId);
      }
    }
  }

  return visited;
}

/**
 * Get orphaned steps — steps that exist but aren't reachable from the start step.
 */
export function getOrphanedSteps(script: Script): Step[] {
  const reachable = getReachableStepIds(script);
  return Object.values(script.steps).filter((step) => !reachable.has(step.id));
}

/**
 * Get dead-end steps — non-outcome steps with zero responses.
 */
export function getDeadEndSteps(script: Script): Step[] {
  return Object.values(script.steps).filter(
    (step) => !step.isOutcome && step.responses.length === 0
  );
}

/**
 * Get all step IDs that reference a given step via their responses.
 */
export function getStepsReferencingStep(
  script: Script,
  targetStepId: string
): { step: Step; responseLabel: string }[] {
  const references: { step: Step; responseLabel: string }[] = [];

  for (const step of Object.values(script.steps)) {
    for (const response of step.responses) {
      if (response.nextStepId === targetStepId) {
        references.push({ step, responseLabel: response.label });
      }
    }
  }

  return references;
}

/**
 * Validate a script for import — checks required fields exist.
 */
export function validateScriptShape(data: unknown): data is Script {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  if (typeof obj.id !== 'string') return false;
  if (typeof obj.name !== 'string') return false;
  if (typeof obj.startStepId !== 'string') return false;
  if (!obj.steps || typeof obj.steps !== 'object') return false;
  if (!obj.callFields || typeof obj.callFields !== 'object') return false;

  const steps = obj.steps as Record<string, unknown>;
  for (const step of Object.values(steps)) {
    if (!step || typeof step !== 'object') return false;
    const s = step as Record<string, unknown>;
    if (typeof s.id !== 'string') return false;
    if (typeof s.label !== 'string') return false;
    if (typeof s.text !== 'string') return false;
    if (!Array.isArray(s.responses)) return false;
  }

  return true;
}
