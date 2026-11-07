import { assertCan, Permission } from '../domain/auth/accessControl';
import {
  CandidateApplicationError,
  CandidateStatus,
  createCandidateApplication,
} from '../domain/internship/candidateApplication';
import { acceptsApplications } from '../domain/internship/applicationStatus';
import { asCandidateApplicationRepository } from './ports/CandidateApplicationRepository';
import { asCompanyRepository } from './ports/CompanyRepository';
import { asInternshipRepository } from './ports/InternshipRepository';

export function createStudentApplicationUseCases({
  internshipRepository,
  companyRepository,
  candidateApplicationRepository,
  now = () => new Date(),
}) {
  const internships = asInternshipRepository(internshipRepository);
  const companies = asCompanyRepository(companyRepository);
  const applications = asCandidateApplicationRepository(candidateApplicationRepository);

  return Object.freeze({
    listMyApplications: async (actor) => {
      assertCan(actor, Permission.VIEW_OWN_APPLICATIONS);
      return applications.findByStudent(actor.email);
    },

    applyToInternship: async (actor, { internshipId, cv, coverLetter, message, student = {} }) => {
      assertCan(actor, Permission.APPLY_TO_INTERNSHIPS);
      const internship = await internships.findById(internshipId);
      if (!internship) throw new CandidateApplicationError('Kjo pozitë nuk ekziston më.');
      if (!acceptsApplications(internship, now())) {
        throw new CandidateApplicationError('Afati i aplikimit për këtë pozitë ka përfunduar.');
      }
      const mine = await applications.findByStudent(actor.email);
      if (mine.some((item) => item.internshipId === internshipId && item.status !== CandidateStatus.REJECTED)) {
        throw new CandidateApplicationError('Ke aplikuar tashmë për këtë pozitë.');
      }

      const company = await companies.findById(internship.companyId);
      const submittedAt = now().toISOString();
      const application = createCandidateApplication({
        id: `app-${now().getTime().toString(36)}`,
        internshipId,
        companyId: internship.companyId,
        positionTitle: internship.title,
        companyName: company?.name ?? internship.company,
        student: { ...student, email: actor.email },
        cv,
        coverLetter,
        message,
        submittedAt,
      });
      await applications.save(application);
      return application;
    },
  });
}
