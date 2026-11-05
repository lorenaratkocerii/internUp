export const ApplicationErrorCode = Object.freeze({
  INVALID: 'invalid',
  CLOSED: 'closed',
  DUPLICATE: 'duplicate',
  NOT_FOUND: 'not-found',
});

export class ApplicationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateApplication({ name = '', email = '' }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Shkruaj emrin dhe mbiemrin.';
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Shkruaj një adresë email të vlefshme.';
  return errors;
}

export function createApplication({ internshipId, name = '', email = '', message = '' }) {
  if (Object.keys(validateApplication({ name, email })).length > 0) {
    throw new ApplicationError(ApplicationErrorCode.INVALID, 'Plotëso saktë emrin dhe email-in.');
  }
  return Object.freeze({
    internshipId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  });
}
