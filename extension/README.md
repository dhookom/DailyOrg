# DailyOrg – Save to Reading App (Athletic)

Browser extension to save The Athletic articles (URL, title, full body) to the DailyOrg backend. **Phase 2.**

## Status

Placeholder. To implement:

1. Manifest V3 extension (Chrome).
2. Content script on `*://theathletic.com/*` to read article title and body from DOM.
3. Popup or context menu: "Save to Reading App" / "Save & Summarize".
4. POST to `BACKEND_URL/api/extension/save` with header `x-api-key: EXTENSION_API_KEY` and body `{ url, title, fullText, summarize }`.

## Config

- Backend URL and API key: set in extension options or popup (user configures once).
