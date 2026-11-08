import { useEffect, useRef } from 'react';
import { CallToAction } from '../components/CallToAction';
import { Companies } from '../components/Companies';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { OurStory } from '../components/OurStory';
import { SearchResults } from '../components/SearchResults';
import { Statistics } from '../components/Statistics';
import { Universities } from '../components/Universities';
import { useAsyncData } from '../hooks/useAsyncData';
import { useInternshipSearch } from '../hooks/useInternshipSearch';

const NO_OPTIONS = { positions: [], locations: [] };

export function HomePage({ useCases, universityUseCases }) {
  const stats = useAsyncData(useCases.getPlatformStats);
  const companies = useAsyncData(useCases.getPartnerCompanies);
  const searchOptions = useAsyncData(useCases.getSearchOptions);
  const search = useInternshipSearch(useCases.searchInternships);
  const resultsHeadingRef = useRef(null);
  const { applied, draft, isSearching } = search;

  useEffect(() => {
    if (!isSearching) return;
    document.getElementById('rezultatet')?.scrollIntoView();
    resultsHeadingRef.current?.focus({ preventScroll: true });
  }, [applied, isSearching]);

  const handleReset = () => {
    search.reset();
    document.getElementById('kerko-pozita')?.focus();
  };

  return (
    <>
      <Hero
        draft={draft}
        options={searchOptions.data ?? NO_OPTIONS}
        filterOptions={useCases.filterSearchOptions}
        onFieldChange={search.updateField}
        onSearch={search.apply}
      />
      {isSearching && (
        <SearchResults
          headingRef={resultsHeadingRef}
          results={search.results}
          applied={applied}
          onReset={handleReset}
        />
      )}
      <Statistics stats={stats} />
      <HowItWorks />
      <OurStory />
      <Companies companies={companies} />
      <Universities useCases={universityUseCases} />
      <CallToAction />
    </>
  );
}
