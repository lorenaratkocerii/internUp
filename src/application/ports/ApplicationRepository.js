import { assertPort } from './assertPort';

export const asApplicationRepository = (adapter) =>
  assertPort(adapter, 'ApplicationRepository', ['save', 'exists']);
