import { assertPort } from './assertPort.js';

export const asAdminRepository = (adapter) =>
  assertPort(adapter, 'AdminRepository', ['findCredentialsByEmail', 'findById', 'recordLogin']);
