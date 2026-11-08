import { useCallback, useMemo } from 'react';
import { useAsyncData } from '../../home/hooks/useAsyncData';

const EMPTY = [];
const noUniversities = () => Promise.resolve(EMPTY);

export function useUniversityDirectory(useCases) {
  const load = useCallback(() => (useCases ? useCases.listUniversities() : noUniversities()), [useCases]);
  const { data } = useAsyncData(load);
  const universities = data ?? EMPTY;

  const findByName = useCallback(
    (label) => (useCases && label ? useCases.findByName(universities, label) : null),
    [useCases, universities],
  );

  return { universities, findByName };
}

export function useUniversityOptions(useCases, fallback, currentValue = '') {
  const { universities } = useUniversityDirectory(useCases);
  return useMemo(() => {
    if (universities.length === 0) return fallback;
    const names = universities.map((university) => university.shortName).sort((a, b) => a.localeCompare(b, 'sq'));
    const extra = currentValue && currentValue !== 'Tjetër' && !names.includes(currentValue) ? [currentValue] : [];
    return [...names, ...extra, 'Tjetër'];
  }, [universities, fallback, currentValue]);
}
