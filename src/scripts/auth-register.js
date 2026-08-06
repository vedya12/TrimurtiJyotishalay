import { supabase } from '../lib/supabase.js';

const form = document.getElementById('registerForm');
const errorEl = document.getElementById('authError');
const btn = document.getElementById('registerBtn');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.add('show');
}
function clearError() {
  errorEl.classList.remove('show');
}

function usernameToEmail(username) {
  return `${username.toLowerCase()}@trimurti.app`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const fullName = document.getElementById('regName').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!fullName || fullName.length < 2) {
    showError('कृपया योग्य नाव प्रविष्ट करा.');
    return;
  }
  if (!username || username.length < 3) {
    showError('युजरनेम किमान ३ अक्षरे लांब असावा.');
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showError('युजरनेममध्ये फक्त अक्षरे, अंक आणि _ वापरा.');
    return;
  }
  const phoneClean = phone.replace(/\s|-/g, '');
  if (!/^[6-9]\d{9}$/.test(phoneClean)) {
    showError('कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा.');
    return;
  }
  if (password.length < 6) {
    showError('पासवर्ड किमान ६ अक्षरे लांब असावा.');
    return;
  }

  btn.disabled = true;
  btn.textContent = '⏳ खाते तयार होत आहे...';

  try {
    const email = usernameToEmail(username);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phoneClean,
          username: username.toLowerCase()
        }
      }
    });
    if (error) throw error;

    await supabase.auth.signInWithPassword({ email, password });
    window.location.href = '/dashboard.html';
  } catch (err) {
    let msg = 'नोंदणी अयशस्वी. कृपया पुन्हा प्रयत्न करा.';
    if (err.message?.includes('already registered') || err.message?.includes('already been registered')) {
      msg = 'हा युजरनेम आधीच नोंदणी झालेला आहे. कृपया लॉगिन करा.';
    } else if (err.message?.includes('password')) {
      msg = 'पासवर्ड खूप कमकुवत आहे. कृपया मजबूत पासवर्ड वापरा.';
    }
    showError(msg);
    btn.disabled = false;
    btn.textContent = 'खाते तयार करा →';
  }
});

form.querySelectorAll('input').forEach(el => {
  el.addEventListener('input', clearError);
});
