import { sendSuccess } from '../apiResponse.js';
import { parseLimitQuery, parseSearchQuery } from '../validation/homeQueries.js';

export function createHomeController(homeUseCases) {
  return {
    getOverview: async (_req, res) => {
      sendSuccess(res, await homeUseCases.getHomeOverview());
    },

    getStats: async (_req, res) => {
      sendSuccess(res, await homeUseCases.getPlatformStats());
    },

    getPartnerCompanies: async (req, res) => {
      const companies = await homeUseCases.getPartnerCompanies(parseLimitQuery(req.query));
      sendSuccess(res, companies, { meta: { count: companies.length } });
    },

    getSearchOptions: async (_req, res) => {
      sendSuccess(res, await homeUseCases.getSearchOptions());
    },

    searchInternships: async (req, res) => {
      const { criteria, internships } = await homeUseCases.searchInternships(parseSearchQuery(req.query));
      sendSuccess(res, internships, { meta: { count: internships.length, criteria } });
    },

    getUniversities: async (req, res) => {
      const { universities, total } = await homeUseCases.getUniversities(parseLimitQuery(req.query));
      sendSuccess(res, universities, { meta: { count: universities.length, total } });
    },

    getStories: async (req, res) => {
      const stories = await homeUseCases.getLatestStories(parseLimitQuery(req.query));
      sendSuccess(res, stories, { meta: { count: stories.length } });
    },
  };
}
