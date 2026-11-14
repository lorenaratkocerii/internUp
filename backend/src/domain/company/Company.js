import { DomainError } from '../shared/DomainError.js';

export const PARTNERS_ON_HOME = 6;

export function createCompany({
  id,
  name,
  shortDescription = '',
  industry,
  location,
  foundedYear,
  website = '',
}) {
  if (!id || !name || !industry || !location) {
    throw new DomainError('Një kompani duhet të ketë id, emër, industri dhe lokacion.');
  }
  if (!Number.isInteger(foundedYear)) {
    throw new DomainError('Viti i themelimit duhet të jetë numër i plotë.');
  }

  return Object.freeze({ id, name, shortDescription, industry, location, foundedYear, website });
}
