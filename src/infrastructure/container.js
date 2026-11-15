import { createAdminSessionStore } from '../adapters/outbound/http/adminSessionStore';
import { createHttpAdminGateway } from '../adapters/outbound/http/HttpAdminGateway';
import { createHttpClient } from '../adapters/outbound/http/httpClient';
import {
  createHttpHomeCompanyRepository,
  createHttpHomeDirectory,
  createHttpHomeInternshipRepository,
  createHttpStatsRepository,
} from '../adapters/outbound/http/HttpHomeRepositories';
import { createMockApplicationRepository } from '../adapters/outbound/mock/MockApplicationRepository';
import { createMockCandidateApplicationRepository } from '../adapters/outbound/mock/MockCandidateApplicationRepository';
import { createMockCompanyRegistrationRepository } from '../adapters/outbound/mock/MockCompanyRegistrationRepository';
import { createMockCompanyRepository } from '../adapters/outbound/mock/MockCompanyRepository';
import { createMockHomeDirectory } from '../adapters/outbound/mock/MockHomeDirectory';
import { createMockInternshipRepository } from '../adapters/outbound/mock/MockInternshipRepository';
import { createMockStatsRepository } from '../adapters/outbound/mock/MockStatsRepository';
import { createMockStoryRepository } from '../adapters/outbound/mock/MockStoryRepository';
import { createMockStudentVerificationRepository } from '../adapters/outbound/mock/MockStudentVerificationRepository';
import { createMockUniversityRepository } from '../adapters/outbound/mock/MockUniversityRepository';
import { createAdminUseCases } from '../application/adminUseCases';
import { createBlogUseCases } from '../application/blogUseCases';
import { createCareerPathUseCases } from '../application/careerPathUseCases';
import { createCompanyUseCases } from '../application/companyUseCases';
import { createCompanyWorkspaceUseCases } from '../application/companyWorkspaceUseCases';
import { createHomeUseCases } from '../application/homeUseCases';
import { createStudentApplicationUseCases } from '../application/studentApplicationUseCases';
import { createUniversityUseCases } from '../application/universityUseCases';
import { createUniversityWorkspaceUseCases } from '../application/universityWorkspaceUseCases';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export function createContainer() {
  const adminSessionStore = createAdminSessionStore();
  const publicHttp = createHttpClient({ baseUrl: API_URL });
  const adminHttp = createHttpClient({ baseUrl: API_URL, getToken: () => adminSessionStore.read()?.token ?? null });

  const internshipRepository = createMockInternshipRepository();
  const companyRepository = createMockCompanyRepository();
  const candidateApplicationRepository = createMockCandidateApplicationRepository();
  const storyRepository = createMockStoryRepository();
  const universityRepository = createMockUniversityRepository();
  const studentVerificationRepository = createMockStudentVerificationRepository();

  const blogUseCases = createBlogUseCases({
    storyRepository,
    companyRepository,
  });
  const universityUseCases = createUniversityUseCases({
    universityRepository,
    studentVerificationRepository,
    storyRepository,
  });

  return {
    homeUseCases: createHomeUseCases({
      internshipRepository: createHttpHomeInternshipRepository({ http: publicHttp, fallback: internshipRepository }),
      companyRepository: createHttpHomeCompanyRepository({ http: publicHttp, fallback: companyRepository }),
      statsRepository: createHttpStatsRepository({ http: publicHttp, fallback: createMockStatsRepository() }),
      homeDirectory: createHttpHomeDirectory({
        http: publicHttp,
        fallback: createMockHomeDirectory({
          internshipRepository,
          listUniversities: universityUseCases.listUniversities,
          listStories: blogUseCases.listStories,
        }),
      }),
    }),
    adminUseCases: createAdminUseCases({
      adminGateway: createHttpAdminGateway(adminHttp),
      adminSessionStore,
    }),
    companyUseCases: createCompanyUseCases({
      internshipRepository,
      companyRepository,
      applicationRepository: createMockApplicationRepository(),
      companyRegistrationRepository: createMockCompanyRegistrationRepository(),
    }),
    blogUseCases,
    careerPathUseCases: createCareerPathUseCases({
      companyRepository,
      internshipRepository,
      storyRepository,
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
      studentVerificationRepository,
    }),
    universityUseCases,
    universityWorkspaceUseCases: createUniversityWorkspaceUseCases({
      universityRepository,
      studentVerificationRepository,
      candidateApplicationRepository,
    }),
  };
}
