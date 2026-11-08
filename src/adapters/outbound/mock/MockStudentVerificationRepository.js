import { createVerificationRequest } from '../../../domain/university/studentVerification';
import { createLocalJsonStore } from './localJsonStore';
import { verificationRecords } from './universityData';

const newestFirst = (a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt);

export function createMockStudentVerificationRepository(records = verificationRecords) {
  const seeded = Object.fromEntries(records.map((record) => [record.id, record]));
  const store = createLocalJsonStore('internup:student-verifications', {});

  const getAll = () =>
    Object.values({ ...seeded, ...store.read() })
      .map((record) => {
        try {
          return createVerificationRequest(record);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort(newestFirst);

  return {
    findAll: async () => getAll(),
    findById: async (id) => getAll().find((request) => request.id === id) ?? null,
    findByUniversity: async (universityId) => getAll().filter((request) => request.universityId === universityId),
    findByStudent: async (email) => {
      const needle = String(email ?? '').toLowerCase();
      return getAll().filter((request) => request.student.email === needle);
    },
    save: async (request) => store.update((saved) => ({ ...saved, [request.id]: request })),
  };
}
