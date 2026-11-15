import { assertCan, Permission, Role } from '../domain/auth/accessControl';
import { asAdminGateway } from './ports/AdminGateway';
import { asAdminSessionStore } from './ports/AdminSessionStore';

export class AdminSessionExpiredError extends Error {
  constructor() {
    super('Sesioni ka skaduar. Kyçu përsëri si admin.');
    this.name = 'AdminSessionExpiredError';
  }
}

export function createAdminUseCases({ adminGateway, adminSessionStore }) {
  const gateway = asAdminGateway(adminGateway);
  const sessions = asAdminSessionStore(adminSessionStore);

  const asAdmin = async (actor, request) => {
    assertCan(actor, Permission.MANAGE_HOME_CONTENT);
    if (!sessions.read()) throw new AdminSessionExpiredError();
    try {
      return await request();
    } catch (error) {
      if (error?.status !== 401) throw error;
      sessions.clear();
      throw new AdminSessionExpiredError();
    }
  };

  return Object.freeze({
    login: async ({ email, password }) => {
      const session = await gateway.login({ email, password });
      sessions.save(session);
      return { role: Role.ADMIN, title: 'Admin', email: session.admin.email, name: session.admin.name };
    },

    logout: () => sessions.clear(),

    getHomeContent: (actor) => asAdmin(actor, () => gateway.getHomeContent()),
    setPartnerCompanies: (actor, companyIds) => asAdmin(actor, () => gateway.setPartnerCompanies(companyIds)),
    updateCompany: (actor, companyId, changes) => asAdmin(actor, () => gateway.updateCompany(companyId, changes)),
    updateInternship: (actor, internshipId, changes) =>
      asAdmin(actor, () => gateway.updateInternship(internshipId, changes)),
    updateStory: (actor, storyId, changes) => asAdmin(actor, () => gateway.updateStory(storyId, changes)),
  });
}
