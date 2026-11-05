import {
  ApplicationError,
  ApplicationErrorCode,
  createApplication,
  validateApplication,
} from '../domain/internship/Application';
import {
  acceptsApplications,
  ApplicationStatus,
  withApplicationStatus,
} from '../domain/internship/applicationStatus';
import {
  EMPTY_COMPANY_FILTERS,
  EMPTY_POSITION_FILTERS,
  matchesCompanyFilters,
  matchesPositionFilters,
} from '../domain/internship/companyFilters';
import { asApplicationRepository } from './ports/ApplicationRepository';
import {
  CompanyRegistrationError,
  createCompanyRegistration,
  validateCompanyRegistration,
} from '../domain/internship/CompanyRegistration';
import { asCompanyRegistrationRepository } from './ports/CompanyRegistrationRepository';
import { asCompanyRepository } from './ports/CompanyRepository';
import { asInternshipRepository } from './ports/InternshipRepository';

export { ApplicationStatus, EMPTY_COMPANY_FILTERS, EMPTY_POSITION_FILTERS };

const statusOrder = [ApplicationStatus.CLOSING_SOON, ApplicationStatus.OPEN, ApplicationStatus.CLOSED];

export function createCompanyUseCases({
  companyRepository,
  internshipRepository,
  applicationRepository,
  companyRegistrationRepository,
  now = () => new Date(),
}) {
  const companies = asCompanyRepository(companyRepository);
  const internships = asInternshipRepository(internshipRepository);
  const applications = asApplicationRepository(applicationRepository);
  const registrations = asCompanyRegistrationRepository(companyRegistrationRepository);

  return Object.freeze({
    listCompanies: async () => {
      const [allCompanies, allInternships] = await Promise.all([
        companies.findAll(),
        internships.findAll(),
      ]);
      return allCompanies.map((company) => ({
        ...company,
        activePositions: allInternships.filter(
          (internship) => internship.companyId === company.id && acceptsApplications(internship, now()),
        ).length,
      }));
    },

    getCompanyProfile: async (companyId) => {
      const company = await companies.findById(companyId);
      if (!company) return null;

      const positions = (await internships.findByCompany(companyId))
        .map((internship) => withApplicationStatus(internship, now()))
        .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
      return { company, positions };
    },

    getPosition: async (companyId, positionId) => {
      const [company, internship] = await Promise.all([
        companies.findById(companyId),
        internships.findById(positionId),
      ]);
      if (!company || !internship || internship.companyId !== companyId) return null;
      return { company, position: withApplicationStatus(internship, now()) };
    },

    applyToPosition: async ({ positionId, name, email, message }) => {
      const internship = await internships.findById(positionId);
      if (!internship) {
        throw new ApplicationError(ApplicationErrorCode.NOT_FOUND, 'Kjo pozitë nuk ekziston.');
      }
      if (!acceptsApplications(internship, now())) {
        throw new ApplicationError(
          ApplicationErrorCode.CLOSED,
          'Afati i aplikimit për këtë pozitë ka përfunduar.',
        );
      }

      const application = createApplication({ internshipId: positionId, name, email, message });
      if (await applications.exists(positionId, application.email)) {
        throw new ApplicationError(
          ApplicationErrorCode.DUPLICATE,
          'Ke aplikuar tashmë për këtë pozitë me këtë email.',
        );
      }
      await applications.save(application);
      return application;
    },

    registerCompany: async (input) => {
      const registration = createCompanyRegistration(input);
      if (await registrations.exists(registration.email)) {
        throw new CompanyRegistrationError('Ky email është regjistruar tashmë.');
      }
      await registrations.save(registration);
      return registration;
    },

    validateApplication,
    validateCompanyRegistration,
    filterCompanies: (list, filters) => list.filter((company) => matchesCompanyFilters(company, filters)),
    filterPositions: (list, filters) => list.filter((position) => matchesPositionFilters(position, filters)),
  });
}
