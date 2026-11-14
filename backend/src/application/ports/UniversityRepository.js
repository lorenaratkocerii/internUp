import { assertPort } from './assertPort.js';

export const asUniversityRepository = (adapter) =>
  assertPort(adapter, 'UniversityRepository', ['findAll', 'count']);
