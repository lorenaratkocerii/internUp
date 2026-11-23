import { asAdminHomeRepository } from './ports/AdminHomeRepository';

export function createAdminHomeUseCases({ adminHomeRepository }) {
  const adminHome = asAdminHomeRepository(adminHomeRepository);

  return Object.freeze({
    getTableRows: (tableId) => adminHome.getTableRows(tableId),
    createRow: (tableId, values) => adminHome.createRow(tableId, values),
    updateRow: (tableId, rowId, values) => adminHome.updateRow(tableId, rowId, values),
    deleteRow: (tableId, rowId) => adminHome.deleteRow(tableId, rowId),
  });
}
