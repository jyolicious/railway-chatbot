export function calculateImpact(cascadeState) {

  if (!cascadeState) return null;

  const stations = cascadeState.affectedStations || [];
  const trains = cascadeState.affectedTrains || [];

  const passengersAffected = cascadeState.passengerCount || 0;

  const trainsDelayed = trains.length;

  const connectionsBroken = Math.max(0, stations.length - 1);

  const delay = cascadeState.delay_minutes || 0;

  const networkHealth =
    Math.max(0, 100 - delay * 0.25 - stations.length * 2);

  return {
    passengersAffected,
    trainsDelayed,
    connectionsBroken,
    networkHealth
  };
}