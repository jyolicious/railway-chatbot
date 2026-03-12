import { useState } from "react";
import { fetchClaude, clearResponseCache } from "../logic/claudeClient";
import { useCascade } from "../context/CascadeContext";
import { triggerScenario, getScenarios } from "../logic/scenarioLoader";

export default function AssistantPanel() {

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("operator"); // "operator" or "passenger"
  const [demoMode, setDemoMode] = useState(false);
  const [cascading, setCascading] = useState(false);

  const { cascadeState, updateCascadeState, clearCascade } = useCascade();

  const scenarios = getScenarios();

  async function handleSend() {
    if (!message) return;

    setLoading(true);
    try {
      const result = await fetchClaude(message, cascadeState, {
        mode,
        useFallback: demoMode
      });
      setResponse(result);
    } catch (err) {
      console.error(err);
      setResponse(`Error: ${err.message}`);
    }
    setLoading(false);
  }

  function handleTriggerScenario(scenarioId) {
    setCascading(true);
    clearCascade();

    triggerScenario(scenarioId, {
      onStep: (event) => {
        // Update cascade state in context with each propagation step
        updateCascadeState({
          activeCascade: !event.completed,
          affectedStations: event.affectedStations,
          disrupted_trains: event.disrupted_trains,
          passengerCount: event.passengers,
          delay_minutes: event.delay_minutes
        });
      },
      onComplete: (event) => {
        setCascading(false);
        console.log("Cascade complete:", event);
      },
      onError: (err) => {
        console.error("Scenario error:", err);
        setCascading(false);
      }
    });
  }

  function handleDemoQuery(query) {
    setMessage(query);
    setTimeout(() => {
      handleSend();
    }, 100);
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>

      <div style={{ marginBottom: 16 }}>
        <h2>RailSentinel Assistant</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12 }}>
          <label>
            <input
              type="radio"
              value="operator"
              checked={mode === "operator"}
              onChange={(e) => setMode(e.target.value)}
            />
            {" "}Operator Mode
          </label>
          <label>
            <input
              type="radio"
              value="passenger"
              checked={mode === "passenger"}
              onChange={(e) => setMode(e.target.value)}
            />
            {" "}Passenger Mode
          </label>
          <label style={{ marginLeft: "auto" }}>
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
            />
            {" "}Demo Mode (fallback)
          </label>
        </div>
      </div>

      {/* Quick scenario trigger */}
      {scenarios.length > 0 && (
        <div style={{ marginBottom: 16, padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
          <div style={{ fontSize: 10, color: "#666", marginBottom: 8, letterSpacing: 1 }}>
            QUICK DEMO SCENARIOS
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {scenarios.slice(0, 3).map(s => (
              <button
                key={s.id}
                onClick={() => handleTriggerScenario(s.id)}
                disabled={cascading}
                style={{
                  padding: "6px 12px",
                  fontSize: 11,
                  background: cascading ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 3,
                  cursor: cascading ? "default" : "pointer"
                }}
              >
                Scenario {s.id}
              </button>
            ))}
          </div>
          {cascading && <div style={{ fontSize: 11, color: "#FF9800", marginTop: 8 }}>⚡ Cascade in progress...</div>}
        </div>
      )}

      {/* Cascade status */}
      {cascadeState.activeCascade && (
        <div style={{ marginBottom: 16, padding: 12, background: "#ffebee", borderRadius: 4, borderLeft: "3px solid #f44336" }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#c62828" }}>
            🚨 LIVE CASCADE
          </div>
          <div style={{ fontSize: 10, marginTop: 6, color: "#666" }}>
            {cascadeState.trigger_station} → {cascadeState.affectedStations.length} stations affected
            {" "} ({cascadeState.passengerCount.toLocaleString()} passengers)
          </div>
        </div>
      )}

      <textarea
        placeholder="Ask about railway delays..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          height: 80,
          marginBottom: 10,
          padding: 10,
          fontFamily: "monospace",
          fontSize: 12,
          borderRadius: 4,
          border: "1px solid #ddd"
        }}
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            flex: 1,
            padding: 10,
            background: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "default" : "pointer",
            fontWeight: "bold"
          }}
        >
          {loading ? "Thinking..." : "Ask Assistant"}
        </button>
        <button
          onClick={() => {
            clearCascade();
            setMessage("");
            setResponse("");
            clearResponseCache();
          }}
          style={{
            padding: 10,
            background: "#666",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Reset
        </button>
      </div>

      {/* Demo query shortcuts */}
      {demoMode && (
        <div style={{ marginBottom: 16, padding: 12, background: "#e8f5e9", borderRadius: 4 }}>
          <div style={{ fontSize: 10, color: "#2e7d32", marginBottom: 8, letterSpacing: 1 }}>
            DEMO QUERIES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              "What's the cascade risk summary?",
              "Which scheduling changes reduce this cascade?",
              "What are the priority trains?"
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => handleDemoQuery(q)}
                disabled={loading}
                style={{
                  textAlign: "left",
                  padding: 8,
                  fontSize: 11,
                  background: "#fff",
                  border: "1px solid #4CAF50",
                  color: "#2e7d32",
                  borderRadius: 3,
                  cursor: loading ? "default" : "pointer"
                }}
              >
                → {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {response && (
        <div style={{ marginTop: 20, padding: 14, background: "#f9f9f9", borderRadius: 4, borderLeft: "3px solid #2196F3" }}>
          <h4 style={{ margin: "0 0 10px", fontSize: 12, color: "#1976D2" }}>Assistant Response</h4>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#333" }}>
            {response}
          </p>
        </div>
      )}

    </div>
  );
}