import { login } from '../lib/auth.js';

const form = document.getElementById('loginForm');
const errorEl = document.getElementById('authError');
const btn = document.getElementById('loginBtn');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.add('show');
}
function clearError() {
  errorEl.classList.remove('show');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    showError('कृपया युजरनेम आणि पासवर्ड भरा.');
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ लॉगिन होत आहे...';

  const session = login(username, password);

  if (session) {
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirect');
    if (redirectTo && session.role !== 'admin') {
      window.location.href = '/' + redirectTo.replace(/^\//, '');
      return;
    }
    if (session.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/dashboard.html';
    }
  } else {
    showError('युजरनेम किंवा पासवर्ड चुकीचा आहे.');
    btn.disabled = false;
    btn.textContent = 'लॉगिन करा →';
  }
});

form.querySelectorAll('input').forEach(el => {
  el.addEventListener('input', clearError);
});
