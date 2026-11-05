import { createMockApplicationRepository } from '../adapters/outbound/mock/MockApplicationRepository';
import { createMockCompanyRegistrationRepository } from '../adapters/outbound/mock/MockCompanyRegistrationRepository';
import { createMockCompanyRepository } from '../adapters/outbound/mock/MockCompanyRepository';
import { createMockInternshipRepository } from '../adapters/outbound/mock/MockInternshipRepository';
import { createMockStatsRepository } from '../adapters/outbound/mock/MockStatsRepository';
import { createCompanyUseCases } from '../application/companyUseCases';
import { createHomeUseCases } from '../application/homeUseCases';

export function createContainer() {
  const internshipRepository = createMockInternshipRepository();
  const companyRepository = createMockCompanyRepository();

  return {
    homeUseCases: createHomeUseCases({
      internshipRepository,
      companyRepository,
      statsRepository: createMockStatsRepository(),
    }),
    companyUseCases: createCompanyUseCases({
      internshipRepository,
      companyRepository,
      applicationRepository: createMockApplicationRepository(),
      companyRegistrationRepository: createMockCompanyRegistrationRepository(),
    }),
  };
}
