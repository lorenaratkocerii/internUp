import { createAdminController } from '../adapters/inbound/http/controllers/adminController.js';
import { createHomeController } from '../adapters/inbound/http/controllers/homeController.js';
import { createLoginRateLimiter } from '../adapters/inbound/http/middleware/loginRateLimiter.js';
import { createRequireAdmin } from '../adapters/inbound/http/middleware/requireAdmin.js';
import { createPrismaAdminRepository } from '../adapters/outbound/prisma/PrismaAdminRepository.js';
import { createPrismaCityRepository } from '../adapters/outbound/prisma/PrismaCityRepository.js';
import { createPrismaCompanyRepository } from '../adapters/outbound/prisma/PrismaCompanyRepository.js';
import { createPrismaHomeContentRepository } from '../adapters/outbound/prisma/PrismaHomeContentRepository.js';
import { createPrismaInternshipRepository } from '../adapters/outbound/prisma/PrismaInternshipRepository.js';
import { createPrismaStoryRepository } from '../adapters/outbound/prisma/PrismaStoryRepository.js';
import { createPrismaStudentVerificationRepository } from '../adapters/outbound/prisma/PrismaStudentVerificationRepository.js';
import { createPrismaUniversityRepository } from '../adapters/outbound/prisma/PrismaUniversityRepository.js';
import { createJwtTokenService } from '../adapters/outbound/security/JwtTokenService.js';
import { createScryptPasswordHasher } from '../adapters/outbound/security/ScryptPasswordHasher.js';
import { createAdminUseCases } from '../application/admin/index.js';
import { createHomeUseCases } from '../application/home/index.js';

export function createContainer({ prisma, jwtSecret, jwtExpiresIn }) {
  const homeUseCases = createHomeUseCases({
    internshipRepository: createPrismaInternshipRepository(prisma),
    companyRepository: createPrismaCompanyRepository(prisma),
    universityRepository: createPrismaUniversityRepository(prisma),
    studentVerificationRepository: createPrismaStudentVerificationRepository(prisma),
    storyRepository: createPrismaStoryRepository(prisma),
    cityRepository: createPrismaCityRepository(prisma),
  });

  const adminUseCases = createAdminUseCases({
    adminRepository: createPrismaAdminRepository(prisma),
    homeContentRepository: createPrismaHomeContentRepository(prisma),
    passwordHasher: createScryptPasswordHasher(),
    tokenService: createJwtTokenService({ secret: jwtSecret, expiresIn: jwtExpiresIn }),
    getPlatformStats: homeUseCases.getPlatformStats,
  });

  return {
    useCases: { homeUseCases, adminUseCases },
    controllers: {
      homeController: createHomeController(homeUseCases),
      adminController: createAdminController(adminUseCases),
      requireAdmin: createRequireAdmin(adminUseCases),
      loginRateLimiter: createLoginRateLimiter(),
    },
  };
}
