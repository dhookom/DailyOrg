// Centralized AI helpers (Gemini / Vertex AI, etc.)
// Phase 1: no external calls; placeholder functions.
// Later, wire these up to Vertex AI or Gemini and call from categorization/summarization code.

/**
 * Categorize an item using an LLM.
 * Fallback to provided defaultCategory/categories if no LLM is configured.
 */
export async function categorizeWithLLM({
  title,
  snippet,
  fullText,
  defaultCategory,
  defaultCategories,
}) {
  // TODO: implement Gemini / Vertex AI call when credentials are available.
  return {
    category: defaultCategory ?? 'General',
    categories: defaultCategories ?? (defaultCategory ? [defaultCategory] : ['General']),
    provider: 'fallback',
  };
}

/**
 * Summarize text using an LLM.
 * Fallback to simple truncation if no LLM is configured.
 */
export async function summarizeWithLLM(text, existingSummary) {
  if (existingSummary) {
    return { summary: existingSummary, provider: 'existing' };
  }

  if (!text) {
    return { summary: '', provider: 'fallback' };
  }

  const maxLen = 400;
  const summary =
    text.length <= maxLen ? text : text.substring(0, maxLen).trim() + '…';

  return { summary, provider: 'fallback' };
}

