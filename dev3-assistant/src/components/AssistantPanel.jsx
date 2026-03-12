import { useState } from "react";
import { fetchClaude } from "../logic/claudeClient";

export default function AssistantPanel() {

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const mockCascadeState = {
    trigger_station: "NGP",
    delay_minutes: 120,
    affected_stations: ["BPL", "JHS", "NDLS"],
    disrupted_trains: ["12952 Rajdhani", "12269 Duronto"],
    passengers: 14200
  };

  async function handleSend() {

    if (!message) return;

    setLoading(true);

    try {
      const result = await fetchClaude(message, mockCascadeState);
      setResponse(result);
    } catch (err) {
      console.error(err);
      setResponse("Error contacting assistant");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>RailSentinel Assistant</h2>

      <textarea
        placeholder="Ask about railway delays..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          height: 80,
          marginBottom: 10
        }}
      />

      <button onClick={handleSend}>
        Ask Assistant
      </button>

      {loading && <p>Thinking...</p>}

      {response && (
        <div style={{ marginTop: 20 }}>
          <h4>Assistant Response</h4>
          <p>{response}</p>
        </div>
      )}

    </div>
  );
}