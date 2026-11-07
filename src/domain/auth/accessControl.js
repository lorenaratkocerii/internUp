export const Role = Object.freeze({
  STUDENT: 'student',
  COMPANY: 'kompani',
  UNIVERSITY: 'universitet',
});

export const Permission = Object.freeze({
  APPLY_TO_INTERNSHIPS: 'internships:apply',
  VIEW_OWN_APPLICATIONS: 'applications:view-own',
  PUBLISH_STORIES: 'stories:publish',
  MANAGE_COMPANY_PROFILE: 'company:manage-profile',
  MANAGE_INTERNSHIPS: 'internships:manage',
  REVIEW_APPLICATIONS: 'applications:review',
  VERIFY_INTERNS: 'interns:verify',
});

const ROLE_PERMISSIONS = Object.freeze({
  [Role.STUDENT]: [Permission.APPLY_TO_INTERNSHIPS, Permission.VIEW_OWN_APPLICATIONS, Permission.PUBLISH_STORIES],
  [Role.COMPANY]: [
    Permission.MANAGE_COMPANY_PROFILE,
    Permission.MANAGE_INTERNSHIPS,
    Permission.REVIEW_APPLICATIONS,
    Permission.VERIFY_INTERNS,
  ],
  [Role.UNIVERSITY]: [],
});

export class AccessDeniedError extends Error {
  constructor(message = 'Nuk ke leje për këtë veprim.') {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const companyIdForAccount = (email) => `kompani-${slugify(email)}`;

export function createActor(user) {
  if (!user?.role || !user?.email) return null;
  const email = String(user.email).trim().toLowerCase();
  return Object.freeze({
    role: user.role,
    email,
    name: user.name ?? '',
    profile: user.profile ?? {},
    companyId: user.role === Role.COMPANY ? user.profile?.companyId || companyIdForAccount(email) : null,
  });
}

export const hasRole = (actor, role) => actor?.role === role;

export function can(actor, permission) {
  return Boolean(actor && ROLE_PERMISSIONS[actor.role]?.includes(permission));
}

export function assertCan(actor, permission) {
  if (!actor) throw new AccessDeniedError('Duhet të kyçesh për të vazhduar.');
  if (!can(actor, permission)) throw new AccessDeniedError();
  return actor;
}

export function assertOwnsCompany(actor, companyId) {
  if (!actor?.companyId || actor.companyId !== companyId) {
    throw new AccessDeniedError('Ky burim i përket një kompanie tjetër.');
  }
}
