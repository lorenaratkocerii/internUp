import { Link } from 'react-router';
import { Mail, MapPin, Phone } from 'lucide-react';
import { contact, navLinks } from '../content';
import { Container } from './ui/Container';
import { Logo } from './ui/Logo';

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    path: 'M6.5 8.5h-3V20h3V8.5ZM5 3.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM20.5 13.4c0-3-1.6-5.1-4.3-5.1-1.5 0-2.6.8-3.1 1.7V8.5h-3V20h3v-6c0-1.6.8-2.9 2.3-2.9s2.1 1.2 2.1 2.9v6h3v-6.6Z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    path: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm4.5-3.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    path: 'M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2.6c-.8-.1-1.6-.1-2.4-.1-2.5 0-4.1 1.6-4.1 4.2v1.8H8v3.2h2.5v9.8H14v-9.8h2.6l.4-3.2h-3Z',
  },
];

function FooterHeading({ id, children }) {
  return (
    <h2 id={id} className="text-sm font-semibold tracking-[0.18em] text-cream/70 uppercase">
      {children}
    </h2>
  );
}

const footerLink =
  'text-cream underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-cream';

export function Footer() {
  return (
    <footer className="border-t border-cream/15">
      <Container className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Link to="/#kreu" aria-label="InternUp, kreu" className="inline-block text-cream">
            <Logo />
          </Link>
          <p className="mt-5 max-w-sm leading-relaxed text-cream/75">
            Platforma që lidh studentët me kompanitë dhe institucionet që ofrojnë praktika profesionale.
          </p>
        </div>

        <nav aria-labelledby="footer-navigimi" className="lg:col-span-2">
          <FooterHeading id="footer-navigimi">Navigimi</FooterHeading>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className={footerLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <FooterHeading>Kontakt</FooterHeading>
          <address className="mt-5 space-y-3 not-italic">
            <a href={`mailto:${contact.email}`} className={`flex items-center gap-3 ${footerLink}`}>
              <Mail aria-hidden="true" className="size-4 shrink-0" />
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone.replaceAll(' ', '')}`}
              className={`flex items-center gap-3 ${footerLink}`}
            >
              <Phone aria-hidden="true" className="size-4 shrink-0" />
              {contact.phone}
            </a>
            <p className="flex items-center gap-3">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {contact.city}
            </p>
          </address>
        </div>

        <div className="lg:col-span-2">
          <FooterHeading>Na ndiq</FooterHeading>
          <ul className="mt-5 flex gap-2">
            {socialLinks.map(({ label, href, path }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center border border-cream/25 text-cream transition-all duration-300 hover:-translate-y-1 hover:border-cream hover:bg-cream hover:text-charcoal"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
                    <path fillRule="evenodd" clipRule="evenodd" d={path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-cream/15">
        <Container className="py-6 text-sm text-cream/70">
          © {new Date().getFullYear()} InternUp. Të gjitha të drejtat e rezervuara.
        </Container>
      </div>
    </footer>
  );
}
