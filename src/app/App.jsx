import { Route, Routes } from 'react-router';
import { Role } from '../domain/auth/accessControl';
import { RequireRole } from '../features/auth/RequireRole';
import { NotFoundMessage } from '../features/companies/components/NotFoundMessage';
import { CompaniesPage } from '../features/companies/pages/CompaniesPage';
import { CompanyProfilePage } from '../features/companies/pages/CompanyProfilePage';
import { PositionPage } from '../features/companies/pages/PositionPage';
import { BlogPage } from '../features/blog/pages/BlogPage';
import { ShareStoryPage } from '../features/blog/pages/ShareStoryPage';
import { StoryDetailsPage } from '../features/blog/pages/StoryDetailsPage';
import { CompanyAccountProfilePage } from '../features/company-workspace/pages/CompanyAccountProfilePage';
import { CompanyApplicationsPage } from '../features/company-workspace/pages/CompanyApplicationsPage';
import { CompanyDashboardPage } from '../features/company-workspace/pages/CompanyDashboardPage';
import { InternshipEditorPage } from '../features/company-workspace/pages/InternshipEditorPage';
import { ManageInternshipsPage } from '../features/company-workspace/pages/ManageInternshipsPage';
import { VerifyInternsPage } from '../features/company-workspace/pages/VerifyInternsPage';
import { HomePage } from '../features/home/pages/HomePage';
import { LoginPage } from '../features/login/pages/LoginPage';
import { LoginRolePage } from '../features/login/pages/LoginRolePage';
import { SignupPage } from '../features/signup/pages/SignupPage';
import { SignupRolePage } from '../features/signup/pages/SignupRolePage';
import { StudentProfilePage } from '../features/student/pages/StudentProfilePage';
import { StudentDashboardPage } from '../features/student/pages/StudentDashboardPage';
import { StudentApplicationsPage } from '../features/student/pages/StudentApplicationsPage';
import { UniversitiesPage } from '../features/universities/pages/UniversitiesPage';
import { UniversityProfilePage } from '../features/universities/pages/UniversityProfilePage';
import { UniversityAccountProfilePage } from '../features/university-workspace/pages/UniversityAccountProfilePage';
import { UniversityDashboardPage } from '../features/university-workspace/pages/UniversityDashboardPage';
import { UniversityStudentsPage } from '../features/university-workspace/pages/UniversityStudentsPage';
import { VerifyStudentsPage } from '../features/university-workspace/pages/VerifyStudentsPage';
import { AppLayout } from './AppLayout';

export function App({ container }) {
  const {
    homeUseCases,
    companyUseCases,
    blogUseCases,
    companyWorkspaceUseCases,
    studentApplicationUseCases,
    universityUseCases,
    universityWorkspaceUseCases,
  } = container;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage useCases={homeUseCases} universityUseCases={universityUseCases} />} />
        <Route path="kompanite" element={<CompaniesPage useCases={companyUseCases} />} />
        <Route path="kompanite/:companyId" element={<CompanyProfilePage useCases={companyUseCases} />} />
        <Route
          path="kompanite/:companyId/pozitat/:positionId"
          element={<PositionPage useCases={companyUseCases} applicationUseCases={studentApplicationUseCases} />}
        />
        <Route path="universitetet" element={<UniversitiesPage useCases={universityUseCases} />} />
        <Route path="universitetet/:universityId" element={<UniversityProfilePage useCases={universityUseCases} />} />
        <Route path="blog" element={<BlogPage useCases={blogUseCases} />} />
        <Route path="blog/shkruaj" element={<ShareStoryPage useCases={blogUseCases} />} />
        <Route path="blog/:storyId" element={<StoryDetailsPage useCases={blogUseCases} universityUseCases={universityUseCases} />} />
        <Route path="regjistrohu" element={<SignupPage />} />
        <Route path="regjistrohu/:role" element={<SignupRolePage universityUseCases={universityUseCases} universityWorkspaceUseCases={universityWorkspaceUseCases} />} />
        <Route path="hyr" element={<LoginPage />} />
        <Route path="hyr/:role" element={<LoginRolePage />} />

        <Route element={<RequireRole role={Role.STUDENT} />}>
          <Route path="profili" element={<StudentProfilePage universityUseCases={universityUseCases} />} />
          <Route
            path="student"
            element={<StudentDashboardPage useCases={studentApplicationUseCases} verificationUseCases={universityUseCases} />}
          />
          <Route path="student/applications" element={<StudentApplicationsPage useCases={studentApplicationUseCases} />} />
        </Route>

        <Route element={<RequireRole role={Role.COMPANY} />}>
          <Route path="kompani" element={<CompanyDashboardPage useCases={companyWorkspaceUseCases} />} />
          <Route path="kompani/profili" element={<CompanyAccountProfilePage useCases={companyWorkspaceUseCases} />} />
          <Route path="kompani/pozitat" element={<ManageInternshipsPage useCases={companyWorkspaceUseCases} />} />
          <Route path="kompani/pozitat/e-re" element={<InternshipEditorPage useCases={companyWorkspaceUseCases} />} />
          <Route path="kompani/pozitat/:internshipId/ndrysho" element={<InternshipEditorPage useCases={companyWorkspaceUseCases} />} />
          <Route path="kompani/aplikimet" element={<CompanyApplicationsPage useCases={companyWorkspaceUseCases} />} />
          <Route path="kompani/verifikimi" element={<VerifyInternsPage useCases={companyWorkspaceUseCases} />} />
        </Route>

        <Route element={<RequireRole role={Role.UNIVERSITY} />}>
          <Route path="universitet" element={<UniversityDashboardPage useCases={universityWorkspaceUseCases} />} />
          <Route path="universitet/verifikimi" element={<VerifyStudentsPage useCases={universityWorkspaceUseCases} />} />
          <Route path="universitet/studentet" element={<UniversityStudentsPage useCases={universityWorkspaceUseCases} />} />
          <Route path="universitet/profili" element={<UniversityAccountProfilePage useCases={universityWorkspaceUseCases} />} />
        </Route>

        <Route
          path="*"
          element={
            <NotFoundMessage
              title="Kjo faqe nuk u gjet."
              description="Lidhja mund të jetë e pasaktë ose faqja mund të jetë hequr."
              href="/"
              linkLabel="Kthehu në kreu"
            />
          }
        />
      </Route>
    </Routes>
  );
}
