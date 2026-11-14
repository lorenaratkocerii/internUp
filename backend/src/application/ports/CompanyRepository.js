import { assertPort } from './assertPort.js';

export const asCompanyRepository = (adapter) =>
  assertPort(adapter, 'CompanyRepository', ['findPartners', 'count']);
