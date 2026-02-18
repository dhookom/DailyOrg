# Firestore index (Phase 3)

For **vector search** ("Explore similar"), create a vector index on the `items` collection.

1. In Firestore, open the collection `items` and ensure documents have an `embedding` field (array of numbers).
2. Create a vector index with dimension matching your embedding model (e.g. 768 for `text-embedding-004`).

Example via gcloud (adjust collection and field):

```bash
# See Firestore vector search docs for exact index definition
# https://firebase.google.com/docs/firestore/vector-search
```

For **Phase 1** no composite index is required: the app fetches items ordered by `fetchedAt` and filters by category in memory.
