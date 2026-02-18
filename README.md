# DailyOrg

Personal daily reading organizer: aggregate Gmail, Guardian, NYTimes, and The Athletic (via browser extension), categorize by your interests, summarize articles, and explore similar content. Runs on **GCP free tier** (Cloud Run + Firestore).

## Repo structure

| Path | Description |
|------|-------------|
| `backend/` | Node.js API for Cloud Run: ingest, Firestore, categorization, summarization |
| `frontend/` | Next.js app: feed by category, Summarize button, (later) Explore similar |
| `extension/` | Browser extension to save Athletic articles (URL + title + body) to backend |
| `docs/` | [Daily-Reading-Organizer-Plan.md](docs/Daily-Reading-Organizer-Plan.md) and other docs |
| `backend/src/services/ai.js` | Centralized AI helpers (Gemini / Vertex) – categorization & summarization |

## Requirements

- **Node.js** 18+
- **GCP project** with Firestore, Secret Manager, and (for deploy) Cloud Run
- **API keys:** [Guardian Open Platform](https://open-platform.theguardian.com/access/), [NYTimes Developer](https://developer.nytimes.com/) (optional for Phase 1)
- **Secrets:** Store in GCP Secret Manager; never commit. See `backend/.env.example`.

## Quick start (local)

### Backend

```bash
cd backend
cp .env.example .env   # fill in values; get Guardian API key from open-platform.theguardian.com
npm install
npm run dev
```

- API: `http://localhost:8080`
- Ingest Guardian: `POST /api/ingest/guardian` (or run scheduled job)
- Feed: `GET /api/items?category=...`
- Summarize: `POST /api/items/:id/summarize`

### Frontend

```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:8080
npm install
npm run dev
```

- App: `http://localhost:3000`

## Environment variables (backend)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default `8080`) |
| `GOOGLE_CLOUD_PROJECT` | Yes (GCP) | GCP project ID for Firestore |
| `GUARDIAN_API_KEY` | Yes (Phase 1) | Guardian Open Platform API key |
| `EXTENSION_API_KEY` | Later | Secret for extension POST to /api/extension/save |
| `GEMINI_API_KEY` or Vertex | Later | For categorization and summarization (or use Vertex AI) |

See `backend/.env.example`. For Cloud Run, set env vars in the service or use Secret Manager.

## Deploy to Cloud Run

```bash
cd backend
gcloud run deploy dailyorg-api --source . --region us-central1
```

Set env vars and secrets in the Cloud Run service. Use Cloud Scheduler to call `POST /api/ingest/guardian` (and others) on a schedule.

## Docs

- [Daily Reading Organizer Plan](docs/Daily-Reading-Organizer-Plan.md) – architecture, phasing, GCP free tier, Firestore vector search

## Future improvements

- **TypeScript** for backend, frontend, and extension to make article/embedding types explicit.
- **IaC (Terraform/Pulumi)** for Cloud Run, Firestore (including vector index), and Cloud Scheduler/Tasks.

## License

Private / personal use.
