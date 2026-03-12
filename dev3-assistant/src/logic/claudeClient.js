import { createSystemPrompt } from "./systemPromptTemplate";
import {
  createCascadeContextString,
  serializeCascadeForPrompt
} from "./serializeCascadeForPrompt";
import { getCachedResponse } from "./fallbackResponses";

// Response cache for fallback during demo
const responseCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchClaude(userMessage, cascadeState, options = {}) {
  /**
   * Fetch Claude response with cascade state injection, error handling, and fallback cache.
   * 
   * options:
   *   - mode: "operator" | "passenger" (defaults to "operator")
   *   - useFallback: force use fallback response (for testing)
   *   - timeout: request timeout in ms (defaults to 10000)
   */

  const { mode = "operator", useFallback = false, timeout = 10000 } = options;

  try {
    // Inject cascade context into system prompt
    const cascadeContext = createCascadeContextString(cascadeState, mode);
    const basePrompt = createSystemPrompt(cascadeState);
    const systemPrompt = `${basePrompt}\n\n${cascadeContext}`;

    // Check cache first
    const cacheKey = `${userMessage}:${mode}:${cascadeState?.trigger_station || "none"}`;
    if (responseCache[cacheKey] && Date.now() - responseCache[cacheKey].time < CACHE_TTL) {
      console.log("Using cached response for query:", userMessage);
      return responseCache[cacheKey].response;
    }

    // If forced fallback, return immediately
    if (useFallback) {
      console.log("Using fallback response (demo mode)");
      return getCachedResponse(userMessage);
    }

    // Attempt Claude API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        systemPrompt
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    console.log("Claude response:", data);
    console.log("Cascade state sent to LLM:", cascadeState);

    // Handle proxy errors forwarded from server
    if (data.error || data.type === "error") {
      const msg = data.error?.message || data.message || JSON.stringify(data);
      console.warn("Claude API error, using fallback:", msg);
      const fallback = getCachedResponse(userMessage);
      responseCache[cacheKey] = { response: fallback, time: Date.now() };
      return fallback;
    }

    // Chat endpoint returns text in completion or content array
    let text = null;

    if (typeof data.completion === "string") {
      text = data.completion;
    } else if (data.output && Array.isArray(data.output)) {
      const piece = data.output[0] || {};
      text = piece.text || piece.content?.[0]?.text;
    } else if (data.content && data.content[0]) {
      text = data.content[0].text;
    }

    if (!text) {
      console.warn("Invalid Claude response shape, using fallback");
      const fallback = getCachedResponse(userMessage);
      responseCache[cacheKey] = { response: fallback, time: Date.now() };
      return fallback;
    }

    // Cache successful response
    responseCache[cacheKey] = { response: text, time: Date.now() };

    return text;
  } catch (err) {
    console.error("Claude fetch error:", err.message);
    console.warn("Falling back to cached response");

    // Return fallback response on any error
    const fallback = getCachedResponse(userMessage);
    return fallback;
  }
}

export function clearResponseCache() {
  Object.keys(responseCache).forEach(key => delete responseCache[key]);
}