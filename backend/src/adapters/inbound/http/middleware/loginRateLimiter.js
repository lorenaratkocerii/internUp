import { TooManyRequestsError } from '../../../../application/errors.js';

export function createLoginRateLimiter({ maxAttempts = 10, windowMs = 15 * 60 * 1000, now = Date.now } = {}) {
  const attempts = new Map();

  return function loginRateLimiter(req, _res, next) {
    const time = now();
    for (const [key, entry] of attempts) {
      if (entry.resetAt <= time) attempts.delete(key);
    }

    const key = req.ip ?? 'unknown';
    const entry = attempts.get(key) ?? { count: 0, resetAt: time + windowMs };
    entry.count += 1;
    attempts.set(key, entry);

    if (entry.count > maxAttempts) throw new TooManyRequestsError();
    next();
  };
}
