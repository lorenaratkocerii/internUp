const STORAGE_KEY = 'internup:published-positions';

export function getPublishedPositionRecords() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function savePublishedPositionRecord(record) {
  const current = getPublishedPositionRecords();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, record]));
}
