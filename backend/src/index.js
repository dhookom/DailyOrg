import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ingestGuardian } from './ingest/guardian.js';
import { getItems, summarizeItem } from './handlers/items.js';

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health for Cloud Run
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'dailyorg-api' });
});

// Ingest: trigger Guardian fetch and categorize
app.post('/api/ingest/guardian', async (req, res) => {
  try {
    const result = await ingestGuardian();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Feed: list items, optional category filter
app.get('/api/items', getItems);

// Summarize: generate and store summary for an item
app.post('/api/items/:id/summarize', summarizeItem);

app.listen(PORT, () => {
  console.log(`DailyOrg API listening on port ${PORT}`);
});
