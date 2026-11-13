import { assertCan, can, isPendingRepresentative, Permission } from '../domain/auth/accessControl';
import {
  checkRepresentativeEmail,
  emailMatchesUniversity,
  isSameUniversity,
  RepresentativeEmailCheck,
  staffDomains,
  UniversityType,
} from '../domain/university/University';
import { EMPTY_UNIVERSITY_FILTERS, matchesUniversityFilters } from '../domain/university/universityFilters';
import {
  createVerificationRequest,
  latestPerStudent,
  shortStudentName,
  validateVerificationDraft,
  VerificationError,
  VerificationStatus,
} from '../domain/university/studentVerification';
import { asStoryRepository } from './ports/StoryRepository';
import { asStudentVerificationRepository } from './ports/StudentVerificationRepository';
import { asUniversityRepository } from './ports/UniversityRepository';

export { EMPTY_UNIVERSITY_FILTERS, RepresentativeEmailCheck, UniversityType, VerificationError, VerificationStatus };
const STORIES_ON_PROFILE = 3;

export function createUniversityUseCases({
  universityRepository,
  studentVerificationRepository,
  storyRepository,
  now = () => new Date(),
}) {
  const universities = asUniversityRepository(universityRepository);
  const verifications = asStudentVerificationRepository(studentVerificationRepository);
  const stories = asStoryRepository(storyRepository);

  const verifiedOf = (requests, universityId) =>
    latestPerStudent(requests).filter(
      (request) => request.universityId === universityId && request.status === VerificationStatus.VERIFIED,
    );

  return Object.freeze({
    listUniversities: async () => {
      const [all, requests] = await Promise.all([universities.findAll(), verifications.findAll()]);
      return all.map((university) => ({ ...university, verifiedStudents: verifiedOf(requests, university.id).length }));
    },

    filterUniversities: (list, filters) => list.filter((university) => matchesUniversityFilters(university, filters)),

    findByName: (list, label) => list.find((university) => isSameUniversity(university, label)) ?? null,

    checkRepresentativeEmail,
    staffDomains,

    getUniversityProfile: async (universityId, actor = null) => {
      const university = await universities.findById(universityId);
      if (!university) return null;

      const [requests, allStories] = await Promise.all([verifications.findAll(), stories.findAll()]);
      const verified = verifiedOf(requests, universityId);
      const isOwnRepresentative =
        can(actor, Permission.VIEW_UNIVERSITY_STUDENTS) &&
        actor.universityId === universityId &&
        !isPendingRepresentative(actor);
      const visible = isOwnRepresentative ? verified : [];

      return {
        university,
        verifiedCount: verified.length,
        canSeeStudents: isOwnRepresentative,
        students: visible.map((request) => ({
          id: request.id,
          name: shortStudentName(request.student.name),
          program: request.program,
          studyYear: request.studyYear,
        })),
        stories: allStories
          .filter((story) => isSameUniversity(university, story.author.university))
          .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
          .slice(0, STORIES_ON_PROFILE),
      };
    },

    getMyVerification: async (actor) => {
      assertCan(actor, Permission.REQUEST_UNIVERSITY_VERIFICATION);
      const [latest] = await verifications.findByStudent(actor.email);
      if (!latest) return null;
      return { ...latest, university: await universities.findById(latest.universityId) };
    },

    requestVerification: async (actor, draft) => {
      assertCan(actor, Permission.REQUEST_UNIVERSITY_VERIFICATION);
      const fieldErrors = validateVerificationDraft(draft);
      if (Object.keys(fieldErrors).length) throw new VerificationError('Kontrollo fushat e shënuara.', fieldErrors);

      const university = await universities.findById(draft.universityId);
      if (!university) {
        throw new VerificationError('Ky universitet nuk ekziston.', { universityId: 'Zgjidh universitetin nga lista.' });
      }

      const [latest] = await verifications.findByStudent(actor.email);
      if (latest && latest.status !== VerificationStatus.REJECTED) {
        throw new VerificationError(
          latest.status === VerificationStatus.VERIFIED
            ? 'Je verifikuar tashmë si student.'
            : 'Ke një kërkesë që po shqyrtohet. Prit përgjigjen e universitetit.',
        );
      }

      const request = createVerificationRequest({
        id: `ver-${now().getTime()}`,
        universityId: university.id,
        student: { email: actor.email, name: String(draft.studentName ?? '').trim() || actor.name || actor.email },
        studentNumber: draft.studentNumber.trim(),
        universityEmail: draft.universityEmail.trim(),
        faculty: draft.faculty.trim(),
        program: draft.program.trim(),
        studyYear: draft.studyYear,
        submittedAt: now().toISOString(),
      });
      await verifications.save(request);
      return { ...request, university, emailMatches: emailMatchesUniversity(university, request.universityEmail) };
    },
  });
}
