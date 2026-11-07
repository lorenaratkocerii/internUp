const DEMO_ACCOUNTS = [
  {
    role: 'student',
    title: 'Student',
    email: 'student@internup.test',
    password: 'Student123!',
  },
  {
    role: 'universitet',
    title: 'Universitet',
    email: 'universitet@internup.test',
    password: 'Universitet123!',
  },
  {
    role: 'kompani',
    title: 'Kompani',
    email: 'kompani@internup.test',
    password: 'Kompani123!',
    name: 'Kodra Labs',
    profile: { companyId: 'kodra-labs', name: 'Kodra Labs' },
  },
];

const SESSION_KEY = 'internup:demo-user';
const REGISTERED_KEY = 'internup:registered-users';

function getRegisteredAccounts() {
  try {
    return JSON.parse(window.localStorage.getItem(REGISTERED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function setDemoUser(account) {
  const user = {
    role: account.role,
    title: account.title,
    email: account.email,
    name: account.name ?? '',
    profile: account.profile ?? {},
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('internup:auth-change'));
  return user;
}

export function getDemoAccount(role) {
  return DEMO_ACCOUNTS.find((account) => account.role === role);
}

export function loginWithDemoAccount(role, email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = [...DEMO_ACCOUNTS, ...getRegisteredAccounts()].find(
    (item) => item.role === role && item.email === normalizedEmail && item.password === password,
  );
  return account ? setDemoUser(account) : null;
}

export function registerDemoAccount({ role, title, email, password, name, profile }) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();
  const emailExists = [...DEMO_ACCOUNTS, ...accounts].some((item) => item.email === normalizedEmail);
  if (emailExists) return { error: 'Ky email është regjistruar tashmë.' };

  const account = { role, title, email: normalizedEmail, password, name, profile };
  window.localStorage.setItem(REGISTERED_KEY, JSON.stringify([...accounts, account]));
  return { user: setDemoUser(account) };
}

export function getDemoUser() {
  try {
    const value = window.localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function logoutDemoUser() {
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('internup:auth-change'));
}
