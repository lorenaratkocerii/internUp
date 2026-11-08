import { useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { EMPTY_UNIVERSITY_FILTERS, UniversityType } from '../../../application/universityUseCases';
import { useFilters } from '../../companies/hooks/useCompanyFilters';
import { useDocumentTitle } from '../../companies/hooks/useDocumentTitle';
import { ButtonLink } from '../../home/components/ui/Button';
import { Container } from '../../home/components/ui/Container';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { CampusStrip } from '../components/CampusStrip';
import { UniversityCard } from '../components/UniversityCard';

const NO_UNIVERSITIES = [];

const TYPE_TABS = [
  { value: '', label: 'Të gjitha' },
  { value: UniversityType.PUBLIC, label: 'Publike' },
  { value: UniversityType.PRIVATE, label: 'Private' },
];

const GROUPS = [
  { type: UniversityType.PUBLIC, title: 'Universitetet publike' },
  { type: UniversityType.PRIVATE, title: 'Kolegjet dhe universitetet private' },
];

const VERIFICATION_TEXT =
  'Studenti zgjedh universitetin nga paneli i vet dhe shkruan numrin e indeksit dhe email-in universitar. ' +
  'Përfaqësuesi i universitetit i kontrollon në regjistër dhe e pranon ose e refuzon kërkesën. ' +
  'Pasi pranohet, studenti del në faqen e universitetit.';

const fieldClasses =
  'min-h-12 w-full rounded-xl border border-cream/30 bg-charcoal px-4 text-base text-cream transition-colors duration-200 hover:border-cream/60';

function Toolbar({ filters, update, reset, hasActiveFilters, cities }) {
  return (
    <form
      role="search"
      aria-label="Filtro universitetet"
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col gap-3 border-b border-cream/10 pb-6 lg:flex-row lg:items-center"
    >
      <div role="radiogroup" aria-label="Lloji" className="flex shrink-0 gap-1 rounded-xl border border-cream/30 p-1">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            role="radio"
            aria-checked={filters.type === tab.value}
            onClick={() => update('type', tab.value)}
            className={`min-h-10 flex-1 cursor-pointer rounded-lg px-4 text-sm font-semibold transition-colors lg:flex-none ${
              filters.type === tab.value ? 'bg-cream text-charcoal' : 'text-cream/75 hover:bg-cream/10 hover:text-cream'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <label htmlFor="kerko-universitet" className="sr-only">
          Kërko universitet
        </label>
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cream/70" />
        <input
          id="kerko-universitet"
          type="search"
          value={filters.query}
          onChange={(event) => update('query', event.target.value)}
          placeholder="Kërko me emër, p.sh. UBT ose Hasan Prishtina"
          autoComplete="off"
          className={`${fieldClasses} pl-9 placeholder:text-cream/50`}
        />
      </div>

      <div className="flex gap-3">
        <label htmlFor="filtri-qyteti" className="sr-only">
          Qyteti
        </label>
        <select
          id="filtri-qyteti"
          value={filters.city}
          onChange={(event) => update('city', event.target.value)}
          className={`${fieldClasses} lg:w-48`}
        >
          <option value="">Të gjitha qytetet</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={reset}
            aria-label="Pastro filtrat"
            className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-xl border border-cream/30 text-cream hover:bg-cream/10"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
}

export function UniversitiesPage({ useCases }) {
  useDocumentTitle('Universitetet');

  const load = useCallback(() => useCases.listUniversities(), [useCases]);
  const directory = useAsyncData(load);
  const universities = directory.data ?? NO_UNIVERSITIES;

  const { filters, update, reset, results, hasActiveFilters } = useFilters(
    EMPTY_UNIVERSITY_FILTERS,
    universities,
    useCases.filterUniversities,
  );

  const cities = useMemo(
    () => [...new Set(universities.map((university) => university.city))].sort((a, b) => a.localeCompare(b, 'sq')),
    [universities],
  );

  return (
    <>
      <header className="border-b border-cream/10 pt-12 pb-10 lg:pt-16 lg:pb-14">
        <Container>
          <h1 className="mx-auto max-w-3xl text-center font-display text-3xl leading-[1.08] font-medium tracking-tight sm:text-5xl">
            Universitetet dhe kolegjet e Kosovës në InternUp.
          </h1>
        </Container>

        {directory.status !== 'error' && (
          <div className="mt-10">
            <CampusStrip universities={universities} loading={!directory.data} />
          </div>
        )}
      </header>

      <Container className="py-10 lg:py-14">
        <Toolbar filters={filters} update={update} reset={reset} hasActiveFilters={hasActiveFilters} cities={cities} />

        {directory.status === 'error' && (
          <StatusMessage className="mt-8 text-cream/75">Universitetet nuk u ngarkuan. Provo përsëri më vonë.</StatusMessage>
        )}

        {!directory.data && directory.status !== 'error' && (
          <ul aria-hidden="true" className="mt-10 grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index} className="min-h-72 rounded-2xl bg-cream/[0.06]" />
            ))}
          </ul>
        )}

        {directory.data && (
          <div aria-live="polite">
            {results.length === 0 ? (
              <div className="mt-10 border-l-2 border-terracotta pl-5">
                <p className="text-lg text-cream/85">Asnjë universitet nuk përputhet me këtë kërkim.</p>
                <button type="button" onClick={reset} className="mt-3 min-h-11 cursor-pointer font-semibold underline underline-offset-4">
                  Pastro filtrat
                </button>
              </div>
            ) : (
              GROUPS.map((group) => {
                const items = results.filter((university) => university.type === group.type);
                if (items.length === 0) return null;
                return (
                  <section key={group.type} aria-labelledby={`grupi-${group.type}`} className="mt-14 first:mt-10">
                    <h2 id={`grupi-${group.type}`} className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
                      {group.title} <span className="font-sans text-lg font-normal text-cream/45">{items.length}</span>
                    </h2>
                    <ul className="mt-6 grid gap-6 lg:grid-cols-2">
                      {items.map((university) => (
                        <li key={university.id}>
                          <UniversityCard university={university} />
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })
            )}
          </div>
        )}
      </Container>

      <section aria-labelledby="verifikimi-titull" className="bg-navy py-12 lg:py-16">
        <Container className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <h2 id="verifikimi-titull" className="font-display text-3xl font-medium tracking-tight">
              Si verifikohet një student
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-cream/80">{VERIFICATION_TEXT}</p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-sm text-cream/70">Përfaqëson një universitet?</p>
            <ButtonLink href="/hyr/universitet" className="mt-3">
              Hyr si universitet
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
