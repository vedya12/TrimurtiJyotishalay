// index.html is a pure landing page — this script only toggles the
// navbar between guest (Login/Register) and logged-in (Dashboard/Logout) states.
import { isLoggedIn, getSession, logout } from '../lib/auth.js';

const loggedIn = isLoggedIn();
const session = loggedIn ? getSession() : null;

const navGuest = document.getElementById('navAuthGuest');
const navUser = document.getElementById('navAuthUser');
const navUserName = document.getElementById('navUserName');
const navLogoutBtn = document.getElementById('navLogoutBtn');

if (loggedIn) {
  if (navGuest) navGuest.style.display = 'none';
  if (navUser) navUser.style.display = '';
  if (navUserName) navUserName.textContent = session?.name || session?.user || '';
  if (navLogoutBtn) navLogoutBtn.addEventListener('click', () => logout());
} else {
  if (navGuest) navGuest.style.display = '';
  if (navUser) navUser.style.display = 'none';
}