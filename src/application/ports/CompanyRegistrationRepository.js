import { assertPort } from './assertPort';

export const asCompanyRegistrationRepository = (adapter) =>
  assertPort(adapter, 'CompanyRegistrationRepository', ['save', 'exists']);
