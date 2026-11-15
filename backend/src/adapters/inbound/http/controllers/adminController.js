import { sendSuccess } from '../apiResponse.js';

const body = (req) => (req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {});

export function createAdminController(adminUseCases) {
  return {
    login: async (req, res) => {
      const { email, password } = body(req);
      sendSuccess(res, await adminUseCases.login({ email, password }));
    },

    getMe: async (req, res) => {
      sendSuccess(res, req.admin);
    },

    getHomeContent: async (_req, res) => {
      sendSuccess(res, await adminUseCases.getHomeContent());
    },

    updateCompany: async (req, res) => {
      sendSuccess(res, await adminUseCases.updateCompany(req.params.companyId, body(req)));
    },

    setPartnerCompanies: async (req, res) => {
      sendSuccess(res, await adminUseCases.setPartnerCompanies(body(req).companyIds));
    },

    updateInternship: async (req, res) => {
      sendSuccess(res, await adminUseCases.updateInternship(req.params.internshipId, body(req)));
    },

    updateStory: async (req, res) => {
      sendSuccess(res, await adminUseCases.updateStory(req.params.storyId, body(req)));
    },
  };
}
