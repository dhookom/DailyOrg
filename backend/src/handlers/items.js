import { getItemsByCategory, getItemById, updateItem } from '../db/firestore.js';

export async function getItems(req, res) {
  try {
    const category = req.query.category || '';
    const items = await getItemsByCategory(category || undefined);
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function summarizeItem(req, res) {
  try {
    const { id } = req.params;
    const item = await getItemById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const textToSummarize = item.fullText || item.snippet || item.title;
    if (!textToSummarize) {
      return res.status(400).json({ error: 'No text to summarize' });
    }

    // Phase 1: simple extractive summary (first ~300 chars of body or snippet)
    // Replace with LLM call (Gemini/Vertex) when configured
    let summary;
    if (item.summary) {
      summary = item.summary;
    } else {
      const maxLen = 400;
      summary =
        textToSummarize.length <= maxLen
          ? textToSummarize
          : textToSummarize.substring(0, maxLen).trim() + '…';
      await updateItem(id, { summary });
    }

    res.json({ id, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
