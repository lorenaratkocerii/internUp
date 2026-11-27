import { sendJson } from '../../adapters/outbound/http/httpClient';

const SESSION_KEY = 'internup:auth-user';
const LEGACY_SESSION_KEY = 'internup:demo-user';

function saveSession(auth) {
  window.localStorage.setItem('internup:jwt', auth.token);
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(auth.user));
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
  window.dispatchEvent(new Event('internup:auth-change'));
  return auth.user;
}

export async function loginWithAccount(role, email, password) {
  const auth = await sendJson('POST', '/api/auth/login', { email, password });
  if (auth.user.role !== role) throw new Error('Emaili ose fjalëkalimi nuk është i saktë për këtë lloj llogarie.');
  return saveSession(auth);
}

export async function registerAccount({ role, email, password, name, profile }) {
  const auth = await sendJson('POST', '/api/auth/register', { role, email, password, name, profile });
  return saveSession(auth);
}

export function getCurrentUser() {
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
  window.localStorage.removeItem('internup:registered-users');
  window.localStorage.removeItem('internup:student-approvals');
  if (!window.localStorage.getItem('internup:jwt')) {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
  try {
    const value = window.localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function setStudentApproval(email, approved) {
  const current = getCurrentUser();
  if (current?.role !== 'student' || current.email !== String(email ?? '').trim().toLowerCase()) return;
  const next = { ...current, profile: { ...current.profile, approved } };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('internup:auth-change'));
}

export function logoutUser() {
  window.localStorage.removeItem('internup:jwt');
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
  window.dispatchEvent(new Event('internup:auth-change'));
}
