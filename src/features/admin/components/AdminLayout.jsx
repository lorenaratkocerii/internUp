import { BriefcaseBusiness, Building2, ChevronDown, House, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { logoutDemoUser } from '../../login/demoAuth';

const homeLinks = [
  { to: '/admin/kompanite', label: 'Kompanitë partnere', icon: Building2 },
  { to: '/admin/praktikat', label: 'Praktikat', icon: BriefcaseBusiness },
  { to: '/admin/historite', label: 'Historitë', icon: MessageSquareQuote },
];

const itemClass =
  'flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors';
const idleClass = 'text-cream/75 hover:bg-cream/10 hover:text-cream';

export function AdminLayout({ useCases }) {
  const navigate = useNavigate();
  const actor = useCurrentActor();
  const { pathname } = useLocation();
  const [homeOpen, setHomeOpen] = useState(() => homeLinks.some((link) => pathname.startsWith(link.to)));

  const handleLogout = () => {
    useCases.logout();
    logoutDemoUser();
    navigate('/');
  };

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="flex flex-col border-b border-cream/15 bg-charcoal p-4 lg:sticky lg:top-0 lg:h-svh lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-1 pb-5 text-cream">
          <span className="grid size-10 shrink-0 place-items-center bg-cream text-charcoal">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl leading-tight">Paneli i adminit</p>
            <p className="truncate text-sm text-cream/60">{actor?.name || actor?.email}</p>
          </div>
        </div>

        <nav aria-label="Navigimi i adminit">
          <button
            type="button"
            onClick={() => setHomeOpen((open) => !open)}
            aria-expanded={homeOpen}
            aria-controls="admin-ballina"
            className={`${itemClass} ${idleClass}`}
          >
            <House aria-hidden="true" className="size-4 shrink-0" />
            Ballina
            <ChevronDown
              aria-hidden="true"
              className={`ml-auto size-4 transition-transform ${homeOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {homeOpen && (
            <ul id="admin-ballina" className="mt-1 ml-5 grid gap-1 border-l border-cream/15 pl-2">
              {homeLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => `${itemClass} ${isActive ? 'bg-cream text-charcoal' : idleClass}`}
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="mt-6 grid gap-2 lg:mt-auto">
          <Link to="/" className={`${itemClass} ${idleClass}`}>
            Shiko faqen
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`${itemClass} border border-cream/15 font-semibold ${idleClass}`}
          >
            Dil
          </button>
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function AdminWelcome() {
  return (
    <p className="py-10 text-lg text-cream/70">
      Hap “Ballina” në menynë majtas dhe zgjidh çfarë do të ndryshosh.
    </p>
  );
}
