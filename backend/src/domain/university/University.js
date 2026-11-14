import { DomainError } from '../shared/DomainError.js';

export const UniversityType = Object.freeze({
  PUBLIC: 'publik',
  PRIVATE: 'privat',
});

export function createUniversity({ id, name, shortName = '', type, city, logo = '', website = '' }) {
  if (!id || !name || !city) {
    throw new DomainError('Një universitet duhet të ketë id, emër dhe qytet.');
  }
  if (!Object.values(UniversityType).includes(type)) {
    throw new DomainError(`Lloj i panjohur universiteti: ${type}`);
  }

  return Object.freeze({ id, name, shortName: shortName || name, type, city, logo, website });
}
