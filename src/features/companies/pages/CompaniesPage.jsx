import { useCallback, useEffect, useRef } from 'react';
import { EMPTY_COMPANY_FILTERS } from '../../../application/companyUseCases';
import { useAsyncData } from '../../home/hooks/useAsyncData';
import { Container } from '../../home/components/ui/Container';
import { StatusMessage } from '../../home/components/ui/StatusMessage';
import { CompanyCard } from '../components/CompanyCard';
import { CompanyFilters } from '../components/CompanyFilters';
import { CompanySignup } from '../components/CompanySignup';
import { Pagination } from '../components/Pagination';
import { useCompanyOptions, useFilters } from '../hooks/useCompanyFilters';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePagination } from '../hooks/usePagination';

const NO_COMPANIES = [];
const COMPANIES_PER_PAGE = 6;

export function CompaniesPage({ useCases }) {
  useDocumentTitle('Kompanitë');

  const load = useCallback(() => useCases.listCompanies(), [useCases]);
  const directory = useAsyncData(load);
  const companies = directory.data ?? NO_COMPANIES;

  const { filters, update, reset, results, hasActiveFilters } = useFilters(
    EMPTY_COMPANY_FILTERS,
    companies,
    useCases.filterCompanies,
  );
  const options = useCompanyOptions(companies);

  const { visible, page, totalPages, goToPage } = usePagination(results, {
    pageSize: COMPANIES_PER_PAGE,
    resetKey: filters,
    storageKey: 'internup:kompanite-faqja',
  });

  const resultsRef = useRef(null);
  const pageChanged = useRef(false);

  const handlePageChange = (next) => {
    pageChanged.current = true;
    goToPage(next);
  };

  useEffect(() => {
    if (!pageChanged.current) return;
    pageChanged.current = false;
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView();
  }, [page]);

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-cream/10 pt-14 pb-12 lg:pt-20 lg:pb-16">
        <img
          src="/images/companies/kreu-kompanite.jpg"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-[center_30%] grayscale"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-charcoal via-charcoal/85 to-charcoal/60"
        />
        <Container className="text-center">
          <h1 className="mx-auto max-w-3xl font-hero text-5xl leading-[1] font-bold tracking-tight sm:text-6xl">
            Gjej kompaninë ku do të fillosh.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-cream/75">
            Krahaso kompanitë sipas industrisë, lokacionit dhe mënyrës së punës, pastaj shiko pozitat që kanë të hapura.
          </p>
        </Container>
      </header>

      <Container className="grid gap-8 py-10 lg:grid-cols-12 lg:py-14">
        <aside className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
          <CompanyFilters
            filters={filters}
            options={options}
            onChange={update}
            onReset={reset}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        <div ref={resultsRef} tabIndex={-1} className="outline-none lg:col-span-9">
          {directory.status === 'error' && (
            <StatusMessage className="text-cream/75">Kompanitë nuk u ngarkuan. Provo përsëri më vonë.</StatusMessage>
          )}

          {directory.data && (
            <>
              <p aria-live="polite" className="mb-5 text-sm font-semibold text-cream/75">
                {results.length === 1 ? '1 kompani' : `${results.length} kompani`}
              </p>

              {results.length === 0 ? (
                <div className="border-l-2 border-terracotta pl-5">
                  <p className="text-lg text-cream/85">Asnjë kompani nuk përputhet me këta filtra.</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-3 min-h-11 cursor-pointer font-semibold underline underline-offset-4"
                  >
                    Pastro filtrat
                  </button>
                </div>
              ) : (
                <>
                  <ul className="grid gap-5 md:grid-cols-2">
                    {visible.map((company) => (
                      <li key={company.id}>
                        <CompanyCard company={company} />
                      </li>
                    ))}
                  </ul>

                  {totalPages > 1 && (
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onChange={handlePageChange}
                      label="Faqet e kompanive"
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </Container>

      <CompanySignup />
    </>
  );
}
