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
  REQUEST_UNIVERSITY_VERIFICATION: 'university-verification:request',
  MANAGE_UNIVERSITY_PROFILE: 'university:manage-profile',
  VERIFY_STUDENTS: 'students:verify',
  VIEW_UNIVERSITY_STUDENTS: 'students:view-university',
});

const ROLE_PERMISSIONS = Object.freeze({
  [Role.STUDENT]: [
    Permission.APPLY_TO_INTERNSHIPS,
    Permission.VIEW_OWN_APPLICATIONS,
    Permission.PUBLISH_STORIES,
    Permission.REQUEST_UNIVERSITY_VERIFICATION,
  ],
  [Role.COMPANY]: [
    Permission.MANAGE_COMPANY_PROFILE,
    Permission.MANAGE_INTERNSHIPS,
    Permission.REVIEW_APPLICATIONS,
    Permission.VERIFY_INTERNS,
  ],
  [Role.UNIVERSITY]: [
    Permission.MANAGE_UNIVERSITY_PROFILE,
    Permission.VERIFY_STUDENTS,
    Permission.VIEW_UNIVERSITY_STUDENTS,
  ],
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
export const universityIdForAccount = (email) => `universitet-${slugify(email)}`;

export function createActor(user) {
  if (!user?.role || !user?.email) return null;
  const email = String(user.email).trim().toLowerCase();
  return Object.freeze({
    role: user.role,
    email,
    name: user.name ?? '',
    profile: user.profile ?? {},
    companyId: user.role === Role.COMPANY ? user.profile?.companyId || companyIdForAccount(email) : null,
    universityId:
      user.role === Role.UNIVERSITY ? user.profile?.universityId || universityIdForAccount(email) : null,
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

export const isPendingRepresentative = (actor) => actor?.role === Role.UNIVERSITY && actor.profile?.approved === false;

export function assertApprovedRepresentative(actor) {
  if (isPendingRepresentative(actor)) {
    throw new AccessDeniedError('Llogaria jote pret konfirmimin nga InternUp. Pas konfirmimit mund të verifikosh studentë.');
  }
}

export function assertOwnsUniversity(actor, universityId) {
  if (!actor?.universityId || actor.universityId !== universityId) {
    throw new AccessDeniedError('Ky student i përket një universiteti tjetër.');
  }
}
