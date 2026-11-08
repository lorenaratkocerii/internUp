import { createUniversity } from '../../../domain/university/University';
import { createLocalJsonStore } from './localJsonStore';
import { universityRecords } from './universityData';

export function createMockUniversityRepository(records = universityRecords) {
  const seeded = records.map(createUniversity);
  const store = createLocalJsonStore('internup:university-profiles', {});

  const toUniversity = (record) => {
    try {
      return createUniversity(record);
    } catch {
      return null;
    }
  };

  const getAll = () => {
    const saved = store.read();
    const base = seeded.map((university) => (saved[university.id] ? toUniversity(saved[university.id]) ?? university : university));
    const created = Object.values(saved)
      .filter((record) => !seeded.some((university) => university.id === record.id))
      .map(toUniversity)
      .filter(Boolean);
    return [...base, ...created];
  };

  return {
    findAll: async () => getAll(),
    findById: async (id) => getAll().find((university) => university.id === id) ?? null,
    save: async (university) => store.update((saved) => ({ ...saved, [university.id]: university })),
  };
}
