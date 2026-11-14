import { companyInclude, toCompany } from './mappers/companyMapper.js';

export function createPrismaCompanyRepository(prisma) {
  return {
    findPartners: async (limit) => {
      const records = await prisma.company.findMany({
        where: { isPartner: true },
        include: companyInclude,
        orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        take: limit,
      });
      return records.map(toCompany);
    },
    count: () => prisma.company.count(),
  };
}
