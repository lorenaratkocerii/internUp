import { withApplicationStatus } from '../domain/internship/applicationStatus';
import {
  createSearchCriteria,
  filterSearchOptions,
  isEmptyCriteria,
  uniqueSorted,
} from '../domain/internship/internshipSearch';
import { KOSOVO_CITIES } from '../domain/internship/locations';
import { asCompanyRepository } from './ports/CompanyRepository';
import { asInternshipRepository } from './ports/InternshipRepository';
import { asStatsRepository } from './ports/StatsRepository';

export function createHomeUseCases({ internshipRepository, companyRepository, statsRepository }) {
  const internships = asInternshipRepository(internshipRepository);
  const companies = asCompanyRepository(companyRepository);
  const stats = asStatsRepository(statsRepository);

  return Object.freeze({
    getPlatformStats: () => stats.getPlatformStats(),
    getPartnerCompanies: () => companies.findPartners(),
    filterSearchOptions,

    getSearchOptions: async () => {
      const all = await internships.findAll();
      return {
        positions: uniqueSorted(all.map((internship) => internship.title)),
        locations: uniqueSorted(KOSOVO_CITIES),
      };
    },

    searchInternships: async (rawCriteria) => {
      const criteria = createSearchCriteria(rawCriteria);
      const found = await (isEmptyCriteria(criteria)
        ? internships.findFeatured()
        : internships.search(criteria));
      return found.map((internship) => withApplicationStatus(internship));
    },
  });
}
