const BEARER = /^Bearer\s+(\S+)$/i;

export function createRequireAdmin(adminUseCases) {
  return async function requireAdmin(req, _res, next) {
    const token = BEARER.exec(req.get('authorization') ?? '')?.[1] ?? null;
    req.admin = await adminUseCases.authenticate(token);
    next();
  };
}
