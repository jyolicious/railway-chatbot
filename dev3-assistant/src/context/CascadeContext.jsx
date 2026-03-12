import { createContext, useContext, useState, useEffect } from "react";
import { calculateImpact } from "../logic/impactCalculator";

const CascadeContext = createContext();

export function CascadeProvider({ children }) {

  const [cascadeState, setCascadeState] = useState({
    activeCascade: false,
    affectedStations: [],
    affectedTrains: [],
    passengerCount: 0,
    waitlistUpdates: {},
    cascadeTree: {},
    lastUpdate: null,
    trigger_station: null,
    delay_minutes: 0,
    disrupted_trains: []
  });

  const [impactMetrics, setImpactMetrics] = useState(null);

  // Update impact metrics whenever cascade state changes
  useEffect(() => {
    const impact = calculateImpact(cascadeState);
    setImpactMetrics(impact);
  }, [cascadeState]);

  function updateCascadeState(updates) {
    setCascadeState(prev => ({
      ...prev,
      ...updates,
      lastUpdate: Date.now()
    }));
  }

  function triggerCascade(scenario) {
    /**
     * Trigger a new cascade with the given scenario data.
     * This is called by scenarioLoader when a cascade starts.
     */
    setCascadeState({
      activeCascade: true,
      affectedStations: [scenario.trigger_station],
      affectedTrains: scenario.disrupted_trains || [],
      passengerCount: scenario.passengers || 0,
      trigger_station: scenario.trigger_station,
      delay_minutes: scenario.delay_minutes,
      disrupted_trains: scenario.disrupted_trains || [],
      waitlistUpdates: {},
      cascadeTree: scenario,
      lastUpdate: Date.now()
    });
  }

  function clearCascade() {
    /**
     * Reset cascade state to idle.
     */
    setCascadeState({
      activeCascade: false,
      affectedStations: [],
      affectedTrains: [],
      passengerCount: 0,
      waitlistUpdates: {},
      cascadeTree: {},
      lastUpdate: null,
      trigger_station: null,
      delay_minutes: 0,
      disrupted_trains: []
    });
  }

  return (
    <CascadeContext.Provider
      value={{
        cascadeState,
        impactMetrics,
        setCascadeState,
        updateCascadeState,
        triggerCascade,
        clearCascade
      }}
    >
      {children}
    </CascadeContext.Provider>
  );

}

export function useCascade() {
  return useContext(CascadeContext);
}