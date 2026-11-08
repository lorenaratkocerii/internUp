import { assertPort } from './assertPort';

export const asStudentVerificationRepository = (adapter) =>
  assertPort(adapter, 'StudentVerificationRepository', ['findAll', 'findById', 'findByUniversity', 'findByStudent', 'save']);
