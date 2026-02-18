import { Firestore } from '@google-cloud/firestore';

const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
const db = projectId
  ? new Firestore({ projectId })
  : new Firestore(); // ADC when running on GCP

const ITEMS_COLLECTION = 'items';

export function getItemsCollection() {
  return db.collection(ITEMS_COLLECTION);
}

export async function getItemById(id) {
  const ref = db.collection(ITEMS_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getItemsByCategory(category) {
  const query = db.collection(ITEMS_COLLECTION).orderBy('fetchedAt', 'desc').limit(300);
  const snap = await query.get();
  let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (category) {
    items = items.filter((i) => (i.category || 'General') === category);
  }
  return items;
}

export async function findItemByUrl(url) {
  const normalized = normalizeUrl(url);
  const snap = await db
    .collection(ITEMS_COLLECTION)
    .where('urlNormalized', '==', normalized)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

export function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = '';
    u.searchParams.sort();
    return u.toString();
  } catch {
    return url;
  }
}

export async function createItem(data) {
  const ref = db.collection(ITEMS_COLLECTION).doc();
  const payload = {
    ...data,
    urlNormalized: data.url ? normalizeUrl(data.url) : null,
    fetchedAt: data.fetchedAt || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  await ref.set(payload);
  return { id: ref.id, ...payload };
}

export async function updateItem(id, updates) {
  const ref = db.collection(ITEMS_COLLECTION).doc(id);
  await ref.update({ ...updates, updatedAt: new Date().toISOString() });
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
}
