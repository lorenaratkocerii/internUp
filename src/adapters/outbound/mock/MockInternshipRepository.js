import { createInternship } from '../../../domain/internship/Internship';
import { findMatchingInternships } from '../../../domain/internship/internshipSearch';
import { internshipRecords } from './mockData';

export function createMockInternshipRepository(records = internshipRecords) {
  const internships = records.map(createInternship);

  return {
    findFeatured: async () => internships.filter((internship) => internship.featured),
    search: async (criteria) => findMatchingInternships(internships, criteria),
    findAll: async () => internships,
    findById: async (id) => internships.find((internship) => internship.id === id) ?? null,
    findByCompany: async (companyId) =>
      internships.filter((internship) => internship.companyId === companyId),
  };
}
