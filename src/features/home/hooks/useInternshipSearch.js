import { useCallback, useState } from 'react';
import { useAsyncData } from './useAsyncData';

const EMPTY_CRITERIA = { position: '', location: '' };

export function useInternshipSearch(searchInternships) {
  const [draft, setDraft] = useState(EMPTY_CRITERIA);
  const [applied, setApplied] = useState(EMPTY_CRITERIA);

  const load = useCallback(() => searchInternships(applied), [searchInternships, applied]);
  const results = useAsyncData(load);

  const updateField = useCallback((field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const apply = useCallback((criteria) => {
    const trimmed = { position: criteria.position.trim(), location: criteria.location.trim() };
    setDraft(trimmed);
    setApplied(trimmed);
  }, []);

  const reset = useCallback(() => apply(EMPTY_CRITERIA), [apply]);

  return {
    draft,
    applied,
    results,
    isSearching: Boolean(applied.position || applied.location),
    updateField,
    apply,
    reset,
  };
}
