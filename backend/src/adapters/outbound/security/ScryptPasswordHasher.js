import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const PREFIX = 'scrypt';

export function createScryptPasswordHasher() {
  return {
    hash: async (password) => {
      const salt = randomBytes(16);
      const key = await scryptAsync(password, salt, KEY_LENGTH);
      return `${PREFIX}$${salt.toString('hex')}$${key.toString('hex')}`;
    },

    verify: async (password, stored) => {
      const [prefix, saltHex, keyHex] = String(stored ?? '').split('$');
      if (prefix !== PREFIX || !saltHex || !keyHex) return false;
      const expected = Buffer.from(keyHex, 'hex');
      const actual = await scryptAsync(String(password), Buffer.from(saltHex, 'hex'), expected.length);
      return timingSafeEqual(actual, expected);
    },
  };
}
