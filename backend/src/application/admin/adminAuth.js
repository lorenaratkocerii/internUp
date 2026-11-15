import { ADMIN_ROLE, normalizeEmail } from '../../domain/admin/Admin.js';
import { UnauthorizedError, ValidationError } from '../errors.js';

const INVALID_CREDENTIALS = 'Emaili ose fjalëkalimi nuk është i saktë.';

export function createAdminAuth({ admins, hasher, tokens, now }) {
  let decoyHash = null;
  const burnTime = async (password) => {
    decoyHash ??= await hasher.hash('internup-decoy-password');
    await hasher.verify(password, decoyHash);
  };

  return {
    login: async ({ email, password } = {}) => {
      const normalized = normalizeEmail(email);
      const details = {};
      if (!normalized) details.email = 'Shkruaj adresën e emailit.';
      if (typeof password !== 'string' || !password) details.password = 'Shkruaj fjalëkalimin.';
      if (Object.keys(details).length > 0) throw new ValidationError('Kontrollo fushat e shënuara.', details);

      const credentials = await admins.findCredentialsByEmail(normalized);
      if (!credentials) {
        await burnTime(password);
        throw new UnauthorizedError(INVALID_CREDENTIALS, 'INVALID_CREDENTIALS');
      }
      if (!(await hasher.verify(password, credentials.passwordHash))) {
        throw new UnauthorizedError(INVALID_CREDENTIALS, 'INVALID_CREDENTIALS');
      }

      await admins.recordLogin(credentials.admin.id, now());
      const { token, expiresAt } = tokens.issue({ subject: credentials.admin.id, role: ADMIN_ROLE });
      return { token, expiresAt, admin: credentials.admin };
    },

    authenticate: async (token) => {
      const payload = token ? tokens.verify(token) : null;
      if (!payload || payload.role !== ADMIN_ROLE) {
        throw new UnauthorizedError('Sesioni ka skaduar. Kyçu përsëri.', 'INVALID_TOKEN');
      }
      const admin = await admins.findById(Number(payload.subject));
      if (!admin) throw new UnauthorizedError('Kjo llogari administratori nuk ekziston më.', 'INVALID_TOKEN');
      return admin;
    },
  };
}
