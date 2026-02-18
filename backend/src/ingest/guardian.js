import { findItemByUrl, createItem } from '../db/firestore.js';
import { categorizeMulti } from '../categorize.js';

const GUARDIAN_BASE = 'https://content.guardianapis.com';

export async function fetchGuardianSection(apiKey, section = 'technology') {
  const url = new URL('/search', GUARDIAN_BASE);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('section', section);
  url.searchParams.set('page-size', '20');
  url.searchParams.set('show-fields', 'body,trailText,byline');
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Guardian API: ${res.status}`);
  const data = await res.json();
  if (data.response?.status !== 'ok') throw new Error(data.response?.message || 'Guardian API error');
  return data.response.results || [];
}

export async function ingestGuardian() {
  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) throw new Error('GUARDIAN_API_KEY is required');

  const sections = ['technology', 'world', 'sport', 'business'];
  let added = 0;
  let skipped = 0;

  for (const section of sections) {
    const results = await fetchGuardianSection(apiKey, section);
    for (const article of results) {
      const url = article.webUrl;
      const existing = await findItemByUrl(url);
      if (existing) {
        skipped++;
        continue;
      }

      const body = article.fields?.body?.replace(/<[^>]+>/g, ' ').trim() || '';
      const snippet = article.fields?.trailText || article.webTitle;
      const { category, categories } = categorizeMulti(article.webTitle, snippet);

      await createItem({
        source: 'guardian',
        url,
        title: article.webTitle,
        snippet: snippet.substring(0, 500),
        fullText: body ? body.substring(0, 100000) : null,
        category,
        categories,
        section,
      });
      added++;
    }
  }

  return { added, skipped };
}
