export const VerificationStatus = Object.freeze({
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
});

export const VERIFICATION_STATUS_LABELS = Object.freeze({
  [VerificationStatus.PENDING]: 'Në pritje',
  [VerificationStatus.VERIFIED]: 'I verifikuar',
  [VerificationStatus.REJECTED]: 'I refuzuar',
});

export const STUDY_YEARS = Object.freeze(['Viti i parë', 'Viti i dytë', 'Viti i tretë', 'Viti i katërt', 'Master']);

export class VerificationError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.name = 'VerificationError';
    this.fieldErrors = fieldErrors;
  }
}

const TRANSITIONS = Object.freeze({
  [VerificationStatus.PENDING]: [VerificationStatus.VERIFIED, VerificationStatus.REJECTED],
  [VerificationStatus.VERIFIED]: [VerificationStatus.REJECTED],
  [VerificationStatus.REJECTED]: [VerificationStatus.VERIFIED],
});

export const canMoveTo = (request, status) => TRANSITIONS[request.status]?.includes(status) ?? false;

export function validateVerificationDraft(draft) {
  const errors = {};
  const text = (field) => String(draft[field] ?? '').trim();

  if (!text('universityId')) errors.universityId = 'Zgjidh universitetin.';
  if (!/^[A-Za-z0-9/-]{4,20}$/.test(text('studentNumber'))) {
    errors.studentNumber = 'Numri i indeksit duhet të ketë 4–20 shifra ose shkronja.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('universityEmail'))) {
    errors.universityEmail = 'Shkruaj email-in universitar.';
  }
  if (!text('faculty')) errors.faculty = 'Shkruaj fakultetin.';
  if (!text('program')) errors.program = 'Shkruaj drejtimin e studimeve.';
  if (!STUDY_YEARS.includes(text('studyYear'))) errors.studyYear = 'Zgjidh vitin e studimeve.';
  return errors;
}

export function createVerificationRequest({
  id,
  universityId,
  student,
  studentNumber,
  universityEmail,
  faculty,
  program,
  studyYear,
  status = VerificationStatus.PENDING,
  submittedAt,
  decidedAt = null,
  decidedBy = '',
  note = '',
}) {
  if (!id || !universityId || !student?.email) {
    throw new VerificationError('Kërkesa duhet të ketë id, universitet dhe student.');
  }
  if (!Object.values(VerificationStatus).includes(status)) throw new VerificationError(`Status i panjohur: ${status}`);

  return Object.freeze({
    id,
    universityId,
    student: Object.freeze({ email: student.email.toLowerCase(), name: student.name ?? '' }),
    studentNumber,
    universityEmail: String(universityEmail ?? '').toLowerCase(),
    faculty,
    program,
    studyYear,
    status,
    submittedAt,
    decidedAt,
    decidedBy,
    note,
  });
}

export function decideVerification(request, { status, note = '', decidedBy, at }) {
  if (!canMoveTo(request, status)) {
    throw new VerificationError(
      `Kërkesa që është "${VERIFICATION_STATUS_LABELS[request.status]}" nuk mund të kalojë në "${VERIFICATION_STATUS_LABELS[status]}".`,
    );
  }
  if (status === VerificationStatus.REJECTED && !note.trim()) {
    throw new VerificationError('Shkruaj arsyen që studenti ta dijë çfarë duhet të rregullojë.', {
      note: 'Arsyeja është e detyrueshme.',
    });
  }
  return createVerificationRequest({ ...request, status, note: note.trim(), decidedBy, decidedAt: at });
}

export function shortStudentName(name) {
  const [first, ...rest] = String(name ?? '').trim().split(/\s+/);
  if (!first) return 'Student/e';
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
}
