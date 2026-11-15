import { DomainError } from '../shared/DomainError.js';

export const ADMIN_ROLE = 'admin';
export const MIN_PASSWORD_LENGTH = 8;

export const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

export function createAdmin({ id, email, name }) {
  if (!id || !email || !name) {
    throw new DomainError('Një administrator duhet të ketë id, email dhe emër.');
  }
  return Object.freeze({ id, email: normalizeEmail(email), name, role: ADMIN_ROLE });
}
