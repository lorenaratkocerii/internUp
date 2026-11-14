import { assertPort } from './assertPort.js';

export const asInternshipRepository = (adapter) =>
  assertPort(adapter, 'InternshipRepository', ['findAll', 'findFeatured', 'count']);
