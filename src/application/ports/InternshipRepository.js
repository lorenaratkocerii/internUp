import { assertPort } from './assertPort';

export const asInternshipRepository = (adapter) =>
  assertPort(adapter, 'InternshipRepository', [
    'findFeatured',
    'search',
    'findAll',
    'findById',
    'findByCompany',
  ]);
