import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { Logo } from '../../home/components/ui/Logo';
import { logoutDemoUser } from '../../login/demoAuth';

export function AdminDashboardPage() {
  useDocumentTitle('Paneli i adminit');
  const actor = useCurrentActor();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutDemoUser();
    navigate('/');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Link to="/" className="text-cream" aria-label="InternUp, kreu">
          <Logo />
        </Link>
        <button type="button" className="grid size-9 place-items-center text-cream/70 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Mbyll menunë">
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="mt-auto space-y-1 border-t border-cream/10 p-3">
        <Link to="/" className="flex min-h-10 items-center gap-3 rounded-[10px] px-3 text-sm text-cream/70 hover:bg-cream/[0.07] hover:text-cream">
          <ExternalLink aria-hidden="true" className="size-4" />
          Shiko faqen publike
        </Link>
        <button type="button" onClick={handleLogout} className="flex min-h-10 w-full items-center gap-3 rounded-[10px] px-3 text-sm text-cream/70 hover:bg-cream/[0.07] hover:text-cream">
          <LogOut aria-hidden="true" className="size-4" />
          Dil
        </button>
        <div className="mt-2 flex items-center gap-3 rounded-[10px] bg-cream/[0.05] p-3">
          <span className="grid size-9 place-items-center rounded-full bg-terracotta text-sm font-semibold">A</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{actor?.name || 'Administratori'}</p>
            <p className="truncate text-xs text-cream/50">{actor?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh bg-charcoal text-cream">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-cream/10 bg-charcoal lg:block">{sidebar}</aside>
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} aria-label="Mbyll menunë" />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-cream/10 bg-charcoal motion-safe:animate-fade-up">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-cream/10 bg-charcoal/90 px-4 backdrop-blur-md sm:px-6">
          <button type="button" className="grid size-10 place-items-center rounded-[10px] text-cream/80 hover:bg-cream/[0.07] lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Hap menunë">
            <Menu aria-hidden="true" className="size-5" />
          </button>
          <span className="ml-auto hidden items-center gap-2 rounded-full border border-cream/10 py-1 pr-3 pl-1 text-sm sm:flex">
            <span className="grid size-7 place-items-center rounded-full bg-terracotta text-xs font-semibold">A</span>
            Admin
          </span>
        </header>

        <main id="permbajtja" className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 lg:py-8">
          <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">Mirë se erdhe, Admin</h1>
        </main>
      </div>
    </div>
  );
}
