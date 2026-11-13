import { Link } from 'react-router';
import { CompanyMark } from '../../companies/components/CompanyLogo';
import { TextLink } from './ui/TextLink';
import { Container } from './ui/Container';
import { Reveal } from './ui/Reveal';
import { SectionHeading } from './ui/SectionHeading';
import { StatusMessage } from './ui/StatusMessage';

export function Companies({ companies }) {
  return (
    <section id="kompanite" aria-labelledby="kompanite-titull" className="py-20 lg:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="kompanite-titull"
            title="Vende ku fillon përvoja e vërtetë."
          />
          <TextLink href="/kompanite">Shiko të gjitha kompanitë</TextLink>
        </div>

        {companies.status === 'error' && (
          <StatusMessage className="mt-10 text-cream/75">
            Kompanitë nuk u ngarkuan. Provo përsëri më vonë.
          </StatusMessage>
        )}

        {companies.data && (
          <ul className="mt-14 grid grid-cols-2 gap-px bg-cream/15 p-px md:grid-cols-3 xl:grid-cols-6">
            {companies.data.map((company, index) => (
              <Reveal as="li" key={company.id} delay={index * 60} className="bg-charcoal">
                <Link
                  to={`/kompanite/${company.id}`}
                  className="group flex h-full flex-col gap-4 p-6 transition-colors duration-300 hover:bg-navy"
                >
                  <CompanyMark
                    companyId={company.id}
                    className="size-8 text-cream/70 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-cream"
                  />
                  <div>
                    <p className="font-display text-xl leading-tight font-medium">{company.name}</p>
                    <p className="mt-1 text-sm text-cream/70">{company.industry}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
