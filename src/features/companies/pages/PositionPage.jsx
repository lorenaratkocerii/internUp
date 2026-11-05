import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { Container } from '../../home/components/ui/Container';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { ApplicationForm } from '../components/ApplicationForm';
import { CompanyLogo } from '../components/CompanyLogo';
import { NotFoundMessage } from '../components/NotFoundMessage';
import { PositionFacts } from '../components/PositionFacts';
import { StatusBadge } from '../components/StatusBadge';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function PositionPage({ useCases }) {
  const { companyId, positionId } = useParams();
  const load = useCallback(() => useCases.getPosition(companyId, positionId), [useCases, companyId, positionId]);
  const result = useAsyncData(load);
  const position = result.data?.position;
  const company = result.data?.company;

  useDocumentTitle(position && `${position.title} te ${company.name}`);

  if (result.status === 'error') {
    return (
      <Container className="py-24">
        <StatusMessage className="text-cream/75">Pozita nuk u ngarkua. Provo përsëri më vonë.</StatusMessage>
      </Container>
    );
  }
  if (result.status === 'success' && !position) {
    return (
      <NotFoundMessage
        title="Kjo pozitë nuk u gjet."
        description="Mund të jetë hequr ose lidhja mund të jetë e pasaktë."
      />
    );
  }
  if (!position) return <div className="min-h-[60vh]" />;

  return (
    <Container className="py-12 lg:py-16">
      <nav aria-label="Vendndodhja në faqe">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-cream/75">
          <li>
            <Link to="/kompanite" className="underline underline-offset-4 hover:text-cream">
              Kompanitë
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li>
            <Link to={`/kompanite/${company.id}`} className="underline underline-offset-4 hover:text-cream">
              {company.name}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page">{position.title}</li>
        </ol>
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3">
            <CompanyLogo
              companyId={company.id}
              className="size-11 border border-cream/25"
              iconClassName="size-5"
            />
            <Link to={`/kompanite/${company.id}`} className="font-semibold underline-offset-4 hover:underline">
              {company.name}
            </Link>
          </div>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
            {position.title}
          </h1>
          <p className="mt-5 text-xl leading-relaxed text-cream/80">{position.description}</p>

          <h2 className="mt-10 font-display text-2xl font-medium">Përgjegjësitë</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-lg leading-relaxed text-cream/80 marker:text-terracotta">
            {position.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-2xl font-medium">Aftësitë e kërkuara</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {position.skills.map((skill) => (
              <li key={skill} className="border border-cream/30 px-3 py-1.5 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <div className="bg-cream p-6 text-charcoal lg:p-8">
            <StatusBadge status={position.status} />
            <div className="mt-5">
              <PositionFacts position={position} />
            </div>
          </div>

          <section id="apliko" aria-labelledby="apliko-titull" className="bg-cream p-6 text-charcoal lg:p-8">
            <h2 id="apliko-titull" className="mb-5 font-display text-2xl font-medium tracking-tight">
              Apliko për këtë pozitë
            </h2>
            {position.canApply ? (
              <ApplicationForm position={position} useCases={useCases} />
            ) : (
              <p role="status" className="border-l-4 border-terracotta pl-4 leading-relaxed">
                Afati i aplikimit ka përfunduar ose nuk ka më vende të lira. Kjo pozitë nuk pranon më aplikime.
              </p>
            )}
          </section>
        </div>
      </div>
    </Container>
  );
}
