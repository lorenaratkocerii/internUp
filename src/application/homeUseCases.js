import { withApplicationStatus } from '../domain/internship/applicationStatus';
import { createSearchCriteria, filterSearchOptions, isEmptyCriteria } from '../domain/internship/internshipSearch';
import { asCompanyRepository } from './ports/CompanyRepository';
import { asHomeDirectory } from './ports/HomeDirectory';
import { asInternshipRepository } from './ports/InternshipRepository';
import { asStatsRepository } from './ports/StatsRepository';

export function createHomeUseCases({ internshipRepository, companyRepository, statsRepository, homeDirectory }) {
  const internships = asInternshipRepository(internshipRepository);
  const companies = asCompanyRepository(companyRepository);
  const stats = asStatsRepository(statsRepository);
  const directory = asHomeDirectory(homeDirectory);

  return Object.freeze({
    getPlatformStats: () => stats.getPlatformStats(),
    getPartnerCompanies: () => companies.findPartners(),
    filterSearchOptions,

    getSearchOptions: () => directory.getSearchOptions(),
    listUniversities: () => directory.listUniversities(),
    listStories: () => directory.listStories(),

    searchInternships: async (rawCriteria) => {
      const criteria = createSearchCriteria(rawCriteria);
      const found = await (isEmptyCriteria(criteria)
        ? internships.findFeatured()
        : internships.search(criteria));
      return found.map((internship) => withApplicationStatus(internship));
    },
  });
}
