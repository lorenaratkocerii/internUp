import {
  ApplicationError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
  ValidationError,
} from '../../../../application/errors.js';
import { sendError } from '../apiResponse.js';

const DATABASE_DOWN = new Set(['PrismaClientInitializationError', 'PrismaClientRustPanicError']);
const DATABASE_DOWN_CODES = new Set(['P1000', 'P1001', 'P1002', 'P1003', 'P1017', 'P2021', 'P2024']);

function describe(error) {
  if (error instanceof ValidationError) {
    return { status: 400, code: error.code, message: error.message, details: error.details };
  }
  if (error instanceof NotFoundError) {
    return { status: 404, code: error.code, message: error.message };
  }
  if (error instanceof UnauthorizedError) {
    return { status: 401, code: error.code, message: error.message };
  }
  if (error instanceof TooManyRequestsError) {
    return { status: 429, code: error.code, message: error.message };
  }
  if (error instanceof ApplicationError) {
    return { status: 422, code: error.code, message: error.message, details: error.details };
  }
  if (error?.type === 'entity.parse.failed') {
    return { status: 400, code: 'INVALID_JSON', message: 'Trupi i kërkesës nuk është JSON i vlefshëm.' };
  }
  if (DATABASE_DOWN.has(error?.name) || DATABASE_DOWN_CODES.has(error?.code)) {
    return {
      status: 503,
      code: 'DATABASE_UNAVAILABLE',
      message: 'Databaza nuk është e qasshme për momentin. Provo përsëri më vonë.',
    };
  }
  return { status: 500, code: 'INTERNAL_ERROR', message: 'Ndodhi një gabim i papritur në server.' };
}

export function createErrorHandler({ logger = console } = {}) {
  return function errorHandler(error, req, res, _next) {
    const response = describe(error);
    if (response.status >= 500) {
      logger.error(`[${req.method} ${req.originalUrl}]`, error);
    }
    if (res.headersSent) return;
    sendError(res, response);
  };
}
