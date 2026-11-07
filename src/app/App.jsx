import { Route, Routes } from 'react-router';
import { NotFoundMessage } from '../features/companies/components/NotFoundMessage';
import { CompaniesPage } from '../features/companies/pages/CompaniesPage';
import { CompanyProfilePage } from '../features/companies/pages/CompanyProfilePage';
import { PositionPage } from '../features/companies/pages/PositionPage';
import { PublishPositionPage } from '../features/companies/pages/PublishPositionPage';
import { HomePage } from '../features/home/pages/HomePage';
import { LoginPage } from '../features/login/pages/LoginPage';
import { LoginRolePage } from '../features/login/pages/LoginRolePage';
import { SignupPage } from '../features/signup/pages/SignupPage';
import { SignupRolePage } from '../features/signup/pages/SignupRolePage';
import { StudentProfilePage } from '../features/student/pages/StudentProfilePage';
import { StudentDashboardPage } from '../features/student/pages/StudentDashboardPage';
import { StudentApplicationsPage } from '../features/student/pages/StudentApplicationsPage';
import { AppLayout } from './AppLayout';

export function App({ container }) {
  const { homeUseCases, companyUseCases } = container;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage useCases={homeUseCases} />} />
        <Route path="kompanite" element={<CompaniesPage useCases={companyUseCases} />} />
        <Route path="kompanite/:companyId" element={<CompanyProfilePage useCases={companyUseCases} />} />
        <Route path="kompanite/:companyId/pozitat/:positionId" element={<PositionPage useCases={companyUseCases} />} />
        <Route path="kompani/publiko-pozite" element={<PublishPositionPage />} />
        <Route path="regjistrohu" element={<SignupPage />} />
        <Route path="regjistrohu/:role" element={<SignupRolePage />} />
        <Route path="hyr" element={<LoginPage />} />
        <Route path="hyr/:role" element={<LoginRolePage />} />
        <Route path="profili" element={<StudentProfilePage />} />
        <Route path="student" element={<StudentDashboardPage />} />
        <Route path="student/applications" element={<StudentApplicationsPage />} />
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
