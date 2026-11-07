import { useEffect, useMemo, useState } from 'react';
import { createActor } from '../../domain/auth/accessControl';
import { getDemoUser } from '../login/demoAuth';

export function useCurrentActor() {
  const [user, setUser] = useState(() => getDemoUser());

  useEffect(() => {
    const sync = () => setUser(getDemoUser());
    window.addEventListener('internup:auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('internup:auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return useMemo(() => createActor(user), [user]);
}
