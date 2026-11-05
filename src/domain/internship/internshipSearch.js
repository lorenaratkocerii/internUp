export function normalizeText(text = '') {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function createSearchCriteria({ position = '', location = '' } = {}) {
  return Object.freeze({ position: position.trim(), location: location.trim() });
}

export function isEmptyCriteria({ position, location }) {
  return !position && !location;
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

export function filterSearchOptions(options, text) {
  return options.filter((option) => containsAllWords(option, text));
}

export function findMatchingInternships(internships, { position, location }) {
  const query = normalizeText(position);
  const sameTitle = internships.filter((internship) => normalizeText(internship.title) === query);
  const pool = sameTitle.length > 0 ? sameTitle : internships;

  return pool.filter((internship) => {
    const positionText = [internship.title, ...internship.skills].join(' ');
    const locationText = `${internship.location} ${internship.workMode}`;
    return containsAllWords(positionText, position) && containsAllWords(locationText, location);
  });
}
