import { rankByVerifiedStudents } from '../../domain/university/studentVerification.js';

export function createGetUniversities({ universities, verifications }) {
  return async function getUniversities({ limit = null } = {}) {
    const [all, requests] = await Promise.all([universities.findAll(), verifications.findAll()]);
    const ranked = rankByVerifiedStudents(all, requests);

    return {
      universities: limit ? ranked.slice(0, limit) : ranked,
      total: ranked.length,
    };
  };
}
