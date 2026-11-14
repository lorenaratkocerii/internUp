import { createHomeController } from '../adapters/inbound/http/controllers/homeController.js';
import { createPrismaCityRepository } from '../adapters/outbound/prisma/PrismaCityRepository.js';
import { createPrismaCompanyRepository } from '../adapters/outbound/prisma/PrismaCompanyRepository.js';
import { createPrismaInternshipRepository } from '../adapters/outbound/prisma/PrismaInternshipRepository.js';
import { createPrismaStoryRepository } from '../adapters/outbound/prisma/PrismaStoryRepository.js';
import { createPrismaStudentVerificationRepository } from '../adapters/outbound/prisma/PrismaStudentVerificationRepository.js';
import { createPrismaUniversityRepository } from '../adapters/outbound/prisma/PrismaUniversityRepository.js';
import { createHomeUseCases } from '../application/home/index.js';

export function createContainer({ prisma }) {
  const homeUseCases = createHomeUseCases({
    internshipRepository: createPrismaInternshipRepository(prisma),
    companyRepository: createPrismaCompanyRepository(prisma),
    universityRepository: createPrismaUniversityRepository(prisma),
    studentVerificationRepository: createPrismaStudentVerificationRepository(prisma),
    storyRepository: createPrismaStoryRepository(prisma),
    cityRepository: createPrismaCityRepository(prisma),
  });

  return {
    useCases: { homeUseCases },
    controllers: { homeController: createHomeController(homeUseCases) },
  };
}
