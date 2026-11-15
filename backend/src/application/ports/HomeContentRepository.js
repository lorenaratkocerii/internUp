import { assertPort } from './assertPort.js';

export const asHomeContentRepository = (adapter) =>
  assertPort(adapter, 'HomeContentRepository', [
    'listCompanies',
    'listInternships',
    'listStories',
    'updateCompany',
    'setPartnerOrder',
    'updateInternship',
    'updateStory',
  ]);
