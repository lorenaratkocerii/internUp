import { assertPort } from './assertPort';

export const asHomeRepository = (adapter) =>
  assertPort(adapter, 'HomeRepository', ['getPlatformStats', 'findPartnerCompanies', 'getSearchOptions', 'searchInternships']);
