import { supabase, getUserProfile } from '../lib/supabase.js';

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

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showError('कृपया ईमेल आणि पासवर्ड भरा.');
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ लॉगिन होत आहे...';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Check role and redirect
    const profile = await getUserProfile();
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirect');
    if (redirectTo && profile?.role !== 'admin') {
      window.location.href = '/' + redirectTo.replace(/^\//, '');
      return;
    }
    if (profile?.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/dashboard.html';
    }
  } catch (err) {
    let msg = 'लॉगिन अयशस्वी. कृपया पुन्हा प्रयत्न करा.';
    if (err.message?.includes('Invalid login')) {
      msg = 'ईमेल किंवा पासवर्ड चुकीचा आहे.';
    } else if (err.message?.includes('Email not confirmed')) {
      msg = 'ईमेल अजून प्रमाणित झालेला नाही.';
    }
    showError(msg);
    btn.disabled = false;
    btn.textContent = 'लॉगिन करा →';
  }
});

form.querySelectorAll('input').forEach(el => {
  el.addEventListener('input', clearError);
});
