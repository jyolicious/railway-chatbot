/**
 * serializeCascadeForPrompt.js
 * 
 * Converts live cascade state to a concise string for injection into Claude's system prompt.
 * Keeps the prompt under 500 tokens to maintain fast response times.
 */

export function serializeCascadeForPrompt(cascadeState) {
  /**
   * Takes a cascadeState object and returns a formatted string
   * suitable for embedding in Claude's system prompt.
   * 
   * Returns a string that Claude can parse and reference.
   */

  if (!cascadeState || !cascadeState.activeCascade) {
    return `
NETWORK STATUS: All systems nominal. No active cascades.
`;
  }

  const {
    trigger_station = "UNKNOWN",
    delay_minutes = 0,
    affected_stations = [],
    disrupted_trains = [],
    passengers = 0,
    affectedStations = [],
    disrupted_trains: allTrains = [],
    passengerCount = 0
  } = cascadeState;

  // Use the more recent values if both exist
  const stations = affectedStations.length > 0 ? affectedStations : affected_stations;
  const trains = allTrains.length > 0 ? allTrains : disrupted_trains;
  const passengerImpact = passengerCount > 0 ? passengerCount : passengers;

  return `
LIVE NETWORK CASCADE
-------------------
Trigger: ${trigger_station}
Delay: ${delay_minutes} minutes
Affected Stations: ${stations.length} total
  ${stations.map(s => `• ${s}`).join("\n  ")}
Disrupted Coaches/Trains: ${trains.length}
  ${trains.slice(0, 5).map(t => `• ${t}`).join("\n  ")}${trains.length > 5 ? `\n  ... and ${trains.length - 5} more` : ""}
Passengers at Risk: ${passengerImpact.toLocaleString()}
Cascade Status: ACTIVE
${stations.length > 1 ? `Propagation: ${stations.length - 1} spread steps active` : "Initial stage"}
`;
}

export function createCascadeContextString(cascadeState, mode = "operator") {
  /**
   * Creates a mode-specific context string for Claude.
   * 
   * "operator": Focus on scheduling recommendations, network recovery
   * "passenger": Focus on booking decisions, alternative options
   */

  const serialized = serializeCascadeForPrompt(cascadeState);

  if (mode === "passenger") {
    return `${serialized}

PASSENGER PERSPECTIVE:
- Your waitlist position, booking class, and travel date are relative to this cascade.
- Provide practical passenger advice (cancel, wait, book alternative).
`;
  } else {
    // operator mode
    return `${serialized}

OPERATOR PERSPECTIVE:
- Focus on network recovery and cascade containment.
- Provide scheduling recommendations and priority actions.
`;
  }
}
