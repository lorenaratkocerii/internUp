import { useCallback, useEffect, useRef, useState } from 'react';

export function useWorkspaceData(load) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const requestId = useRef(0);

  const run = useCallback(
    (silent = false) => {
      const id = ++requestId.current;
      if (!silent) setState((previous) => ({ ...previous, status: 'loading' }));
      return load()
        .then((data) => {
          if (id === requestId.current) setState({ status: 'success', data, error: null });
        })
        .catch((error) => {
          if (id === requestId.current) setState({ status: 'error', data: null, error });
        });
    },
    [load],
  );

  useEffect(() => {
    run();
    return () => {
      requestId.current += 1;
    };
  }, [run]);

  const reload = useCallback(() => run(true), [run]);
  return { ...state, reload };
}
