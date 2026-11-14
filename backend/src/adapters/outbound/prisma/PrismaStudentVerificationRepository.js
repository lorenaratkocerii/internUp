import { toVerificationRequest, verificationSelect } from './mappers/universityMapper.js';

export function createPrismaStudentVerificationRepository(prisma) {
  return {
    findAll: async () => {
      const records = await prisma.studentVerification.findMany({
        select: verificationSelect,
        orderBy: { submittedAt: 'desc' },
      });
      return records.map(toVerificationRequest);
    },
  };
}
