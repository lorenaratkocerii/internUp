import { containsAllWords, normalizeText } from '../shared/text.js';

export function createSearchCriteria({ position = '', location = '' } = {}) {
  return Object.freeze({ position: String(position).trim(), location: String(location).trim() });
}

export function isEmptyCriteria({ position, location }) {
  return !position && !location;
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
