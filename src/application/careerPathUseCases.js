import { CAREER_FIELDS, findCareerField } from '../domain/career/careerFields';
import { companiesInField, countSkills, positionsInField, storiesInField } from '../domain/career/fieldInsights';
import { sortByNewest } from '../domain/blog/storyFilters';
import { acceptsApplications } from '../domain/internship/applicationStatus';
import { asCompanyRepository } from './ports/CompanyRepository';
import { asInternshipRepository } from './ports/InternshipRepository';
import { asStoryRepository } from './ports/StoryRepository';

const STORY_LIMIT = 3;

export function createCareerPathUseCases({
  companyRepository,
  internshipRepository,
  storyRepository,
  now = () => new Date(),
}) {
  const companies = asCompanyRepository(companyRepository);
  const internships = asInternshipRepository(internshipRepository);
  const stories = asStoryRepository(storyRepository);

  const loadAll = () => Promise.all([companies.findAll(), internships.findAll(), stories.findAll()]);
  const isActive = (internship) => acceptsApplications(internship, now());

  return Object.freeze({
    listFields: async () => {
      const [allCompanies, allInternships] = await loadAll();
      return CAREER_FIELDS.map((field) => ({
        field,
        activePositions: positionsInField(field, allCompanies, allInternships).filter(isActive).length,
      }));
    },

    getField: async (fieldId) => {
      const field = findCareerField(fieldId);
      if (!field) return null;

      const [allCompanies, allInternships, allStories] = await loadAll();
      const positions = positionsInField(field, allCompanies, allInternships);

      return {
        field,
        companies: companiesInField(field, allCompanies).map((company) => ({
          ...company,
          activePositions: positions.filter((position) => position.companyId === company.id && isActive(position)).length,
        })),
        stories: sortByNewest(storiesInField(field, allStories)).slice(0, STORY_LIMIT),
        skillDemand: countSkills(positions),
      };
    },
  });
}
