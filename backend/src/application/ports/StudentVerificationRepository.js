import { assertPort } from './assertPort.js';

export const asStudentVerificationRepository = (adapter) =>
  assertPort(adapter, 'StudentVerificationRepository', ['findAll']);
