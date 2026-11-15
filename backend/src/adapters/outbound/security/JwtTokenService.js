import jwt from 'jsonwebtoken';

const ALGORITHM = 'HS256';

export function createJwtTokenService({ secret, expiresIn }) {
  return {
    issue: ({ subject, role }) => {
      const token = jwt.sign({ role }, secret, { subject: String(subject), expiresIn, algorithm: ALGORITHM });
      return { token, expiresAt: new Date(jwt.decode(token).exp * 1000).toISOString() };
    },

    verify: (token) => {
      try {
        const payload = jwt.verify(token, secret, { algorithms: [ALGORITHM] });
        return { subject: payload.sub, role: payload.role };
      } catch {
        return null;
      }
    },
  };
}
