import { assertCan, assertOwnsCompany, Permission } from '../domain/auth/accessControl';
import {
  CandidateApplicationError,
  CandidateStatus,
  withCandidateStatus,
} from '../domain/internship/candidateApplication';
import { createCompany } from '../domain/internship/Company';
import { normalizeCompanySize, validateCompanyProfile } from '../domain/internship/companyProfile';
import { createInternship } from '../domain/internship/Internship';
import { internshipFieldsFromDraft, validateInternshipDraft } from '../domain/internship/internshipDraft';
import { ApplicationStatus, withApplicationStatus } from '../domain/internship/applicationStatus';
import { asCandidateApplicationRepository } from './ports/CandidateApplicationRepository';
import { asCompanyRepository } from './ports/CompanyRepository';
import { asInternshipRepository } from './ports/InternshipRepository';
import { asStoryRepository } from './ports/StoryRepository';
import { withVerification } from '../domain/blog/Story';

export class WorkspaceValidationError extends Error {
  constructor(fieldErrors, message = 'Kontrollo fushat e shënuara.') {
    super(message);
    this.name = 'WorkspaceValidationError';
    this.fieldErrors = fieldErrors;
  }
}

export class WorkspaceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WorkspaceNotFoundError';
  }
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

export function createCompanyWorkspaceUseCases({
  companyRepository,
  internshipRepository,
  candidateApplicationRepository,
  storyRepository,
  now = () => new Date(),
}) {
  const companies = asCompanyRepository(companyRepository);
  const internships = asInternshipRepository(internshipRepository);
  const applications = asCandidateApplicationRepository(candidateApplicationRepository);
  const stories = asStoryRepository(storyRepository);

  const listInternStories = async (actor) => {
    assertCan(actor, Permission.VERIFY_INTERNS);
    const [all, received] = await Promise.all([stories.findAll(), applications.findByCompany(actor.companyId)]);
    const acceptedEmails = new Set(
      received.filter((item) => item.status === CandidateStatus.ACCEPTED).map((item) => item.student.email),
    );
    return all
      .filter((story) => story.companyId === actor.companyId)
      .map((story) => ({
        ...story,
        hasAcceptedApplication: Boolean(story.author.email) && acceptedEmails.has(story.author.email.toLowerCase()),
      }))
      .sort((a, b) => Number(a.verified) - Number(b.verified) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  };

  const ensureCompany = async (actor) => {
    assertCan(actor, Permission.MANAGE_COMPANY_PROFILE);
    const existing = await companies.findById(actor.companyId);
    if (existing) return existing;

    const profile = actor.profile ?? {};
    const name = actor.name || profile.name || 'Kompania ime';
    const company = createCompany({
      id: actor.companyId,
      name,
      shortDescription: `Praktika profesionale te ${name}.`,
      description: `${name} ofron praktika për studentët përmes InternUp. Plotëso profilin që studentët ta njohin më mirë kompaninë.`,
      history: '',
      foundedYear: now().getFullYear(),
      location: profile.city || 'Prishtinë',
      website: profile.website || '',
      industry: profile.industry || 'Tjetër',
      size: normalizeCompanySize(profile.size || '1-10'),
      workMode: 'Hybrid',
      technologies: [],
      culture: '',
      benefits: [],
      coverImage: '/images/companies/header.jpg',
      coverAlt: `Kompania ${name}`,
    });
    await companies.save(company);
    return company;
  };

  const requireOwnInternship = async (actor, internshipId) => {
    assertCan(actor, Permission.MANAGE_INTERNSHIPS);
    const internship = await internships.findById(internshipId);
    if (!internship) throw new WorkspaceNotFoundError('Kjo pozitë nuk ekziston më.');
    assertOwnsCompany(actor, internship.companyId);
    return internship;
  };

  const listPositions = async (actor) => {
    const [own, received] = await Promise.all([
      internships.findByCompany(actor.companyId),
      applications.findByCompany(actor.companyId),
    ]);
    return own.map((internship) => {
      const forPosition = received.filter((application) => application.internshipId === internship.id);
      return {
        ...withApplicationStatus(internship, now()),
        applicationCount: forPosition.length,
        acceptedCount: forPosition.filter((application) => application.status === CandidateStatus.ACCEPTED).length,
      };
    });
  };

  return Object.freeze({
    getMyCompany: ensureCompany,

    updateMyCompany: async (actor, input) => {
      const current = await ensureCompany(actor);
      const draft = { ...input, size: normalizeCompanySize(input.size) };
      const fieldErrors = validateCompanyProfile(draft, now());
      if (Object.keys(fieldErrors).length) throw new WorkspaceValidationError(fieldErrors);

      const company = createCompany({
        ...current,
        name: draft.name.trim(),
        shortDescription: draft.shortDescription.trim(),
        description: draft.description.trim(),
        location: draft.location.trim(),
        website: draft.website.trim(),
        industry: draft.industry,
        foundedYear: Number(draft.foundedYear),
        size: draft.size,
        logo: draft.logo || '',
      });
      await companies.save(company);

      if (company.name !== current.name) {
        const own = await internships.findByCompany(company.id);
        await Promise.all(own.map((item) => internships.save(createInternship({ ...item, company: company.name }))));
      }
      return company;
    },

    getDashboard: async (actor) => {
      const company = await ensureCompany(actor);
      const [positions, received, internStories] = await Promise.all([
        listPositions(actor),
        applications.findByCompany(company.id),
        listInternStories(actor),
      ]);
      const byStatus = (status) => received.filter((application) => application.status === status).length;
      return {
        company,
        positions,
        recentApplications: received.slice(0, 5),
        stats: {
          activePositions: positions.filter((position) => position.status !== ApplicationStatus.CLOSED).length,
          totalPositions: positions.length,
          applications: received.length,
          candidates: new Set(received.map((application) => application.student.email)).size,
          awaitingReview: byStatus(CandidateStatus.PENDING) + byStatus(CandidateStatus.UNDER_REVIEW),
          shortlisted: byStatus(CandidateStatus.SHORTLISTED),
          accepted: byStatus(CandidateStatus.ACCEPTED),
          pendingVerifications: internStories.filter((story) => !story.verified).length,
        },
      };
    },

    listMyInternships: async (actor) => {
      assertCan(actor, Permission.MANAGE_INTERNSHIPS);
      await ensureCompany(actor);
      return listPositions(actor);
    },

    getMyInternship: requireOwnInternship,

    publishInternship: async (actor, draft) => {
      assertCan(actor, Permission.MANAGE_INTERNSHIPS);
      const company = await ensureCompany(actor);
      const fieldErrors = validateInternshipDraft(draft);
      if (Object.keys(fieldErrors).length) throw new WorkspaceValidationError(fieldErrors);

      const fields = internshipFieldsFromDraft(draft);
      const internship = createInternship({
        ...fields,
        id: `${slugify(fields.title)}-${now().getTime().toString(36)}`,
        companyId: company.id,
        company: company.name,
        featured: false,
      });
      await internships.save(internship);
      return internship;
    },

    updateInternship: async (actor, internshipId, draft) => {
      const current = await requireOwnInternship(actor, internshipId);
      const fieldErrors = validateInternshipDraft(draft);
      if (Object.keys(fieldErrors).length) throw new WorkspaceValidationError(fieldErrors);

      const internship = createInternship({ ...current, ...internshipFieldsFromDraft(draft) });
      await internships.save(internship);
      return internship;
    },

    deleteInternship: async (actor, internshipId) => {
      await requireOwnInternship(actor, internshipId);
      await internships.remove(internshipId);
    },

    listApplications: async (actor) => {
      assertCan(actor, Permission.REVIEW_APPLICATIONS);
      const [received, own] = await Promise.all([
        applications.findByCompany(actor.companyId),
        internships.findByCompany(actor.companyId),
      ]);
      return received.map((application) => ({
        ...application,
        positionExists: own.some((internship) => internship.id === application.internshipId),
      }));
    },

    updateApplicationStatus: async (actor, applicationId, status) => {
      assertCan(actor, Permission.REVIEW_APPLICATIONS);
      const application = await applications.findById(applicationId);
      if (!application) throw new WorkspaceNotFoundError('Ky aplikim nuk ekziston.');
      assertOwnsCompany(actor, application.companyId);

      if (status === CandidateStatus.ACCEPTED) {
        const internship = await internships.findById(application.internshipId);
        if (internship) {
          const accepted = (await applications.findByCompany(actor.companyId)).filter(
            (item) => item.internshipId === internship.id && item.status === CandidateStatus.ACCEPTED,
          ).length;
          if (accepted >= internship.seats) {
            throw new CandidateApplicationError(
              `Të gjitha ${internship.seats} vendet për "${internship.title}" janë plotësuar. Rrit numrin e vendeve te pozita për të pranuar më shumë.`,
            );
          }
        }
      }

      const updated = withCandidateStatus(application, status, now());
      await applications.save(updated);
      return updated;
    },

    listInternStories,

    setStoryVerification: async (actor, storyId, verified) => {
      assertCan(actor, Permission.VERIFY_INTERNS);
      const story = await stories.findById(storyId);
      if (!story) throw new WorkspaceNotFoundError('Kjo histori nuk ekziston më.');
      assertOwnsCompany(actor, story.companyId);
      const updated = withVerification(story, Boolean(verified), now());
      await stories.save(updated);
      return updated;
    },

    validateInternshipDraft,
    validateCompanyProfile: (draft) => validateCompanyProfile(draft, now()),
  });
}
