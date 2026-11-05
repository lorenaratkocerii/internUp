import { useCallback, useMemo, useState } from 'react';

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'sq'));
}

export function useFilters(emptyFilters, items, applyFilters) {
  const [filters, setFilters] = useState(emptyFilters);

  const update = useCallback((field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  }, []);
  const reset = useCallback(() => setFilters(emptyFilters), [emptyFilters]);

  const results = useMemo(() => applyFilters(items, filters), [applyFilters, items, filters]);
  const hasActiveFilters = Object.keys(emptyFilters).some((key) => filters[key] !== emptyFilters[key]);

  return { filters, update, reset, results, hasActiveFilters };
}

export function useCompanyOptions(companies) {
  return useMemo(
    () => ({
      industries: uniqueSorted(companies.map((company) => company.industry)),
      locations: uniqueSorted(companies.map((company) => company.location)),
      workModes: uniqueSorted(companies.map((company) => company.workMode)),
      sizes: [...new Set(companies.map((company) => company.size))].sort((a, b) => parseInt(a, 10) - parseInt(b, 10)),
    }),
    [companies],
  );
}
