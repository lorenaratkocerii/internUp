import { asAdminRepository } from '../ports/AdminRepository.js';
import { asHomeContentRepository } from '../ports/HomeContentRepository.js';
import { asPasswordHasher } from '../ports/PasswordHasher.js';
import { asTokenService } from '../ports/TokenService.js';
import { createAdminAuth } from './adminAuth.js';
import { createManageHomeContent } from './manageHomeContent.js';

export function createAdminUseCases({
  adminRepository,
  homeContentRepository,
  passwordHasher,
  tokenService,
  getPlatformStats,
  now = () => new Date(),
}) {
  return Object.freeze({
    ...createAdminAuth({
      admins: asAdminRepository(adminRepository),
      hasher: asPasswordHasher(passwordHasher),
      tokens: asTokenService(tokenService),
      now,
    }),
    ...createManageHomeContent({
      content: asHomeContentRepository(homeContentRepository),
      getPlatformStats,
    }),
  });
}
