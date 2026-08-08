import { isLoggedIn } from '../lib/auth.js';

if (!isLoggedIn()) {
  window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
}
