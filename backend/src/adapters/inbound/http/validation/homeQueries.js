import { ValidationError } from '../../../../application/errors.js';

const MAX_LIMIT = 50;

export function parseLimitQuery(query) {
  const raw = query.limit;
  if (raw === undefined || raw === '') return {};

  const limit = Number(raw);
  if (typeof raw !== 'string' || !Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new ValidationError('Parametrat e kërkesës nuk janë të vlefshëm.', {
      limit: `"limit" duhet të jetë numër i plotë nga 1 deri në ${MAX_LIMIT}.`,
    });
  }
  return { limit };
}

export function parseSearchQuery(query) {
  const details = {};
  const read = (name) => {
    const value = query[name];
    if (value === undefined) return '';
    if (typeof value !== 'string') {
      details[name] = `"${name}" duhet të jetë tekst i vetëm.`;
      return '';
    }
    return value;
  };

  const criteria = { position: read('position'), location: read('location') };
  if (Object.keys(details).length > 0) {
    throw new ValidationError('Parametrat e kërkesës nuk janë të vlefshëm.', details);
  }
  return criteria;
}
