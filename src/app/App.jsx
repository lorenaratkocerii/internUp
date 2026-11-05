import { Route, Routes } from 'react-router';
import { NotFoundMessage } from '../features/companies/components/NotFoundMessage';
import { CompaniesPage } from '../features/companies/pages/CompaniesPage';
import { CompanyProfilePage } from '../features/companies/pages/CompanyProfilePage';
import { PositionPage } from '../features/companies/pages/PositionPage';
import { HomePage } from '../features/home/pages/HomePage';
import { SignupPage } from '../features/signup/pages/SignupPage';
import { SignupRolePage } from '../features/signup/pages/SignupRolePage';
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
        <Route path="regjistrohu" element={<SignupPage />} />
        <Route path="regjistrohu/:role" element={<SignupRolePage />} />
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
