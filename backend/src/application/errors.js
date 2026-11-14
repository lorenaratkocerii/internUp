export class ApplicationError extends Error {
  constructor(message, { code = 'APPLICATION_ERROR', details = null } = {}) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends ApplicationError {
  constructor(message, details = null) {
    super(message, { code: 'VALIDATION_ERROR', details });
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message) {
    super(message, { code: 'NOT_FOUND' });
    this.name = 'NotFoundError';
  }
}
