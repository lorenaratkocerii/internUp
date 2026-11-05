import { useCallback, useEffect, useState } from 'react';
import { useNavigationType } from 'react-router';

function readPage(storageKey) {
  try {
    const stored = Number(sessionStorage.getItem(storageKey));
    return stored > 0 ? stored : 1;
  } catch {
    return 1;
  }
}

function writePage(storageKey, page) {
  try {
    sessionStorage.setItem(storageKey, String(page));
  } catch {
    return;
  }
}

export function usePagination(items, { pageSize, resetKey, storageKey }) {
  const navigationType = useNavigationType();
  const [state, setState] = useState(() => ({
    resetKey,
    page: navigationType === 'POP' ? readPage(storageKey) : 1,
  }));

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(state.resetKey === resetKey ? state.page : 1, totalPages);

  useEffect(() => writePage(storageKey, page), [storageKey, page]);

  const goToPage = useCallback((next) => setState({ resetKey, page: next }), [resetKey]);

  return {
    visible: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    totalPages,
    goToPage,
  };
}
