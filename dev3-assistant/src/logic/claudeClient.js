import { createSystemPrompt } from "./systemPromptTemplate";

export async function fetchClaude(userMessage, cascadeState) {

  const systemPrompt = createSystemPrompt(cascadeState);

  const response = await fetch("http://localhost:3000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: userMessage,
      systemPrompt
    })
  });

  const data = await response.json();

  console.log("Claude response:", data);

  // handle proxy errors forwarded from server
  if (data.error || data.type === "error") {
    const msg = data.error?.message || data.message || JSON.stringify(data);
    throw new Error(msg);
  }

  // new chat endpoint returns its text either in `completion` or in
  // a nested `output`/`content` array; be permissive here so that the
  // app doesn't break if the shape drifts slightly.
  let text = null;

  if (typeof data.completion === "string") {
    text = data.completion;
  } else if (data.output && Array.isArray(data.output)) {
    // output may look like [{type:"output_text", text:"..."}]
    const piece = data.output[0] || {};
    text = piece.text || piece.content?.[0]?.text;
  } else if (data.content && data.content[0]) {
    text = data.content[0].text;
  }

  if (!text) {
    throw new Error("Invalid response from Claude API");
  }

  return text;
}