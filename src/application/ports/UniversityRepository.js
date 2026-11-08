import { assertPort } from './assertPort';

export const asUniversityRepository = (adapter) =>
  assertPort(adapter, 'UniversityRepository', ['findAll', 'findById', 'save']);
