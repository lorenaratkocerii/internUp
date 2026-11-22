import { createSearchCriteria, filterSearchOptions } from '../domain/internship/internshipSearch';
import { asHomeRepository } from './ports/HomeRepository';

export function createHomeUseCases({ homeRepository }) {
  const home = asHomeRepository(homeRepository);

  return Object.freeze({
    getPlatformStats: () => home.getPlatformStats(),
    getPartnerCompanies: () => home.findPartnerCompanies(),
    getSearchOptions: () => home.getSearchOptions(),
    searchInternships: (rawCriteria) => home.searchInternships(createSearchCriteria(rawCriteria)),
    filterSearchOptions,
  });
}
