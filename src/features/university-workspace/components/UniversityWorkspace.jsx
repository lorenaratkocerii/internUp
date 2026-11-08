import { BadgeCheck, Landmark, LayoutDashboard, UsersRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { isPendingRepresentative } from '../../../domain/auth/accessControl';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { Container } from '../../home/components/ui/Container';
import { logoutDemoUser } from '../../login/demoAuth';
import { UniversityLogo } from '../../universities/components/UniversityLogo';

const links = [
  { to: '/universitet', label: 'Paneli kryesor', icon: LayoutDashboard, end: true },
  { to: '/universitet/verifikimi', label: 'Verifikimi', icon: BadgeCheck },
  { to: '/universitet/studentet', label: 'Studentët', icon: UsersRound },
  { to: '/universitet/profili', label: 'Profili', icon: Landmark },
];

export function UniversityWorkspace({ children, title, university, pendingCount = 0 }) {
  const navigate = useNavigate();
  const actor = useCurrentActor();
  const handleLogout = () => {
    logoutDemoUser();
    navigate('/');
  };

  return (
    <Container className="py-8 lg:py-10">
      <div className="mb-7 flex items-center gap-3 text-cream">
        {university ? (
          <UniversityLogo university={university} className="size-11 rounded-xl" padding="p-1" />
        ) : (
          <span className="grid size-11 place-items-center rounded-xl bg-cream text-charcoal">
            <Landmark aria-hidden="true" className="size-6" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold tracking-[0.16em] text-cream/55 uppercase">
            Hapësira e universitetit{university ? ` · ${university.shortName}` : ''}
          </p>
          <h1 className="font-display text-2xl">{title}</h1>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <div className="self-start lg:sticky lg:top-24">
          <aside className="rounded-2xl border border-cream/15 bg-charcoal/50 p-3">
            <p className="px-3 py-3 text-xs font-semibold tracking-[0.14em] text-cream/45 uppercase">Menuja</p>
            <nav aria-label="Navigimi i universitetit" className="grid grid-cols-2 gap-1 lg:grid-cols-1">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'bg-cream text-charcoal' : 'text-cream/75 hover:bg-cream/10 hover:text-cream'
                    }`
                  }
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {label}
                  {to === '/universitet/verifikimi' && pendingCount > 0 && (
                    <span className="ml-auto rounded-full bg-terracotta px-2 py-0.5 text-xs font-semibold text-cream">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 hidden rounded-xl bg-navy/65 p-4 text-cream lg:block">
              <p className="text-sm font-semibold">Para se të verifikosh</p>
              <p className="mt-1 text-xs leading-relaxed text-cream/65">
                Kontrollo numrin e indeksit në regjistrin e universitetit. Email-i universitar ndihmon, por nuk mjafton vetëm ai.
              </p>
            </div>
          </aside>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 inline-flex min-h-11 w-full items-center gap-3 rounded-xl border border-cream/15 bg-charcoal/50 px-4 py-2.5 text-sm font-semibold text-cream/75 transition-colors hover:border-cream/30 hover:bg-cream/10 hover:text-cream"
          >
            Dil
          </button>
        </div>
        <section className="min-w-0" aria-label={title}>
          {isPendingRepresentative(actor) && (
            <p role="status" className="mb-6 rounded-2xl border border-cream/20 bg-navy/60 px-5 py-4 text-sm leading-relaxed text-cream/85">
              <span className="font-semibold text-cream">Llogaria jote pret konfirmimin.</span> Email-i yt nuk mund të
              lidhej automatikisht me universitetin, prandaj InternUp do ta konfirmojë. Deri atëherë mund t'i shohësh
              kërkesat, por nuk mund të verifikosh studentë apo të ndryshosh profilin.
            </p>
          )}
          {children}
        </section>
      </div>
    </Container>
  );
}
