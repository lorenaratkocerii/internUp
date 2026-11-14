import { createPlatformStats } from '../../domain/stats/PlatformStat.js';

export function createGetPlatformStats({ internships, companies, universities, stories }) {
  return async function getPlatformStats() {
    const [internshipCount, companyCount, universityCount, storyCount] = await Promise.all([
      internships.count(),
      companies.count(),
      universities.count(),
      stories.count(),
    ]);

    return createPlatformStats({
      internships: internshipCount,
      companies: companyCount,
      universities: universityCount,
      stories: storyCount,
    });
  };
}
