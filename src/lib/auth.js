// Unified auth library for Trimurti Jyotishalay
// Uses same storage key and session format as auth-login.js

const STORAGE_KEY = 'trimurti_session';

const DEMO_USERS = [
  { username: 'vedant', password: '123', role: 'admin', full_name: 'Vedant' },
  // { username: 'guest', password: 'guest', role: 'user', full_name: 'Guest User' }
];

export function login(username, password) {
  const user = DEMO_USERS.find(u => u.username === username && u.password === password);
  if (!user) return null;

  const session = {
    user: user.username,
    name: user.full_name,
    role: user.role,
    token: `dev-${user.username}-${Date.now()}`,
    issuedAt: Date.now()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  const s = getSession();
  return Boolean(s && s.user);
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = 'login.html';
}
