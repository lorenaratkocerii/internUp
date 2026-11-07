import { useEffect, useMemo, useState } from 'react';
import { GUEST_VIEWER } from '../../../application/blogUseCases';
import { getDemoUser } from '../../login/demoAuth';

export function useViewer() {
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

  return useMemo(
    () =>
      user
        ? { id: `user:${user.email}`, role: user.role, email: user.email, name: user.name, profile: user.profile ?? {} }
        : GUEST_VIEWER,
    [user],
  );
}
