import { isLoggedIn } from '../lib/auth.js';

if (isLoggedIn()) {
  document.querySelectorAll('.kc-gated-section').forEach(el => el.style.display = '');
  document.querySelectorAll('.kc-gated[data-real-href]').forEach(a => {
    a.href = a.dataset.realHref;
  });
  const gateBanner = document.getElementById('kcLoginGate');
  if (gateBanner) gateBanner.style.display = 'none';
} else {
  document.querySelectorAll('.kc-gated-section').forEach(el => el.style.display = 'none');
  const gateBanner = document.getElementById('kcLoginGate');
  if (gateBanner) gateBanner.style.display = 'block';
}
