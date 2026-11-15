import { assertPort } from './assertPort';

export const asAdminGateway = (adapter) =>
  assertPort(adapter, 'AdminGateway', [
    'login',
    'getHomeContent',
    'setPartnerCompanies',
    'updateCompany',
    'updateInternship',
    'updateStory',
  ]);
