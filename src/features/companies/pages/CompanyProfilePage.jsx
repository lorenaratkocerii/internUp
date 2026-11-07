import { useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronRight, Search } from 'lucide-react';
import { ApplicationStatus, EMPTY_POSITION_FILTERS } from '../../../application/companyUseCases';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { Container } from '../../home/components/ui/Container';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { CompanyLogo } from '../components/CompanyLogo';
import { NotFoundMessage } from '../components/NotFoundMessage';
import { PositionCard } from '../components/PositionCard';
import { useFilters } from '../hooks/useCompanyFilters';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const filterFieldClasses =
  'min-h-11 w-full border border-cream/30 bg-charcoal px-3 text-base text-cream transition-colors duration-200 hover:border-cream/60';

function AboutBlock({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-cream/80">{children}</p>
    </section>
  );
}

function OpenPositions({ company, positions, useCases }) {
  const { filters, update, results } = useFilters(EMPTY_POSITION_FILTERS, positions, useCases.filterPositions);

  return (
    <section id="pozitat" aria-labelledby="pozitat-titull" className="bg-navy py-14 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="pozitat-titull" className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Pozitat e hapura
            </h2>
            <p aria-live="polite" className="mt-3 text-cream/75">
              {results.length === 1 ? '1 pozitë' : `${results.length} pozita`} te {company.name}
            </p>
          </div>

          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-[16rem_11rem]">
            <div className="relative">
              <label htmlFor="kerko-pozite" className="sr-only">
                Kërko pozitë
              </label>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cream/70"
              />
              <input
                id="kerko-pozite"
                type="search"
                value={filters.query}
                onChange={(event) => update('query', event.target.value)}
                placeholder="Kërko pozitë..."
                autoComplete="off"
                className={`${filterFieldClasses} pl-9 placeholder:text-cream/60`}
              />
            </div>
            <div>
              <label htmlFor="filtri-statusi" className="sr-only">
                Statusi
              </label>
              <select
                id="filtri-statusi"
                value={filters.status}
                onChange={(event) => update('status', event.target.value)}
                className={filterFieldClasses}
              >
                <option value="">Të gjitha statuset</option>
                {Object.values(ApplicationStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="mt-10 border-l-2 border-terracotta pl-5 text-lg text-cream/85">
            Asnjë pozitë nuk përputhet me këta filtra.
          </p>
        ) : (
          <ul className="mt-10 space-y-5">
            {results.map((position) => (
              <li key={position.id}>
                <PositionCard position={position} companyId={company.id} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

export function CompanyProfilePage({ useCases }) {
  const { companyId } = useParams();
  const load = useCallback(() => useCases.getCompanyProfile(companyId), [useCases, companyId]);
  const profile = useAsyncData(load);
  const company = profile.data?.company;

  useDocumentTitle(company?.name);

  if (profile.status === 'error') {
    return (
      <Container className="py-24">
        <StatusMessage className="text-cream/75">Profili nuk u ngarkua. Provo përsëri më vonë.</StatusMessage>
      </Container>
    );
  }
  if (profile.status === 'success' && !company) {
    return (
      <NotFoundMessage
        title="Kjo kompani nuk u gjet."
        description="Mund të jetë hequr ose lidhja mund të jetë e pasaktë."
      />
    );
  }
  if (!company) return <div className="min-h-[60vh]" />;

  const facts = [
    { label: 'Viti i themelimit', value: company.foundedYear },
    { label: 'Lokacioni', value: company.location },
    { label: 'Website', value: company.website },
    { label: 'Industria', value: company.industry },
    { label: 'Madhësia e ekipit', value: company.size },
    { label: 'Mënyra e punës', value: ({ Remote: 'Në distancë', Hybrid: 'Hibrid', 'On-site': 'Në zyrë' })[company.workMode] ?? company.workMode },
  ];

  return (
    <>
      <header className="border-b border-cream/10">
        <Container className="grid gap-10 py-8 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-14">
          <div className="relative lg:col-span-5 lg:col-start-8 lg:row-start-1">
            <img
              src={company.coverImage}
              alt={company.coverAlt}
              style={{ objectPosition: company.coverPosition }}
              className="aspect-[16/10] w-full object-cover lg:aspect-[4/3]"
            />
            <CompanyLogo
              companyId={company.id}
              className="absolute -bottom-5 left-5 size-16 border-4 border-charcoal sm:size-20"
              iconClassName="size-7 sm:size-9"
            />
          </div>

          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
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
                <li aria-current="page">{company.name}</li>
              </ol>
            </nav>

            <h1 className="mt-4 font-display text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
              {company.name}
            </h1>
            <p className="mt-4 max-w-3xl text-xl leading-relaxed text-cream/80">{company.shortDescription}</p>
          </div>
        </Container>
      </header>

      <Container className="py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-10 lg:col-span-7">
            <AboutBlock title="Rreth kompanisë">{company.description}</AboutBlock>
            <AboutBlock title={`Historia, që nga ${company.foundedYear}`}>{company.history}</AboutBlock>
            <AboutBlock title="Kultura e punës">{company.culture}</AboutBlock>
          </div>

          <aside className="self-start bg-cream p-6 text-charcoal lg:col-span-5 lg:p-8">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
              {facts.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-semibold text-mauve">{label}</dt>
                  <dd className="mt-1 text-sm font-medium break-words">{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-7 border-t border-charcoal/20 pt-6 text-sm font-semibold">Teknologjitë</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {company.technologies.map((technology) => (
                <li key={technology} className="border border-charcoal/30 px-2.5 py-1 text-xs font-medium">
                  {technology}
                </li>
              ))}
            </ul>

            <h2 className="mt-7 border-t border-charcoal/20 pt-6 text-sm font-semibold">Përfitimet</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-terracotta">
              {company.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            <p className="mt-7 border-t border-charcoal/20 pt-5 text-xs leading-relaxed text-charcoal/75">
              Kompani demonstrative. Të dhënat nuk përfaqësojnë një partner real.
            </p>
          </aside>
        </div>
      </Container>

      <OpenPositions company={company} positions={profile.data.positions} useCases={useCases} />
    </>
  );
}
