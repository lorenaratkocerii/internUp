import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { Container } from '../../home/components/ui/Container';
import { signupRoles } from '../roles';

export function SignupPage() {
  useDocumentTitle('Krijo llogari');

  return (
    <Container className="py-16 lg:py-24">
      <p className="text-sm font-semibold tracking-[0.18em] text-cream/70 uppercase">Krijo llogari</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
        {'Si dëshironi të regjistroheni?'}
      </h1>

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {signupRoles.map(({ id, title, description, action, icon: Icon, colorClass, href }) => (
          <li key={id}>
            <Link
              to={href}
              className={`group flex h-full min-h-80 flex-col p-8 text-cream transition-transform duration-300 motion-safe:hover:-translate-y-1 ${colorClass}`}
            >
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-12" />
              <h2 className="mt-8 font-display text-3xl font-medium tracking-tight">{title}</h2>
              <p className="mt-3 leading-relaxed text-cream/85">{description}</p>
              <span className="mt-auto flex items-center gap-3 pt-8 font-semibold">
                {action}
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
