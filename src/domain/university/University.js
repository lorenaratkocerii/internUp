export const UniversityType = Object.freeze({
  PUBLIC: 'publik',
  PRIVATE: 'privat',
});

export const UNIVERSITY_TYPE_LABELS = Object.freeze({
  [UniversityType.PUBLIC]: 'Publik',
  [UniversityType.PRIVATE]: 'Privat',
});

export class UniversityError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UniversityError';
  }
}

export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[“”"'.()]/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const normalizeDomain = (value) => String(value ?? '').trim().toLowerCase().replace(/^@/, '');

export function createUniversity({
  id,
  name,
  shortName = '',
  type,
  city,
  logo = '',
  photo = '',
  website = '',
  emailDomains = [],
  description = '',
  aliases = [],
  representative = null,
}) {
  if (!id || !name || !city) throw new UniversityError('Një universitet duhet të ketë id, emër dhe qytet.');
  if (!Object.values(UniversityType).includes(type)) throw new UniversityError(`Lloj i panjohur universiteti: ${type}`);

  return Object.freeze({
    id,
    name,
    shortName: shortName || name,
    type,
    city,
    logo,
    photo,
    website,
    emailDomains: Object.freeze(emailDomains.map(normalizeDomain).filter(Boolean)),
    description,
    aliases: Object.freeze([...aliases]),
    representative: representative
      ? Object.freeze({
          name: representative.name ?? '',
          title: representative.title ?? '',
          email: representative.email ?? '',
        })
      : null,
  });
}

export function isSameUniversity(university, label) {
  const needle = normalizeText(label);
  if (!needle) return false;
  return [university.name, university.shortName, ...university.aliases].some((candidate) => normalizeText(candidate) === needle);
}

export function emailMatchesUniversity(university, email) {
  const domain = String(email ?? '').trim().toLowerCase().split('@')[1];
  if (!domain || university.emailDomains.length === 0) return false;
  return university.emailDomains.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`));
}

export const RepresentativeEmailCheck = Object.freeze({
  MATCH: 'match',
  MISMATCH: 'mismatch',
  UNKNOWN: 'unknown',
});

const isStudentDomain = (domain) => domain.startsWith('student.');

export const staffDomains = (university) =>
  university.emailDomains.some(isStudentDomain) ? university.emailDomains.filter((domain) => !isStudentDomain(domain)) : [];

export function checkRepresentativeEmail(university, email) {
  const domains = staffDomains(university);
  if (domains.length === 0) return RepresentativeEmailCheck.UNKNOWN;
  const domain = String(email ?? '').trim().toLowerCase().split('@')[1] ?? '';
  return domains.includes(domain) ? RepresentativeEmailCheck.MATCH : RepresentativeEmailCheck.MISMATCH;
}

export function validateUniversityProfile(draft) {
  const errors = {};
  const text = (field) => String(draft[field] ?? '').trim();

  if (text('description').length < 40) errors.description = 'Përshkrimi duhet të ketë të paktën 40 karaktere.';
  if (text('website') && !/^https?:\/\/[^\s.]+(?:\.[^\s.]+)+/i.test(text('website'))) {
    errors.website = 'Website duhet të fillojë me https:// ose http://.';
  }
  if (!text('representativeName')) errors.representativeName = 'Shkruaj emrin e përfaqësuesit.';
  if (!text('representativeTitle')) errors.representativeTitle = 'Shkruaj rolin e përfaqësuesit.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('representativeEmail'))) {
    errors.representativeEmail = 'Shkruaj një adresë emaili të vlefshme.';
  }
  const domains = text('emailDomains').split(/[\s,]+/).filter(Boolean);
  if (domains.some((domain) => !/^@?[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(domain))) {
    errors.emailDomains = 'Shkruaj domenet si p.sh. uni-pr.edu, të ndara me presje.';
  }
  return errors;
}
