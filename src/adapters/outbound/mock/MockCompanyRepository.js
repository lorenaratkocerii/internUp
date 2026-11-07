import { createCompany } from '../../../domain/internship/Company';
import { companyRecords } from './mockData';
import { getPublishedPositionRecords } from './publishedPositionsStore';

const PARTNERS_ON_HOME = 6;

export function createMockCompanyRepository(records = companyRecords) {
  const companies = records.map(createCompany);
  const getAllCompanies = () => {
    const all = [...companies];
    for (const { company } of getPublishedPositionRecords()) {
      if (!all.some((item) => item.id === company.id)) all.push(createCompany(company));
    }
    return all;
  };

  return {
    findPartners: async () => getAllCompanies().slice(0, PARTNERS_ON_HOME),
    findAll: async () => getAllCompanies(),
    findById: async (id) => getAllCompanies().find((company) => company.id === id) ?? null,
  };
}
