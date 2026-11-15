import { assertPort } from './assertPort';

export const asAdminSessionStore = (adapter) => assertPort(adapter, 'AdminSessionStore', ['read', 'save', 'clear']);
