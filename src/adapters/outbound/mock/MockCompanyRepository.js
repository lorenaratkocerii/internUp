import { createCompany } from '../../../domain/internship/Company';
import { createLocalJsonStore } from './localJsonStore';
import { companyRecords } from './mockData';

const PARTNERS_ON_HOME = 6;

export function createMockCompanyRepository(records = companyRecords) {
  const seeded = records.map(createCompany);
  const store = createLocalJsonStore('internup:company-profiles', {});

  const toCompany = (record) => {
    try {
      return createCompany(record);
    } catch {
      return null;
    }
  };

  const getAll = () => {
    const saved = store.read();
    const base = seeded.map((company) => (saved[company.id] ? toCompany(saved[company.id]) ?? company : company));
    const created = Object.values(saved)
      .filter((record) => !seeded.some((company) => company.id === record.id))
      .map(toCompany)
      .filter(Boolean);
    return [...base, ...created];
  };

  return {
    findPartners: async () => getAll().slice(0, PARTNERS_ON_HOME),
    findAll: async () => getAll(),
    findById: async (id) => getAll().find((company) => company.id === id) ?? null,
    save: async (company) => store.update((saved) => ({ ...saved, [company.id]: company })),
  };
}
