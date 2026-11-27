import { useEffect, useMemo, useState } from 'react';
import { createActor } from '../../domain/auth/accessControl';
import { getCurrentUser } from '../login/authSession';

export function useCurrentActor() {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    window.addEventListener('internup:auth-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('internup:auth-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return useMemo(() => createActor(user), [user]);
}
