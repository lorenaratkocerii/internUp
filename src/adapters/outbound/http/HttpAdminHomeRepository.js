import { getJson, sendJson } from './httpClient';

const tablePath = (tableId, rowId) =>
  rowId === undefined ? `/api/admin/home/${tableId}` : `/api/admin/home/${tableId}/${encodeURIComponent(rowId)}`;

export function createHttpAdminHomeRepository() {
  return {
    getTableRows: async (tableId) => (await getJson(tablePath(tableId))).map((row) => Object.freeze(row)),
    createRow: (tableId, values) => sendJson('POST', tablePath(tableId), values),
    updateRow: (tableId, rowId, values) => sendJson('PUT', tablePath(tableId, rowId), values),
    deleteRow: (tableId, rowId) => sendJson('DELETE', tablePath(tableId, rowId)),
  };
}
