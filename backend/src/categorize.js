/**
 * Phase 1: simple keyword-based categorization.
 * Replace with LLM (e.g. Gemini) when GEMINI_API_KEY or Vertex is configured.
 */
const CATEGORY_KEYWORDS = {
  'AI': ['AI', 'artificial intelligence', 'machine learning', 'LLM', 'GPT', 'neural'],
  'AI and infrastructure': ['AI', 'infrastructure', 'GPU', 'data center', 'cloud AI', 'MLOps'],
  'Political and economic system': ['economy', 'political', 'policy', 'government', 'election', 'democracy', 'capitalism'],
  'Liverpool FC': ['Liverpool', 'LFC', 'Klopp', 'Premier League', 'Anfield'],
  'Psychoanalysis': ['psychoanalysis', 'Freud', 'unconscious', 'psychology', 'therapy'],
};

export function categorize(title, snippet = '') {
  const text = `${title} ${snippet}`.toLowerCase();
  let bestCategory = 'General';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((kw) => text.includes(kw.toLowerCase())).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}
