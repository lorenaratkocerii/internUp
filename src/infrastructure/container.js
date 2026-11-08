import { createMockApplicationRepository } from '../adapters/outbound/mock/MockApplicationRepository';
import { createMockCandidateApplicationRepository } from '../adapters/outbound/mock/MockCandidateApplicationRepository';
import { createMockCompanyRegistrationRepository } from '../adapters/outbound/mock/MockCompanyRegistrationRepository';
import { createMockCompanyRepository } from '../adapters/outbound/mock/MockCompanyRepository';
import { createMockInternshipRepository } from '../adapters/outbound/mock/MockInternshipRepository';
import { createMockStatsRepository } from '../adapters/outbound/mock/MockStatsRepository';
import { createMockStoryRepository } from '../adapters/outbound/mock/MockStoryRepository';
import { createMockStudentVerificationRepository } from '../adapters/outbound/mock/MockStudentVerificationRepository';
import { createMockUniversityRepository } from '../adapters/outbound/mock/MockUniversityRepository';
import { createBlogUseCases } from '../application/blogUseCases';
import { createCompanyUseCases } from '../application/companyUseCases';
import { createCompanyWorkspaceUseCases } from '../application/companyWorkspaceUseCases';
import { createHomeUseCases } from '../application/homeUseCases';
import { createStudentApplicationUseCases } from '../application/studentApplicationUseCases';
import { createUniversityUseCases } from '../application/universityUseCases';
import { createUniversityWorkspaceUseCases } from '../application/universityWorkspaceUseCases';

export function createContainer() {
  const internshipRepository = createMockInternshipRepository();
  const companyRepository = createMockCompanyRepository();
  const candidateApplicationRepository = createMockCandidateApplicationRepository();
  const storyRepository = createMockStoryRepository();
  const universityRepository = createMockUniversityRepository();
  const studentVerificationRepository = createMockStudentVerificationRepository();

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
    blogUseCases: createBlogUseCases({
      storyRepository,
      companyRepository,
    }),
    companyWorkspaceUseCases: createCompanyWorkspaceUseCases({
      companyRepository,
      internshipRepository,
      candidateApplicationRepository,
      storyRepository,
      studentVerificationRepository,
      universityRepository,
    }),
    studentApplicationUseCases: createStudentApplicationUseCases({
      internshipRepository,
      companyRepository,
      candidateApplicationRepository,
    }),
    universityUseCases: createUniversityUseCases({
      universityRepository,
      studentVerificationRepository,
      storyRepository,
    }),
    universityWorkspaceUseCases: createUniversityWorkspaceUseCases({
      universityRepository,
      studentVerificationRepository,
      candidateApplicationRepository,
    }),
  };
}
