import { useEffect, useState } from 'react';

export function useAsyncData(load) {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let isCurrent = true;
    setState((previous) => ({ ...previous, status: 'loading' }));

    load()
      .then((data) => {
        if (isCurrent) setState({ status: 'success', data });
      })
      .catch(() => {
        if (isCurrent) setState({ status: 'error', data: null });
      });

    return () => {
      isCurrent = false;
    };
  }, [load]);

  return state;
}
