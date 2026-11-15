const SESSION_KEY = 'internup:admin-session';

export function createAdminSessionStore(storage = window.localStorage) {
  const clear = () => storage.removeItem(SESSION_KEY);

  const read = () => {
    try {
      const session = JSON.parse(storage.getItem(SESSION_KEY) ?? 'null');
      if (!session?.token || !(Date.parse(session.expiresAt) > Date.now())) {
        if (session) clear();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  };

  return {
    read,
    clear,
    save: ({ token, expiresAt, admin }) => storage.setItem(SESSION_KEY, JSON.stringify({ token, expiresAt, admin })),
  };
}
