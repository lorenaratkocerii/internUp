import { assertPort } from './assertPort';

export const asCompanyRepository = (adapter) =>
  assertPort(adapter, 'CompanyRepository', ['findPartners', 'findAll', 'findById', 'save']);
