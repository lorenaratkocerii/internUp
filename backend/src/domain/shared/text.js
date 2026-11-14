export function normalizeText(text = '') {
  return String(text)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function containsAllWords(haystack, query) {
  const text = normalizeText(haystack);
  return normalizeText(query)
    .split(/\s+/)
    .every((word) => text.includes(word));
}

export function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'sq'));
}
