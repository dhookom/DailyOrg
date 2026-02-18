/**
 * Phase 1: simple keyword-based categorization.
 * Replace with LLM (e.g. Gemini) when GEMINI_API_KEY or Vertex is configured.
 *
 * Supports multi-label classification via categorizeMulti().
 */
const CATEGORY_KEYWORDS = {
  AI: ['AI', 'artificial intelligence', 'machine learning', 'LLM', 'GPT', 'neural'],
  'AI and infrastructure': ['AI', 'infrastructure', 'GPU', 'data center', 'cloud AI', 'MLOps'],
  'Political and economic system': [
    'economy',
    'political',
    'policy',
    'government',
    'election',
    'democracy',
    'capitalism',
  ],
  'Liverpool FC': ['Liverpool', 'LFC', 'Klopp', 'Premier League', 'Anfield'],
  Psychoanalysis: ['psychoanalysis', 'Freud', 'unconscious', 'psychology', 'therapy'],
};

export function categorize(title, snippet = '') {
  const { category } = categorizeMulti(title, snippet);
  return category;
}

/**
 * Multi-label keyword-based categorization.
 * Returns both the \"primary\" category and all matched categories.
 */
export function categorizeMulti(title, snippet = '') {
  const text = `${title} ${snippet}`.toLowerCase();
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((kw) => text.includes(kw.toLowerCase())).length;
    if (score > 0) {
      scores[category] = score;
    }
  }

  const categories = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const primary = categories[0] || 'General';

  return {
    category: primary,
    categories: categories.length ? categories : [primary],
  };
}

