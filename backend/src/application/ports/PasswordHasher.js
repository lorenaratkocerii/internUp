import { assertPort } from './assertPort.js';

export const asPasswordHasher = (adapter) => assertPort(adapter, 'PasswordHasher', ['hash', 'verify']);
