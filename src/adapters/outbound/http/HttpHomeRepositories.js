import { createCompany } from '../../../domain/internship/Company';
import { createInternship } from '../../../domain/internship/Internship';
import { createPlatformStat } from '../../../domain/internship/PlatformStat';
import { createUniversity } from '../../../domain/university/University';
import { isUnavailable } from './httpClient';

function orFallback(request, fallback) {
  return async (...args) => {
    try {
      return await request(...args);
    } catch (error) {
      if (isUnavailable(error)) return fallback(...args);
      throw error;
    }
  };
}

export function createHttpStatsRepository({ http, fallback }) {
  return {
    getPlatformStats: orFallback(
      async () => (await http.get('/home/stats')).map(createPlatformStat),
      () => fallback.getPlatformStats(),
    ),
  };
}

export function createHttpHomeCompanyRepository({ http, fallback }) {
  return {
    ...fallback,
    findPartners: orFallback(
      async () => (await http.get('/home/partner-companies')).map(createCompany),
      () => fallback.findPartners(),
    ),
  };
}

export function createHttpHomeInternshipRepository({ http, fallback }) {
  const fetchInternships = async (criteria) => (await http.get('/home/internships', criteria)).map(createInternship);

  return {
    ...fallback,
    findFeatured: orFallback(
      () => fetchInternships(),
      () => fallback.findFeatured(),
    ),
    search: orFallback(fetchInternships, (criteria) => fallback.search(criteria)),
  };
}

export function createHttpHomeDirectory({ http, fallback }) {
  return {
    getSearchOptions: orFallback(
      () => http.get('/home/search-options'),
      () => fallback.getSearchOptions(),
    ),
    listUniversities: orFallback(
      async () =>
        (await http.get('/home/universities')).map(({ verifiedStudents, ...university }) => ({
          ...createUniversity(university),
          verifiedStudents,
        })),
      () => fallback.listUniversities(),
    ),
    listStories: orFallback(
      () => http.get('/home/stories'),
      () => fallback.listStories(),
    ),
  };
}
