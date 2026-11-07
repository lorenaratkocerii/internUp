import { assertPort } from './assertPort';

export const asCandidateApplicationRepository = (adapter) =>
  assertPort(adapter, 'CandidateApplicationRepository', ['findById', 'findByCompany', 'findByStudent', 'save']);
