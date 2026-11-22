import { createPlatformStat } from '../../../domain/internship/PlatformStat';
import { getJson } from './httpClient';

const freezeAll = (items) => items.map((item) => Object.freeze(item));

export function createHttpHomeRepository() {
  return {
    getPlatformStats: async () => (await getJson('/api/home/stats')).map(createPlatformStat),
    findPartnerCompanies: async () => freezeAll(await getJson('/api/home/partner-companies')),
    getSearchOptions: async () => {
      const { positions, locations } = await getJson('/api/home/search-options');
      return { positions, locations };
    },
    searchInternships: async ({ position, location }) =>
      freezeAll(await getJson('/api/home/internships', { position, location })),
  };
}
