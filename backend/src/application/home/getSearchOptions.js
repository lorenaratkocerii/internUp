import { uniqueSorted } from '../../domain/shared/text.js';

export function createGetSearchOptions({ internships, cities }) {
  return async function getSearchOptions() {
    const [allInternships, cityNames] = await Promise.all([internships.findAll(), cities.findAllNames()]);

    return {
      positions: uniqueSorted(allInternships.map((internship) => internship.title)),
      locations: uniqueSorted(cityNames),
    };
  };
}
