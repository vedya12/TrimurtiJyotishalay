// Simple client-side auth helpers for development/demo only.
// Accepts username "vedant" and password "123".
// Persists session in localStorage under "trimurti_session".

const STORAGE_KEY = 'trimurti_session';

// Fake users map for demo
const FAKE_USERS = {
  vedant: { password: '123', role: 'admin', name: 'Vedant' },
  // guest: { password: 'guest', role: 'user', name: 'Guest User' }
};

export function login(username, password) {
  if (!username || !password) return null;
  const entry = FAKE_USERS[username];
  if (!entry || entry.password !== password) return null;

  const session = {
    user: username,
    name: entry.name || username,
    role: entry.role || 'user',
    token: `dev-${username}-${Date.now()}`, // demo token
    issuedAt: Date.now()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Failed to save session', err);
  }

  return session;
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch (err) {
    return null;
  }
}

export function isAuthenticated() {
  const s = getSession();
  return Boolean(s && s.user);
}

export function logout() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear session', err);
  }
}

// -----------------------------
// Attach login form handler here
// -----------------------------
const form = document.getElementById('loginForm');
const errorEl = document.getElementById('authError');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const session = login(username, password);
    if (!session) {
      errorEl.textContent = 'अवैध युजरनेम किंवा पासवर्ड';
      return;
    }

    // Redirect logic: if ?redirect=dashboard.html present, go there
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || 'dashboard.html';
    window.location.href = redirect;
  });
}
