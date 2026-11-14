import { asCityRepository } from '../ports/CityRepository.js';
import { asCompanyRepository } from '../ports/CompanyRepository.js';
import { asInternshipRepository } from '../ports/InternshipRepository.js';
import { asStoryRepository } from '../ports/StoryRepository.js';
import { asStudentVerificationRepository } from '../ports/StudentVerificationRepository.js';
import { asUniversityRepository } from '../ports/UniversityRepository.js';
import { createGetHomeOverview } from './getHomeOverview.js';
import { createGetLatestStories } from './getLatestStories.js';
import { createGetPartnerCompanies } from './getPartnerCompanies.js';
import { createGetPlatformStats } from './getPlatformStats.js';
import { createGetSearchOptions } from './getSearchOptions.js';
import { createGetUniversities } from './getUniversities.js';
import { createSearchInternships } from './searchInternships.js';

export function createHomeUseCases({
  internshipRepository,
  companyRepository,
  universityRepository,
  studentVerificationRepository,
  storyRepository,
  cityRepository,
  now = () => new Date(),
}) {
  const internships = asInternshipRepository(internshipRepository);
  const companies = asCompanyRepository(companyRepository);
  const universities = asUniversityRepository(universityRepository);
  const verifications = asStudentVerificationRepository(studentVerificationRepository);
  const stories = asStoryRepository(storyRepository);
  const cities = asCityRepository(cityRepository);

  const getPlatformStats = createGetPlatformStats({ internships, companies, universities, stories });
  const getPartnerCompanies = createGetPartnerCompanies({ companies });
  const getSearchOptions = createGetSearchOptions({ internships, cities });
  const searchInternships = createSearchInternships({ internships, now });
  const getUniversities = createGetUniversities({ universities, verifications });
  const getLatestStories = createGetLatestStories({ stories });
  const getHomeOverview = createGetHomeOverview({
    getPlatformStats,
    getPartnerCompanies,
    getSearchOptions,
    searchInternships,
    getUniversities,
    getLatestStories,
  });

  return Object.freeze({
    getPlatformStats,
    getPartnerCompanies,
    getSearchOptions,
    searchInternships,
    getUniversities,
    getLatestStories,
    getHomeOverview,
  });
}
