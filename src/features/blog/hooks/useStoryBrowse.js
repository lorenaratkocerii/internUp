import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { DateOrder } from '../../../application/blogUseCases';
import { isKnownCategory } from '../../../domain/blog/storyTaxonomy';

const CATEGORY_PARAM = 'kategoria';
const ORDER_PARAM = 'rendit';

export function useStoryBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get(CATEGORY_PARAM) ?? '';
  const rawOrder = searchParams.get(ORDER_PARAM);

  const browse = useMemo(
    () => ({
      category: isKnownCategory(rawCategory) ? rawCategory : '',
      order: rawOrder === DateOrder.OLDEST ? DateOrder.OLDEST : DateOrder.NEWEST,
    }),
    [rawCategory, rawOrder],
  );

  const setParam = useCallback(
    (param, value, fallback) =>
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value && value !== fallback) next.set(param, value);
          else next.delete(param);
          return next;
        },
        { replace: true, preventScrollReset: true },
      ),
    [setSearchParams],
  );

  const setCategory = useCallback((category) => setParam(CATEGORY_PARAM, category, ''), [setParam]);
  const setOrder = useCallback((order) => setParam(ORDER_PARAM, order, DateOrder.NEWEST), [setParam]);

  return { browse, setCategory, setOrder };
}
