import { createCandidateApplication } from '../../../domain/internship/candidateApplication';
import { candidateApplicationRecords } from './candidateApplicationData';
import { createLocalJsonStore } from './localJsonStore';

export function createMockCandidateApplicationRepository(records = candidateApplicationRecords) {
  const seeded = records.map(createCandidateApplication);
  const store = createLocalJsonStore('internup:candidate-applications', {});

  const toApplication = (record) => {
    try {
      return createCandidateApplication(record);
    } catch {
      return null;
    }
  };

  const getAll = () => {
    const saved = store.read();
    const base = seeded.map((item) => (saved[item.id] ? toApplication(saved[item.id]) ?? item : item));
    const created = Object.values(saved)
      .filter((record) => !seeded.some((item) => item.id === record.id))
      .map(toApplication)
      .filter(Boolean);
    return [...created, ...base].sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
  };

  return {
    findById: async (id) => getAll().find((item) => item.id === id) ?? null,
    findByCompany: async (companyId) => getAll().filter((item) => item.companyId === companyId),
    findByStudent: async (email) => {
      const normalized = String(email ?? '').trim().toLowerCase();
      return getAll().filter((item) => item.student.email === normalized);
    },
    save: async (application) => store.update((saved) => ({ ...saved, [application.id]: application })),
  };
}
