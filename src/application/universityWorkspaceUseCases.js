import {
  assertApprovedRepresentative,
  assertCan,
  assertOwnsUniversity,
  isPendingRepresentative,
  Permission,
} from '../domain/auth/accessControl';
import { CandidateStatus } from '../domain/internship/candidateApplication';
import {
  createUniversity,
  emailMatchesUniversity,
  UniversityType,
  validateUniversityProfile,
} from '../domain/university/University';
import {
  decideVerification,
  latestPerStudent,
  VerificationError,
  VerificationStatus,
} from '../domain/university/studentVerification';
import { asCandidateApplicationRepository } from './ports/CandidateApplicationRepository';
import { asStudentVerificationRepository } from './ports/StudentVerificationRepository';
import { asUniversityRepository } from './ports/UniversityRepository';
export class UniversityValidationError extends Error {
  constructor(fieldErrors, message = 'Kontrollo fushat e shënuara.') {
    super(message);
    this.name = 'UniversityValidationError';
    this.fieldErrors = fieldErrors;
  }
}
export function createUniversityWorkspaceUseCases({
  universityRepository,
  studentVerificationRepository,
  candidateApplicationRepository,
  now = () => new Date(),
}) {
  const universities = asUniversityRepository(universityRepository);
  const verifications = asStudentVerificationRepository(studentVerificationRepository);
  const applications = asCandidateApplicationRepository(candidateApplicationRepository);

  const getMyUniversity = async (actor) => {
    assertCan(actor, Permission.VIEW_UNIVERSITY_STUDENTS);
    const existing = await universities.findById(actor.universityId);
    if (existing) return existing;

    const created = createUniversity({
      id: actor.universityId,
      name: actor.name || actor.profile.name || 'Universiteti im',
      type: UniversityType.PRIVATE,
      city: actor.profile.city || 'Kosovë',
      website: actor.profile.website || '',
      description: '',
      representative: { name: '', title: '', email: actor.email },
    });
    if (!isPendingRepresentative(actor)) await universities.save(created);
    return created;
  };
  const withActivity = async (university, request) => {
    const received = await applications.findByStudent(request.student.email);
    return {
      ...request,
      emailMatches: emailMatchesUniversity(university, request.universityEmail),
      applicationCount: received.length,
      acceptedCount: received.filter((item) => item.status === CandidateStatus.ACCEPTED).length,
    };
  };
  const sameIndex = (a, b) => a.studentNumber.trim().toLowerCase() === b.studentNumber.trim().toLowerCase();

  const listRequests = async (actor) => {
    assertCan(actor, Permission.VERIFY_STUDENTS);
    const university = await getMyUniversity(actor);
    if (isPendingRepresentative(actor)) return { university, requests: [] };

    const requests = latestPerStudent(await verifications.findAll())
      .filter((request) => request.universityId === university.id)
      .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))
      .map((request, _, all) => ({
        ...request,
        sharedIndexWith: all
          .filter((other) => other.id !== request.id && sameIndex(other, request) && other.status !== VerificationStatus.REJECTED)
          .map((other) => other.student.name),
      }));
    return { university, requests: await Promise.all(requests.map((request) => withActivity(university, request))) };
  };
  return Object.freeze({
    getMyUniversity,
    listRequests,

    getOverview: async (actor) => {
      const { university, requests } = await listRequests(actor);
      const verified = requests.filter((request) => request.status === VerificationStatus.VERIFIED);
      return {
        university,
        requests,
        counts: {
          pending: requests.filter((request) => request.status === VerificationStatus.PENDING).length,
          verified: verified.length,
          rejected: requests.filter((request) => request.status === VerificationStatus.REJECTED).length,
          applications: verified.reduce((sum, request) => sum + request.applicationCount, 0),
          accepted: verified.filter((request) => request.acceptedCount > 0).length,
        },
      };
    },
    decide: async (actor, requestId, { status, note }) => {
      assertCan(actor, Permission.VERIFY_STUDENTS);
      assertApprovedRepresentative(actor);
      const request = await verifications.findById(requestId);
      if (!request) throw new VerificationError('Kjo kërkesë nuk ekziston më.');
      assertOwnsUniversity(actor, request.universityId);

      const [latest] = await verifications.findByStudent(request.student.email);
      if (latest && latest.id !== request.id) {
        throw new VerificationError('Studenti ka dërguar një kërkesë më të re. Rifresko faqen dhe shqyrto atë.');
      }
      if (status === VerificationStatus.VERIFIED) {
        const holder = latestPerStudent(await verifications.findAll()).find(
          (other) =>
            other.id !== request.id &&
            other.universityId === request.universityId &&
            other.status === VerificationStatus.VERIFIED &&
            sameIndex(other, request),
        );
        if (holder) {
          throw new VerificationError(
            `Indeksi ${request.studentNumber} është verifikuar tashmë për ${holder.student.name}. Një indeks i takon vetëm një studenti.`,
          );
        }
      }

      const decided = decideVerification(request, { status, note, decidedBy: actor.email, at: now().toISOString() });
      await verifications.save(decided);
      return decided;
    },
    registerRepresentative: async (actor) => {
      assertCan(actor, Permission.MANAGE_UNIVERSITY_PROFILE);
      if (isPendingRepresentative(actor)) return null;
      const name = String(actor.profile.representativeName ?? '').trim();
      if (!name) return null;

      const current = await getMyUniversity(actor);
      const updated = createUniversity({
        ...current,
        representative: {
          name,
          title: String(actor.profile.representativeTitle ?? '').trim(),
          email: actor.email,
        },
      });
      await universities.save(updated);
      return updated;
    },
    updateMyUniversity: async (actor, draft) => {
      assertCan(actor, Permission.MANAGE_UNIVERSITY_PROFILE);
      assertApprovedRepresentative(actor);
      const fieldErrors = validateUniversityProfile(draft);
      if (Object.keys(fieldErrors).length) throw new UniversityValidationError(fieldErrors);

      const current = await getMyUniversity(actor);
      const updated = createUniversity({
        ...current,
        description: draft.description.trim(),
        website: draft.website.trim(),
        emailDomains: draft.emailDomains.split(/[\s,]+/).filter(Boolean),
        representative: {
          name: draft.representativeName.trim(),
          title: draft.representativeTitle.trim(),
          email: draft.representativeEmail.trim(),
        },
      });
      await universities.save(updated);
      return updated;
    },
  });
}
