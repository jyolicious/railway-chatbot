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
    lastUpdate: null
  });

  const [impactMetrics, setImpactMetrics] = useState(null);

  async function fetchCascadeState() {

    try {

      const res = await fetch("http://localhost:3000/cascade-state");
      const data = await res.json();

      const updatedState = {
        ...data,
        lastUpdate: Date.now()
      };

      setCascadeState(updatedState);

      const impact = calculateImpact(updatedState);

      setImpactMetrics(impact);

    } catch (err) {

      console.error("Cascade fetch failed:", err);

    }

  }

  useEffect(() => {

    fetchCascadeState();

    const interval = setInterval(fetchCascadeState, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <CascadeContext.Provider
      value={{ cascadeState, impactMetrics, setCascadeState }}
    >
      {children}
    </CascadeContext.Provider>
  );

}

export function useCascade() {
  return useContext(CascadeContext);
}