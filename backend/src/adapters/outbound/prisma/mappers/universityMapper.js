import { createVerificationRequest } from '../../../../domain/university/studentVerification.js';
import { createUniversity } from '../../../../domain/university/University.js';
import { universityTypeFromDb, verificationStatusFromDb } from './enumMaps.js';

export const universityInclude = Object.freeze({ city: { select: { name: true } } });

export function toUniversity(record) {
  return createUniversity({
    id: record.slug,
    name: record.name,
    shortName: record.shortName,
    type: universityTypeFromDb[record.type],
    city: record.city.name,
    logo: record.logo ?? '',
    website: record.website ?? '',
  });
}

export const verificationSelect = Object.freeze({
  reference: true,
  studentEmail: true,
  status: true,
  submittedAt: true,
  university: { select: { slug: true } },
});

export function toVerificationRequest(record) {
  return createVerificationRequest({
    id: record.reference,
    universityId: record.university.slug,
    studentEmail: record.studentEmail,
    status: verificationStatusFromDb[record.status],
    submittedAt: record.submittedAt.toISOString(),
  });
}
