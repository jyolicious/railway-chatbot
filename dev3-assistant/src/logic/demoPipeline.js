/**
 * DEM_MODE.js
 * 
 * Auto-pilot demo mode for RailSentinel.
 * Runs the full 3-minute demo sequence automatically:
 * 1. Trigger scenario
 * 2. Let cascade animate
 * 3. Ask 2 pre-baked queries
 * 4. Display fallback responses
 */

export const demoPipeline = [
  {
    type: "scenario",
    scenarioId: 1,
    duration: 4000, // Let cascade run for 4 seconds
    description: "Trigger Scenario 1: Nagpur Gridlock"
  },
  {
    type: "query",
    query: "What's the cascade risk summary?",
    mode: "operator",
    duration: 2000,
    description: "Operator query: cascade risk"
  },
  {
    type: "query",
    query: "How should I rebook my waitlist booking?",
    mode: "passenger",
    duration: 2000,
    description: "Passenger query: rebooking advice"
  },
  {
    type: "scenario",
    scenarioId: 3,
    duration: 4000,
    description: "Trigger Scenario 3: Mumbai CST Platform Failure"
  },
  {
    type: "query",
    query: "Which scheduling changes reduce this cascade?",
    mode: "operator",
    duration: 2000,
    description: "Operator query: scheduling recommendations"
  }
];

/**
 * Pre-scripted demo queries optimized for demo presentation.
 * These queries have fast, meaningful fallback responses.
 */
export const demoQueries = {
  operator: [
    "What's the cascade risk summary?",
    "How should we contain this cascade?",
    "Which trains are most at risk?",
    "What scheduling changes would help?"
  ],
  passenger: [
    "Should I keep my waitlist booking?",
    "What are my alternative options?",
    "When is the best booking window?",
    "What's my confirmation probability?"
  ]
};

/**
 * Executes the demo pipeline sequentially.
 * Calls callbacks at each step for UI updates.
 */
export async function runDemoPipeline(callbacks = {}) {
  const {
    onScenarioStart = () => {},
    onScenarioEnd = () => {},
    onQueryStart = () => {},
    onQueryEnd = () => {},
    onQueryResponse = () => {},
    onError = () => {},
    onComplete = () => {}
  } = callbacks;

  try {
    for (const step of demoPipeline) {
      if (step.type === "scenario") {
        onScenarioStart(step);
        // Trigger the scenario
        // (This would be called from AssistantPanel's handleTriggerScenario)
        await new Promise(resolve => setTimeout(resolve, step.duration));
        onScenarioEnd(step);
      } else if (step.type === "query") {
        onQueryStart(step);
        // Make the query (with fallback)
        // (This would be called with useFallback: true for deterministic demo)
        await new Promise(resolve => setTimeout(resolve, step.duration));
        onQueryEnd(step);
      }
    }
    onComplete();
  } catch (err) {
    onError(err);
  }
}
