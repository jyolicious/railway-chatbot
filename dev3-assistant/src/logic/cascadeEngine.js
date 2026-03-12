/**
 * cascadeEngine.js
 * 
 * Pure JavaScript cascade simulation engine.
 * Takes a scenario and emits events as the cascade propagates through the network.
 * No React dependency — can test and use independently.
 */

export function createCascadeEngine(scenario) {
  
  const cascade = {
    id: scenario.id,
    trigger_station: scenario.trigger_station,
    delay_minutes: scenario.delay_minutes,
    affected_stations: [scenario.trigger_station],
    disrupted_trains: scenario.disrupted_trains || [],
    passengers: scenario.passengers || 0,
    propagation_steps: scenario.propagation || [],
    currentStep: 0,
    state: "idle" // idle | running | complete
  };

  function emitEvent(callback) {
    if (cascade.currentStep < cascade.propagation_steps.length) {
      const step = cascade.propagation_steps[cascade.currentStep];
      
      cascade.affected_stations.push(step.station_code);
      if (step.affected_trains) {
        cascade.disrupted_trains.push(...step.affected_trains);
      }
      cascade.passengers += step.passengers_added || 0;
      cascade.delay_minutes += step.delay_added || 0;

      callback({
        step: cascade.currentStep,
        totalSteps: cascade.propagation_steps.length,
        affectedStations: [...cascade.affected_stations],
        disrupted_trains: [...new Set(cascade.disrupted_trains)],
        passengers: cascade.passengers,
        delay_minutes: cascade.delay_minutes,
        lastStation: step.station_code,
        completed: false
      });

      cascade.currentStep++;
    } else {
      callback({
        step: cascade.currentStep,
        totalSteps: cascade.propagation_steps.length,
        affectedStations: [...cascade.affected_stations],
        disrupted_trains: [...new Set(cascade.disrupted_trains)],
        passengers: cascade.passengers,
        delay_minutes: cascade.delay_minutes,
        completed: true
      });
      cascade.state = "complete";
    }
  }

  return {
    getCascade: () => ({ ...cascade }),
    emitEvent,
    reset: () => {
      cascade.currentStep = 0;
      cascade.state = "idle";
      cascade.affected_stations = [scenario.trigger_station];
      cascade.disrupted_trains = scenario.disrupted_trains || [];
      cascade.passengers = scenario.passengers || 0;
      cascade.delay_minutes = scenario.delay_minutes;
    }
  };
}

export function simulateCascadeSequence(scenario, intervalMs = 300) {
  /**
   * Simulates a full cascade sequence with timed events.
   * Returns a Promise that resolves when cascade is complete.
   */
  return new Promise((resolve) => {
    const engine = createCascadeEngine(scenario);
    const events = [];

    const interval = setInterval(() => {
      engine.emitEvent((event) => {
        events.push(event);
        if (event.completed) {
          clearInterval(interval);
          resolve(events);
        }
      });
    }, intervalMs);
  });
}
