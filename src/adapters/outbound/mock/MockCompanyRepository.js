import { createCompany } from '../../../domain/internship/Company';
import { companyRecords } from './mockData';

const PARTNERS_ON_HOME = 6;

export function createMockCompanyRepository(records = companyRecords) {
  const companies = records.map(createCompany);

  return {
    findPartners: async () => companies.slice(0, PARTNERS_ON_HOME),
    findAll: async () => companies,
    findById: async (id) => companies.find((company) => company.id === id) ?? null,
  };
}
