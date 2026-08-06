const DEMO_USERS = [
  { username: 'vedant', password: '123', role: 'admin', full_name: 'Vedant' },
];

const SESSION_KEY = 'tj_session';

export function login(username, password) {
  const user = DEMO_USERS.find(u => u.username === username && u.password === password);
  if (!user) return null;
  const session = { username: user.username, role: user.role, full_name: user.full_name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return getSession() !== null;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = '/';
}
