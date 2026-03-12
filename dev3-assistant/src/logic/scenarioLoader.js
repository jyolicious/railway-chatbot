/**
 * scenarioLoader.js
 * 
 * Loads scenarios and exposes triggerScenario API.
 * Integrates with cascadeEngine.js to simulate real-time cascade propagation.
 * 
 * Usage:
 *   import { triggerScenario } from './scenarioLoader';
 *   triggerScenario(1, {
 *     onStep: (event) => console.log('Cascade step:', event),
 *     onComplete: (event) => console.log('Cascade complete')
 *   });
 */

import scenarios from './scenarios';
import { createCascadeEngine } from './cascadeEngine';

let currentEngine = null;
let currentInterval = null;

export function getScenarios() {
  return scenarios;
}

export function getScenarioById(id) {
  return scenarios.find(s => s.id === id);
}

export function triggerScenario(scenarioId, callbacks = {}) {
  /**
   * Start a cascade simulation for the given scenario.
   * 
   * callbacks:
   *   - onStep(event): called for each propagation step
   *   - onComplete(finalEvent): called when cascade finishes
   *   - onError(err): called if scenario not found
   */

  // Stop any running cascade
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
  }

  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    const err = `Scenario ${scenarioId} not found`;
    console.error(err);
    if (callbacks.onError) callbacks.onError(err);
    return;
  }

  try {
    currentEngine = createCascadeEngine(scenario);

    let stepCount = 0;
    const totalSteps = scenario.propagation.length + 1;

    currentInterval = setInterval(() => {
      currentEngine.emitEvent((event) => {
        if (callbacks.onStep) {
          callbacks.onStep(event);
        }

        if (event.completed) {
          clearInterval(currentInterval);
          currentInterval = null;
          if (callbacks.onComplete) {
            callbacks.onComplete(event);
          }
        }
      });
      stepCount++;
    }, 300); // 300ms between propagation steps

  } catch (err) {
    console.error('Error triggering scenario:', err);
    if (callbacks.onError) callbacks.onError(err);
  }
}

export function stopScenario() {
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
    currentEngine = null;
  }
}

export function getCurrentCascadeState() {
  if (!currentEngine) return null;
  return currentEngine.getCascade();
}

export function resetScenario() {
  if (currentEngine) {
    currentEngine.reset();
  }
}
