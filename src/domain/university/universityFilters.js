import { normalizeText } from './University';

export const EMPTY_UNIVERSITY_FILTERS = Object.freeze({ query: '', type: '', city: '' });

export function matchesUniversityFilters(university, filters) {
  if (filters.type && university.type !== filters.type) return false;
  if (filters.city && university.city !== filters.city) return false;

  const query = normalizeText(filters.query);
  if (!query) return true;
  const haystack = normalizeText([university.name, university.shortName, university.city, ...university.aliases].join(' '));
  return query.split(' ').every((word) => haystack.includes(word));
}
