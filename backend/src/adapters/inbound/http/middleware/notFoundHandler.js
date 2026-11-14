import { NotFoundError } from '../../../../application/errors.js';

export function notFoundHandler(req, _res, next) {
  next(new NotFoundError(`Rruga ${req.method} ${req.originalUrl} nuk ekziston.`));
}
