export const CandidateStatus = Object.freeze({
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
});

export const CANDIDATE_STATUSES = Object.freeze(Object.values(CandidateStatus));

export const CANDIDATE_STATUS_LABELS = Object.freeze({
  [CandidateStatus.PENDING]: 'Në pritje',
  [CandidateStatus.UNDER_REVIEW]: 'Në shqyrtim',
  [CandidateStatus.SHORTLISTED]: 'Në listën e ngushtë',
  [CandidateStatus.ACCEPTED]: 'Pranuar',
  [CandidateStatus.REJECTED]: 'Refuzuar',
});

const TRANSITIONS = Object.freeze({
  [CandidateStatus.PENDING]: [CandidateStatus.UNDER_REVIEW, CandidateStatus.SHORTLISTED, CandidateStatus.ACCEPTED, CandidateStatus.REJECTED],
  [CandidateStatus.UNDER_REVIEW]: [CandidateStatus.SHORTLISTED, CandidateStatus.ACCEPTED, CandidateStatus.REJECTED],
  [CandidateStatus.SHORTLISTED]: [CandidateStatus.UNDER_REVIEW, CandidateStatus.ACCEPTED, CandidateStatus.REJECTED],
  [CandidateStatus.ACCEPTED]: [],
  [CandidateStatus.REJECTED]: [CandidateStatus.UNDER_REVIEW],
});

export const allowedTransitions = (status) => TRANSITIONS[status] ?? [];
export const canTransition = (from, to) => allowedTransitions(from).includes(to);

export class CandidateApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CandidateApplicationError';
  }
}

export function createCandidateApplication({
  id,
  internshipId,
  companyId,
  positionTitle,
  companyName,
  student,
  cv = '',
  coverLetter = '',
  message = '',
  status = CandidateStatus.PENDING,
  submittedAt,
  updatedAt = submittedAt,
}) {
  if (!id || !internshipId || !companyId) throw new CandidateApplicationError('Aplikimi duhet të ketë id, pozitë dhe kompani.');
  if (!student?.email) throw new CandidateApplicationError('Aplikimi duhet të ketë email-in e studentit.');
  if (!String(cv).trim()) throw new CandidateApplicationError('Zgjidh një CV në formatin PDF për të aplikuar.');
  if (!CANDIDATE_STATUSES.includes(status)) throw new CandidateApplicationError(`Status i panjohur: ${status}`);
  if (Number.isNaN(Date.parse(submittedAt))) throw new CandidateApplicationError('Data e aplikimit nuk është e vlefshme.');

  return Object.freeze({
    id,
    internshipId,
    companyId,
    positionTitle,
    companyName,
    student: Object.freeze({
      email: String(student.email).trim().toLowerCase(),
      name: student.name?.trim() || 'Student/e',
      university: student.university ?? '',
      major: student.major ?? '',
      city: student.city ?? '',
      skills: Object.freeze([...(student.skills ?? [])]),
    }),
    cv: String(cv).trim(),
    coverLetter: String(coverLetter).trim(),
    message: String(message).trim(),
    status,
    submittedAt,
    updatedAt,
  });
}

export function withCandidateStatus(application, status, now = new Date()) {
  if (!canTransition(application.status, status)) {
    throw new CandidateApplicationError(
      `Statusi nuk mund të ndryshohet nga "${CANDIDATE_STATUS_LABELS[application.status]}" në "${CANDIDATE_STATUS_LABELS[status] ?? status}".`,
    );
  }
  return createCandidateApplication({ ...application, status, updatedAt: now.toISOString() });
}
