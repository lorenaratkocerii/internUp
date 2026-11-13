import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { authLinks, navLinks } from '../content';
import { getDemoUser } from '../../login/demoAuth';
import { ButtonLink } from './ui/Button';
import { Container } from './ui/Container';
import { Logo } from './ui/Logo';

const linkClasses =
  'relative py-2 text-cream/80 transition-colors duration-200 hover:text-cream after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-cream after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:text-cream aria-[current=page]:after:scale-x-100';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(() => getDemoUser());
  const toggleRef = useRef(null);
  const { pathname } = useLocation();

  const currentProps = (href, exact = href === '/') =>
    (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)) ? { 'aria-current': 'page' } : {};

  const roleLinks = {
    student: [],
    kompani: [{ href: '/kompani', label: 'Paneli' }],
    universitet: [{ href: '/universitet', label: 'Paneli' }],
  }[user?.role] ?? [];
  const profileLink = {
    student: { href: '/profili', label: 'Profili im' },
    kompani: { href: '/kompani/profili', label: 'Profili i kompanisë' },
    universitet: { href: '/universitet/profili', label: 'Profili i universitetit' },
  }[user?.role];

  useEffect(() => {
    const syncUser = () => setUser(getDemoUser());
    window.addEventListener('internup:auth-change', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('internup:auth-change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const close = () => setIsOpen(false);
  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-charcoal/90 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link to="/#kreu" aria-label="InternUp, kreu" className="text-cream">
          <Logo />
        </Link>

        <nav aria-label="Navigimi kryesor" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className={linkClasses} {...currentProps(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
            {roleLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className={linkClasses} {...currentProps(link.href, link.exact)}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          {user ? (
            <>
              <span className="text-sm text-cream/80">{user.title}</span>
              {profileLink && <Link to={profileLink.href} className={linkClasses} {...currentProps(profileLink.href)}>{profileLink.label}</Link>}
            </>
          ) : (
            <>
              <Link to={authLinks.login} className={linkClasses}>Hyr</Link>
              <ButtonLink href={authLinks.signup} className="min-h-11 px-5 py-2">Krijo llogari</ButtonLink>
            </>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="menu-mobile"
          aria-label={isOpen ? 'Mbyll menunë' : 'Hap menunë'}
          className="-mr-2 grid size-11 place-items-center text-cream md:hidden"
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </Container>

      {isOpen && (
        <nav
          id="menu-mobile"
          aria-label="Navigimi në celular"
          className="border-t border-cream/10 bg-charcoal md:hidden"
        >
          <Container className="flex flex-col gap-1 py-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={close}
                className="py-3 font-display text-2xl text-cream"
                {...currentProps(link.href)}
              >
                {link.label}
              </Link>
            ))}
            {roleLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={close} className="py-3 font-display text-2xl text-cream" {...currentProps(link.href, link.exact)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {user ? (
                <>
                  {profileLink && <Link to={profileLink.href} onClick={close} className="min-h-11 border border-cream/40 px-4 py-2 text-center text-cream">{profileLink.label}</Link>}
                </>
              ) : (
                <>
                  <ButtonLink href={authLinks.login} variant="ghost" onClick={close}>Hyr</ButtonLink>
                  <ButtonLink href={authLinks.signup} onClick={close}>Krijo llogari</ButtonLink>
                </>
              )}
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
