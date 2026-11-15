import { uniqueSorted } from '../../../domain/internship/internshipSearch';
import { KOSOVO_CITIES } from '../../../domain/internship/locations';

export function createMockHomeDirectory({ internshipRepository, listUniversities, listStories }) {
  return {
    getSearchOptions: async () => {
      const all = await internshipRepository.findAll();
      return {
        positions: uniqueSorted(all.map((internship) => internship.title)),
        locations: uniqueSorted(KOSOVO_CITIES),
      };
    },
    listUniversities,
    listStories,
  };
}
