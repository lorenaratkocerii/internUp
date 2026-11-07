import { createInternship } from '../../../domain/internship/Internship';
import { findMatchingInternships } from '../../../domain/internship/internshipSearch';
import { createLocalJsonStore } from './localJsonStore';
import { internshipRecords } from './mockData';

export function createMockInternshipRepository(records = internshipRecords) {
  const seeded = records.map(createInternship);
  const store = createLocalJsonStore('internup:managed-internships', { saved: {}, removed: [] });

  const toInternship = (record) => {
    try {
      return createInternship(record);
    } catch {
      return null;
    }
  };

  const getAll = () => {
    const { saved, removed } = store.read();
    const hidden = new Set(removed);
    const base = seeded.filter((item) => !hidden.has(item.id)).map((item) => (saved[item.id] ? toInternship(saved[item.id]) : item));
    const created = Object.values(saved)
      .filter((record) => !hidden.has(record.id) && !seeded.some((item) => item.id === record.id))
      .map(toInternship);
    return [...created.reverse(), ...base].filter(Boolean);
  };

  return {
    findFeatured: async () => getAll().filter((internship) => internship.featured),
    search: async (criteria) => findMatchingInternships(getAll(), criteria),
    findAll: async () => getAll(),
    findById: async (id) => getAll().find((internship) => internship.id === id) ?? null,
    findByCompany: async (companyId) => getAll().filter((internship) => internship.companyId === companyId),
    save: async (internship) =>
      store.update(({ saved, removed }) => ({
        saved: { ...saved, [internship.id]: internship },
        removed: removed.filter((id) => id !== internship.id),
      })),
    remove: async (id) =>
      store.update(({ saved, removed }) => {
        const { [id]: _deleted, ...rest } = saved;
        return { saved: rest, removed: [...new Set([...removed, id])] };
      }),
  };
}
