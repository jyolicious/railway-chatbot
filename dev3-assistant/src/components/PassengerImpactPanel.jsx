import { useCascade } from "../context/CascadeContext";
import { useEffect, useState } from "react";

export default function PassengerImpactPanel() {

  const { cascadeState, impactMetrics } = useCascade();

  const [display, setDisplay] = useState({
    passengers: 0,
    trains: 0,
    connections: 0,
    health: 100
  });

  useEffect(() => {

    if (!impactMetrics) return;

    animateValue("passengers", impactMetrics.passengersAffected);
    animateValue("trains", impactMetrics.trainsDelayed);
    animateValue("connections", impactMetrics.connectionsBroken);
    animateValue("health", impactMetrics.networkHealth);

  }, [impactMetrics]);

  function animateValue(key, target) {

    let start = display[key];
    let duration = 600;
    let startTime = performance.now();

    function step(timestamp) {

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(start + (target - start) * progress);

      setDisplay(prev => ({ ...prev, [key]: value }));

      if (progress < 1) requestAnimationFrame(step);

    }

    requestAnimationFrame(step);

  }

  const cascadeActive = cascadeState?.activeCascade;

  return (

    <div style={panelStyle}>

      <div style={headerStyle}>
        Passenger Impact Intelligence
      </div>

      {cascadeActive && (
        <div style={alertStyle}>
          ⚠ Cascade Event Active
        </div>
      )}

      <div style={gridStyle}>

        <Metric
          label="Passengers Affected"
          value={display.passengers}
          color="#00ffa6"
        />

        <Metric
          label="Trains Disrupted"
          value={display.trains}
          color="#ffae00"
        />

        <Metric
          label="Broken Connections"
          value={display.connections}
          color="#ff5c5c"
        />

        <Metric
          label="Network Health"
          value={`${display.health}%`}
          color={display.health > 70 ? "#00ffa6" : "#ff5c5c"}
        />

      </div>

    </div>

  );

}

function Metric({ label, value, color }) {

  return (

    <div style={cardStyle}>

      <div
        style={{
          ...valueStyle,
          color: color
        }}
      >
        {value}
      </div>

      <div style={labelStyle}>
        {label}
      </div>

    </div>

  );

}

const panelStyle = {
  background: "#0b0b15",
  border: "1px solid #202030",
  borderRadius: "10px",
  padding: "20px",
  color: "#eaeaea",
  fontFamily: "monospace",
  width: "100%"
};

const headerStyle = {
  fontSize: "18px",
  marginBottom: "16px",
  letterSpacing: "1px"
};

const alertStyle = {
  background: "#ff5c5c22",
  border: "1px solid #ff5c5c55",
  padding: "8px",
  marginBottom: "16px",
  textAlign: "center",
  color: "#ff5c5c",
  fontSize: "13px",
  animation: "pulse 1.5s infinite"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px"
};

const cardStyle = {
  background: "#151525",
  padding: "18px",
  borderRadius: "8px",
  textAlign: "center",
  border: "1px solid #2a2a40"
};

const valueStyle = {
  fontSize: "28px",
  fontWeight: "bold"
};

const labelStyle = {
  fontSize: "12px",
  marginTop: "6px",
  color: "#888"
};