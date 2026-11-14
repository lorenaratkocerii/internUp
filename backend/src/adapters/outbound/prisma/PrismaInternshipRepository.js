import { internshipInclude, toInternship } from './mappers/internshipMapper.js';

const newestFirst = [{ createdAt: 'desc' }, { id: 'asc' }];

export function createPrismaInternshipRepository(prisma) {
  const findMany = async (where = {}) => {
    const records = await prisma.internship.findMany({ where, include: internshipInclude, orderBy: newestFirst });
    return records.map(toInternship);
  };

  return {
    findAll: () => findMany(),
    findFeatured: () => findMany({ featured: true }),
    count: () => prisma.internship.count(),
  };
}
