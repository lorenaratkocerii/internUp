import { assertPort } from './assertPort.js';

export const asTokenService = (adapter) => assertPort(adapter, 'TokenService', ['issue', 'verify']);
