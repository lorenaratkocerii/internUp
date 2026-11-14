import { toUniversity, universityInclude } from './mappers/universityMapper.js';

export function createPrismaUniversityRepository(prisma) {
  return {
    findAll: async () => {
      const records = await prisma.university.findMany({ include: universityInclude, orderBy: { id: 'asc' } });
      return records.map(toUniversity);
    },
    count: () => prisma.university.count(),
  };
}
