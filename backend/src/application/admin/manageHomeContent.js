import { ContentLimits, markHomeVisibility } from '../../domain/admin/homeContent.js';
import { PARTNERS_ON_HOME } from '../../domain/company/Company.js';
import { STORIES_ON_HOME } from '../../domain/story/Story.js';
import { NotFoundError, ValidationError } from '../errors.js';

const INVALID = 'Kontrollo fushat e shënuara.';

function readText(changes, field, label, { min, max }, details) {
  if (changes[field] === undefined) return undefined;
  const value = typeof changes[field] === 'string' ? changes[field].trim() : '';
  if (value.length < min || value.length > max) {
    details[field] = `${label} duhet të ketë ${min}–${max} karaktere.`;
  }
  return value;
}

function readFlag(changes, field, details) {
  if (changes[field] === undefined) return undefined;
  if (typeof changes[field] !== 'boolean') details[field] = `"${field}" duhet të jetë true ose false.`;
  return changes[field];
}

function finish(patch, details) {
  if (Object.keys(details).length > 0) throw new ValidationError(INVALID, details);
  const defined = Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined));
  if (Object.keys(defined).length === 0) throw new ValidationError('Nuk ka asnjë ndryshim për të ruajtur.');
  return defined;
}

function assertFound(updated, message) {
  if (!updated) throw new NotFoundError(message);
}

export function createManageHomeContent({ content, getPlatformStats }) {
  const listCompanies = async () =>
    markHomeVisibility(await content.listCompanies(), (company) => company.isPartner, PARTNERS_ON_HOME);
  const listInternships = async () =>
    (await content.listInternships()).map((internship) => ({ ...internship, onHome: internship.featured }));
  const listStories = async () => markHomeVisibility(await content.listStories(), () => true, STORIES_ON_HOME);

  return {
    getHomeContent: async () => {
      const [stats, companies, internships, stories] = await Promise.all([
        getPlatformStats(),
        listCompanies(),
        listInternships(),
        listStories(),
      ]);
      return {
        stats,
        companies,
        internships,
        stories,
        limits: { partnersOnHome: PARTNERS_ON_HOME, storiesOnHome: STORIES_ON_HOME },
      };
    },

    updateCompany: async (companyId, changes = {}) => {
      const details = {};
      const patch = finish(
        {
          name: readText(changes, 'name', 'Emri', ContentLimits.COMPANY_NAME, details),
          industry: readText(changes, 'industry', 'Industria', ContentLimits.COMPANY_INDUSTRY, details),
        },
        details,
      );
      assertFound(await content.updateCompany(companyId, patch), 'Kjo kompani nuk ekziston.');
      return listCompanies();
    },

    setPartnerCompanies: async (companyIds) => {
      const valid =
        Array.isArray(companyIds) &&
        companyIds.every((id) => typeof id === 'string' && id) &&
        new Set(companyIds).size === companyIds.length;
      if (!valid) {
        throw new ValidationError(INVALID, { companyIds: 'Dërgo listën e kompanive partnere pa përsëritje.' });
      }
      assertFound(await content.setPartnerOrder(companyIds), 'Njëra nga kompanitë nuk ekziston.');
      return listCompanies();
    },

    updateInternship: async (internshipId, changes = {}) => {
      const details = {};
      const patch = finish(
        {
          title: readText(changes, 'title', 'Titulli', ContentLimits.INTERNSHIP_TITLE, details),
          featured: readFlag(changes, 'featured', details),
        },
        details,
      );
      assertFound(await content.updateInternship(internshipId, patch), 'Kjo praktikë nuk ekziston.');
      return listInternships();
    },

    updateStory: async (storyId, changes = {}) => {
      const details = {};
      const patch = finish(
        {
          title: readText(changes, 'title', 'Titulli', ContentLimits.STORY_TITLE, details),
          excerpt: readText(changes, 'excerpt', 'Përmbledhja', ContentLimits.STORY_EXCERPT, details),
          featured: readFlag(changes, 'featured', details),
        },
        details,
      );
      assertFound(await content.updateStory(storyId, patch), 'Kjo histori nuk ekziston.');
      return listStories();
    },
  };
}
