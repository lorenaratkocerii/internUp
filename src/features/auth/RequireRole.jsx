import { LockKeyhole } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Role } from '../../domain/auth/accessControl';
import { ButtonLink } from '../home/components/ui/Button';
import { Container } from '../home/components/ui/Container';
import { useDocumentTitle } from '../companies/hooks/useDocumentTitle';
import { useCurrentActor } from './useCurrentActor';

const HOME_BY_ROLE = {
  [Role.STUDENT]: { href: '/student', label: 'Shko te paneli i studentit' },
  [Role.COMPANY]: { href: '/kompani', label: 'Shko te paneli i kompanisë' },
  [Role.UNIVERSITY]: { href: '/universitet', label: 'Shko te paneli i universitetit' },
};

const ROLE_NAMES = {
  [Role.STUDENT]: 'student',
  [Role.COMPANY]: 'kompani',
  [Role.UNIVERSITY]: 'universitet',
};

function AccessDenied({ role, actor }) {
  useDocumentTitle('Nuk ke qasje');
  const home = HOME_BY_ROLE[actor.role];
  return (
    <Container className="py-20 lg:py-28">
      <div className="mx-auto max-w-xl rounded-2xl border border-cream/15 bg-charcoal/60 p-8 text-center sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-cream text-charcoal">
          <LockKeyhole aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-6 font-display text-3xl">Kjo faqe është vetëm për llogaritë {ROLE_NAMES[role]}</h1>
        <p className="mt-3 text-cream/70">
          Je kyçur si {ROLE_NAMES[actor.role] ?? actor.role}. Dil dhe kyçu me llogarinë e duhur për të vazhduar.
        </p>
        {home && (
          <ButtonLink href={home.href} className="mt-7 rounded-xl">
            {home.label}
          </ButtonLink>
        )}
      </div>
    </Container>
  );
}

export function RequireRole({ role }) {
  const actor = useCurrentActor();
  const { pathname, search } = useLocation();

  if (!actor) {
    const next = encodeURIComponent(`${pathname}${search}`);
    return <Navigate to={`/hyr/${role}?next=${next}`} replace />;
  }
  if (actor.role !== role) return <AccessDenied role={role} actor={actor} />;
  return <Outlet />;
}
