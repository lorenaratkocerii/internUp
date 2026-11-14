import { DomainError } from '../shared/DomainError.js';

export const VerificationStatus = Object.freeze({
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
});

export function createVerificationRequest({ id, universityId, studentEmail, status, submittedAt }) {
  if (!id || !universityId || !studentEmail) {
    throw new DomainError('Kërkesa duhet të ketë id, universitet dhe student.');
  }
  if (!Object.values(VerificationStatus).includes(status)) {
    throw new DomainError(`Status i panjohur: ${status}`);
  }
  return Object.freeze({ id, universityId, studentEmail: studentEmail.toLowerCase(), status, submittedAt });
}

export function latestPerStudent(requests) {
  const latest = new Map();
  for (const request of requests) {
    const current = latest.get(request.studentEmail);
    if (!current || Date.parse(request.submittedAt) > Date.parse(current.submittedAt)) {
      latest.set(request.studentEmail, request);
    }
  }
  return [...latest.values()];
}

export function countVerifiedByUniversity(requests) {
  const counts = new Map();
  for (const request of latestPerStudent(requests)) {
    if (request.status !== VerificationStatus.VERIFIED) continue;
    counts.set(request.universityId, (counts.get(request.universityId) ?? 0) + 1);
  }
  return counts;
}

export function rankByVerifiedStudents(universities, requests) {
  const counts = countVerifiedByUniversity(requests);
  return universities
    .map((university) => Object.freeze({ ...university, verifiedStudents: counts.get(university.id) ?? 0 }))
    .sort((a, b) => b.verifiedStudents - a.verifiedStudents);
}
