import { useCallback, useEffect, useState } from 'react';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { logoutDemoUser } from '../../login/demoAuth';

const describe = (error) =>
  Object.values(error?.details ?? {}).join(' ') || error?.message || 'Ndryshimi nuk u ruajt. Provo përsëri.';

function endSessionIfExpired(error) {
  if (error?.name === 'AdminSessionExpiredError') logoutDemoUser();
}

export function useAdminHome(useCases) {
  const actor = useCurrentActor();
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [flash, setFlash] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!actor) return undefined;
    let isCurrent = true;

    useCases
      .getHomeContent(actor)
      .then((data) => {
        if (isCurrent) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        endSessionIfExpired(error);
        if (isCurrent) setState({ status: 'error', data: null, error });
      });

    return () => {
      isCurrent = false;
    };
  }, [useCases, actor]);

  useEffect(() => {
    if (flash?.tone !== 'success') return undefined;
    const timer = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(timer);
  }, [flash]);

  const change = useCallback(async (section, request, message) => {
    setBusy(true);
    setFlash(null);
    try {
      const items = await request();
      setState((previous) => (previous.data ? { ...previous, data: { ...previous.data, [section]: items } } : previous));
      setFlash({ tone: 'success', message });
      return true;
    } catch (error) {
      endSessionIfExpired(error);
      setFlash({ tone: 'error', message: describe(error) });
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  return { actor, ...state, flash, busy, change };
}
