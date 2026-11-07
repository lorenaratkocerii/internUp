import { createInternship } from '../../../domain/internship/Internship';
import { findMatchingInternships } from '../../../domain/internship/internshipSearch';
import { internshipRecords } from './mockData';
import { getPublishedPositionRecords } from './publishedPositionsStore';

export function createMockInternshipRepository(records = internshipRecords) {
  const internships = records.map(createInternship);
  const getAllInternships = () => [
    ...internships,
    ...getPublishedPositionRecords().map(({ internship }) => createInternship(internship)),
  ];

  return {
    findFeatured: async () => getAllInternships().filter((internship) => internship.featured),
    search: async (criteria) => findMatchingInternships(getAllInternships(), criteria),
    findAll: async () => getAllInternships(),
    findById: async (id) => getAllInternships().find((internship) => internship.id === id) ?? null,
    findByCompany: async (companyId) =>
      getAllInternships().filter((internship) => internship.companyId === companyId),
  };
}
