'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const CATEGORIES = [
  'General',
  'AI',
  'AI and infrastructure',
  'Political and economic system',
  'Liverpool FC',
  'Psychoanalysis',
];

export default function Home() {
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(null);

  useEffect(() => {
    if (!API_URL) {
      setLoading(false);
      return;
    }
    const q = category ? `?category=${encodeURIComponent(category)}` : '';
    fetch(`${API_URL}/api/items${q}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category]);

  async function handleSummarize(id) {
    if (!API_URL) return;
    setSummarizing(id);
    try {
      const res = await fetch(`${API_URL}/api/items/${id}/summarize`, { method: 'POST' });
      const data = await res.json();
      if (data.summary) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, summary: data.summary } : i))
        );
      }
    } finally {
      setSummarizing(null);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 8 }}>DailyOrg</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>Feed by category · Click Summarize for a short summary</p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ marginRight: 8 }}>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '6px 12px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 6,
            color: '#e0e0e0',
          }}
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {!API_URL && (
        <p style={{ color: '#c88' }}>Set NEXT_PUBLIC_API_URL in .env.local to load the feed.</p>
      )}

      {loading && <p>Loading…</p>}
      {!loading && items.length === 0 && <p style={{ color: '#888' }}>No items. Run ingest: POST /api/ingest/guardian</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              borderBottom: '1px solid #222',
              padding: '16px 0',
            }}
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#7ab', textDecoration: 'none', fontWeight: 500 }}
            >
              {item.title}
            </a>
            <div style={{ fontSize: '0.875rem', color: '#888', marginTop: 4 }}>
              {item.source} ·{' '}
              {Array.isArray(item.categories) && item.categories.length
                ? item.categories.join(', ')
                : item.category || 'General'}
            </div>
            {item.snippet && (
              <p style={{ fontSize: '0.875rem', color: '#aaa', marginTop: 6 }}>{item.snippet}</p>
            )}
            {item.summary && (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  background: '#1a1a1a',
                  borderRadius: 6,
                  fontSize: '0.875rem',
                }}
              >
                {item.summary}
              </div>
            )}
            <button
              onClick={() => handleSummarize(item.id)}
              disabled={summarizing === item.id}
              style={{
                marginTop: 8,
                padding: '6px 12px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: 6,
                color: '#aaa',
                cursor: summarizing === item.id ? 'wait' : 'pointer',
              }}
            >
              {summarizing === item.id ? '…' : item.summary ? 'Summary' : 'Summarize'}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
