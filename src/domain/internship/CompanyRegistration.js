const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class CompanyRegistrationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CompanyRegistrationError';
  }
}

export function validateCompanyRegistration({ companyName = '', email = '' }) {
  const errors = {};
  if (companyName.trim().length < 2) errors.companyName = 'Shkruani emrin e kompanisë.';
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Shkruani një adresë email të vlefshme.';
  return errors;
}

export function createCompanyRegistration({ companyName = '', email = '' }) {
  if (Object.keys(validateCompanyRegistration({ companyName, email })).length > 0) {
    throw new CompanyRegistrationError('Plotësoni saktë emrin e kompanisë dhe email-in.');
  }
  return Object.freeze({
    companyName: companyName.trim(),
    email: email.trim().toLowerCase(),
  });
}
