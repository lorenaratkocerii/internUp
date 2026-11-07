export const COMPANY_SIZES = Object.freeze([
  '1–10 punonjës',
  '11–50 punonjës',
  '51–200 punonjës',
  '201–500 punonjës',
  '500+ punonjës',
]);

export function normalizeCompanySize(value) {
  const compact = String(value ?? '').replace(/\s*punonjës\s*/i, '').replace(/[-–]/g, '–').trim();
  return COMPANY_SIZES.find((size) => size.startsWith(`${compact} `)) ?? String(value ?? '');
}
export const COMPANY_INDUSTRIES = Object.freeze([
  'Software',
  'Dizajn',
  'Marketing',
  'Të dhëna',
  'Sisteme',
  'Cloud',
  'Fintech',
  'Energji',
  'Elektronikë',
  'Edukim',
  'Inteligjencë artificiale',
  'Siguri kibernetike',
  'E-commerce',
  'Konsulencë',
  'Logjistikë',
  'Tjetër',
]);

const FIRST_YEAR = 1900;

export function companyProfileDraft(company) {
  return {
    name: company.name ?? '',
    shortDescription: company.shortDescription ?? '',
    description: company.description ?? '',
    location: company.location ?? '',
    website: company.website ?? '',
    industry: company.industry ?? '',
    foundedYear: company.foundedYear ? String(company.foundedYear) : '',
    size: normalizeCompanySize(company.size),
    logo: company.logo ?? '',
  };
}

export function validateCompanyProfile(draft, now = new Date()) {
  const errors = {};
  const text = (name) => String(draft[name] ?? '').trim();
  const required = [
    ['name', 'Emri i kompanisë'],
    ['shortDescription', 'Përshkrimi i shkurtër'],
    ['description', 'Përshkrimi'],
    ['location', 'Lokacioni'],
    ['industry', 'Industria'],
    ['foundedYear', 'Viti i themelimit'],
    ['size', 'Madhësia'],
  ];
  for (const [name, label] of required) {
    if (!text(name)) errors[name] = `Plotëso fushën "${label}".`;
  }
  if (!errors.name && text('name').length < 2) errors.name = 'Emri duhet të ketë të paktën 2 karaktere.';
  if (!errors.shortDescription && text('shortDescription').length > 160) {
    errors.shortDescription = 'Përshkrimi i shkurtër duhet të ketë deri në 160 karaktere.';
  }
  if (!errors.description && text('description').length < 30) errors.description = 'Shkruaj të paktën 30 karaktere.';
  if (text('website') && !/^https?:\/\/[^\s.]+(\.[^\s.]+)+/i.test(text('website'))) {
    errors.website = 'Website duhet të fillojë me https:// ose http://.';
  }
  const year = Number(text('foundedYear'));
  if (!errors.foundedYear && (!Number.isInteger(year) || year < FIRST_YEAR || year > now.getFullYear())) {
    errors.foundedYear = `Shkruaj një vit nga ${FIRST_YEAR} deri në ${now.getFullYear()}.`;
  }
  if (!errors.size && !COMPANY_SIZES.includes(text('size'))) errors.size = 'Zgjidh madhësinë nga lista.';
  return errors;
}
