import { withApplicationStatus } from '../../domain/internship/applicationStatus.js';
import {
  createSearchCriteria,
  findMatchingInternships,
  isEmptyCriteria,
} from '../../domain/internship/internshipSearch.js';
import { ValidationError } from '../errors.js';

const MAX_QUERY_LENGTH = 100;

function assertValidCriteria(criteria) {
  const details = {};
  if (criteria.position.length > MAX_QUERY_LENGTH) {
    details.position = `Pozita nuk mund të ketë më shumë se ${MAX_QUERY_LENGTH} karaktere.`;
  }
  if (criteria.location.length > MAX_QUERY_LENGTH) {
    details.location = `Lokacioni nuk mund të ketë më shumë se ${MAX_QUERY_LENGTH} karaktere.`;
  }
  if (Object.keys(details).length > 0) throw new ValidationError('Kriteret e kërkimit nuk janë të vlefshme.', details);
}

export function createSearchInternships({ internships, now }) {
  return async function searchInternships(rawCriteria = {}) {
    const criteria = createSearchCriteria(rawCriteria);
    assertValidCriteria(criteria);

    const found = isEmptyCriteria(criteria)
      ? await internships.findFeatured()
      : findMatchingInternships(await internships.findAll(), criteria);

    const today = now();
    return {
      criteria,
      internships: found.map((internship) => withApplicationStatus(internship, today)),
    };
  };
}
