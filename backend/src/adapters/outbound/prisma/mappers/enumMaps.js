import { WorkMode } from '../../../../domain/internship/Internship.js';
import { VerificationStatus } from '../../../../domain/university/studentVerification.js';
import { UniversityType } from '../../../../domain/university/University.js';

export const workModeFromDb = Object.freeze({
  REMOTE: WorkMode.REMOTE,
  HYBRID: WorkMode.HYBRID,
  ON_SITE: WorkMode.ON_SITE,
});

export const universityTypeFromDb = Object.freeze({
  PUBLIC: UniversityType.PUBLIC,
  PRIVATE: UniversityType.PRIVATE,
});

export const verificationStatusFromDb = Object.freeze({
  PENDING: VerificationStatus.PENDING,
  VERIFIED: VerificationStatus.VERIFIED,
  REJECTED: VerificationStatus.REJECTED,
});

const invert = (map) => Object.freeze(Object.fromEntries(Object.entries(map).map(([db, domain]) => [domain, db])));

export const workModeToDb = invert(workModeFromDb);
export const universityTypeToDb = invert(universityTypeFromDb);
export const verificationStatusToDb = invert(verificationStatusFromDb);
