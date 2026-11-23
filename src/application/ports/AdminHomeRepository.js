import { assertPort } from './assertPort';

export const asAdminHomeRepository = (adapter) =>
  assertPort(adapter, 'AdminHomeRepository', ['getTableRows', 'createRow', 'updateRow', 'deleteRow']);
