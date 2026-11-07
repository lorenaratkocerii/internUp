import { BadgeCheck, Building2, ClipboardList, LayoutDashboard, PlusCircle, BriefcaseBusiness } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { Container } from '../../home/components/ui/Container';
import { logoutDemoUser } from '../../login/demoAuth';

const links = [
  { to: '/kompani', label: 'Paneli kryesor', icon: LayoutDashboard, end: true },
  { to: '/kompani/profili', label: 'Profili i kompanisë', icon: Building2 },
  { to: '/kompani/pozitat', label: 'Manage Internships', icon: BriefcaseBusiness, end: true },
  { to: '/kompani/pozitat/e-re', label: 'Publiko pozitë', icon: PlusCircle },
  { to: '/kompani/aplikimet', label: 'Aplikimet', icon: ClipboardList },
  { to: '/kompani/verifikimi', label: 'Verifiko interns', icon: BadgeCheck },
];

export function CompanyWorkspace({ children, title, subtitle, companyName }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutDemoUser();
    navigate('/');
  };

  return (
    <Container className="py-8 lg:py-10">
      <div className="mb-7 flex items-center gap-3 text-cream">
        <span className="grid size-11 place-items-center rounded-xl bg-cream text-charcoal">
          <Building2 aria-hidden="true" className="size-6" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-cream/55 uppercase">
            Hapësira e kompanisë{companyName ? ` · ${companyName}` : ''}
          </p>
          <h1 className="font-display text-2xl">{title}</h1>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <div className="self-start lg:sticky lg:top-24">
          <aside className="rounded-2xl border border-cream/15 bg-charcoal/50 p-3">
            <p className="px-3 py-3 text-xs font-semibold tracking-[0.14em] text-cream/45 uppercase">Menuja</p>
            <nav aria-label="Navigimi i kompanisë" className="grid grid-cols-2 gap-1 lg:grid-cols-1">
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
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 hidden rounded-xl bg-navy/65 p-4 text-cream lg:block">
              <p className="text-sm font-semibold">Këshillë</p>
              <p className="mt-1 text-xs leading-relaxed text-cream/65">
                Një profil i plotë dhe pozita me kërkesa të qarta tërheqin kandidatë më të përshtatshëm.
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
        <section className="min-w-0" aria-label={subtitle || title}>
          {children}
        </section>
      </div>
    </Container>
  );
}
