const UNIVERSITIES_ON_HOME = 6;

export function createGetHomeOverview({
  getPlatformStats,
  getPartnerCompanies,
  getSearchOptions,
  searchInternships,
  getUniversities,
  getLatestStories,
}) {
  return async function getHomeOverview() {
    const [stats, partnerCompanies, searchOptions, featured, universities, stories] = await Promise.all([
      getPlatformStats(),
      getPartnerCompanies(),
      getSearchOptions(),
      searchInternships(),
      getUniversities({ limit: UNIVERSITIES_ON_HOME }),
      getLatestStories(),
    ]);

    return {
      stats,
      partnerCompanies,
      searchOptions,
      featuredInternships: featured.internships,
      universities: { items: universities.universities, total: universities.total },
      stories,
    };
  };
}
