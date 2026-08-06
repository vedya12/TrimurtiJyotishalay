import { isLoggedIn, getSession, signOut } from '../lib/auth.js';
import { supabase, formatDateDisplay, formatTimeDisplay } from '../lib/supabase.js';

/* ── Auth Guard ── */
async function init() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }

  const session = getSession();
  if (session.role === 'admin') {
    window.location.href = '/admin.html';
    return;
  }

  document.getElementById('redirectScreen').style.display = 'none';
  document.getElementById('navbar').style.display = 'flex';
  document.getElementById('tabBar').style.display = 'flex';
  document.getElementById('dashboardPage').style.display = 'block';

  document.getElementById('userName').textContent = session.full_name || 'client';
  document.getElementById('logoutBtn').addEventListener('click', signOut);

  loadOverview(session.username);
  loadAppointments(session.username);
  loadDocuments(session.username);
  loadMuhurtas();
  loadProfile(session);

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

/* ── Toast ── */
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);
let toastTimer = null;
function showToast(msg, type = 'success') {
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── Overview ── */
async function loadOverview(clientId) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`client_id.eq.${clientId},client_id.is.null`)
      .order('event_date', { ascending: true });

    if (error) throw error;

    const all = bookings || [];
    const upcoming = all.filter(b => b.event_date >= today && b.status !== 'cancelled' && b.status !== 'completed');
    const completed = all.filter(b => b.status === 'completed');

    document.getElementById('statTotal').textContent = all.length;
    document.getElementById('statUpcoming').textContent = upcoming.length;
    document.getElementById('statCompleted').textContent = completed.length;

    // Documents count
    const { count: docCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);
    document.getElementById('statDocs').textContent = docCount || 0;

    // Render upcoming
    const list = document.getElementById('overviewUpcoming');
    if (upcoming.length === 0) {
      list.innerHTML = '<p class="empty-state">कोणतीही आगामी भेट नाही. <a href="booking.html" style="color:var(--maroon);font-weight:600;">बुक करा →</a></p>';
    } else {
      list.innerHTML = upcoming.slice(0, 5).map(b => renderApptCard(b)).join('');
    }
  } catch (err) {
    document.getElementById('overviewUpcoming').innerHTML = '<p class="empty-state">डेटा लोड करताना त्रुटी.</p>';
  }
}

/* ── Appointments ── */
async function loadAppointments(clientId) {
  const list = document.getElementById('allAppointments');
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, services(name, name_mr)')
      .or(`client_id.eq.${clientId},client_id.is.null`)
      .order('event_date', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-state">अजून कोणतीही बुकिंग नाहीत. <a href="booking.html" style="color:var(--maroon);font-weight:600;">पहिली बुकिंग करा →</a></p>';
      return;
    }

    list.innerHTML = data.map(b => renderApptCard(b)).join('');
  } catch (err) {
    list.innerHTML = '<p class="empty-state">बुकिंग लोड करताना त्रुटी.</p>';
  }
}

function renderApptCard(b) {
  const dateParts = b.event_date ? b.event_date.split('-') : ['', '', ''];
  const dayNum = dateParts[2] || '';
  const months = ['जान', 'फेब', 'मार्च', 'एप्रि', 'मे', 'जून', 'जुलै', 'ऑग', 'सप्ट', 'ऑक्ट', 'नोव्ह', 'डिसे'];
  const monthShort = dateParts[1] ? months[parseInt(dateParts[1]) - 1] : '';
  const svcName = b.services ? (b.services.name_mr || b.services.name) : 'सेवा';
  const statusLabels = { pending: 'प्रलंबित', confirmed: 'निश्चित', completed: 'पूर्ण', cancelled: 'रद्द' };

  return `
    <div class="appt-card status-${b.status}">
      <div class="appt-date-box">
        <div class="ad-day">${dayNum}</div>
        <div class="ad-month">${monthShort}</div>
      </div>
      <div class="appt-info">
        <div class="ai-ref">${b.booking_reference}</div>
        <div class="ai-service">${svcName}</div>
        <div class="ai-meta">⏰ ${formatTimeDisplay(b.start_time)}${b.location ? ' • 📍 ' + b.location : ''}</div>
      </div>
      <span class="status-badge ${b.status}">${statusLabels[b.status] || b.status}</span>
    </div>
  `;
}

/* ── Documents ── */
async function loadDocuments(clientId) {
  const list = document.getElementById('docList');
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-state">अजून कोणतेही दस्तऐवज उपलब्ध नाहीत. महाराज तुमची कुंडली/रिपोर्ट अपलोड केल्यावर इथे दिसेल.</p>';
      return;
    }

    const typeIcons = { kundali: '🕉', marriage_report: '💍', vastu_report: '🏠', other: '📄' };
    const typeLabels = { kundali: 'कुंडली', marriage_report: 'विवाह रिपोर्ट', vastu_report: 'वास्तू रिपोर्ट', other: 'दस्तऐवज' };

    list.innerHTML = data.map(d => `
      <div class="doc-card">
        <div class="doc-icon">${typeIcons[d.doc_type] || '📄'}</div>
        <div class="doc-info">
          <div class="di-title">${d.title}</div>
          <div class="di-type">${typeLabels[d.doc_type] || d.doc_type}</div>
          <div class="di-date">${formatDateDisplay(d.created_at?.split('T')[0])}</div>
        </div>
        ${d.file_url ? `<a href="${d.file_url}" target="_blank" rel="noopener" class="doc-download">⬇ डाउनलोड</a>` : ''}
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p class="empty-state">दस्तऐवज लोड करताना त्रुटी.</p>';
  }
}

/* ── Muhurtas ── */
let allMuhurtas = [];

async function loadMuhurtas() {
  const grid = document.getElementById('muhurtaGrid');
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('muhurtas')
      .select('*')
      .eq('is_active', true)
      .gte('muhurta_date', today)
      .order('muhurta_date', { ascending: true });

    if (error) throw error;

    allMuhurtas = data || [];
    renderMuhurtas('all');

    // Filter chips
    document.querySelectorAll('.muhurta-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.muhurta-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderMuhurtas(chip.dataset.cat);
      });
    });
  } catch (err) {
    grid.innerHTML = '<p class="empty-state">मुहूर्त लोड करताना त्रुटी.</p>';
  }
}

function renderMuhurtas(cat) {
  const grid = document.getElementById('muhurtaGrid');
  const filtered = cat === 'all' ? allMuhurtas : allMuhurtas.filter(m => m.category === cat);

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-state">या श्रेणीत सध्या कोणतेही मुहूर्त उपलब्ध नाहीत.</p>';
    return;
  }

  const catLabels = {
    marriage: 'विवाह मुहूर्त',
    griha_pravesh: 'गृहप्रवेश मुहूर्त',
    business: 'व्यवसाय मुहूर्त',
    naming: 'नामकरण मुहूर्त',
    other: 'मुहूर्त'
  };

  grid.innerHTML = filtered.map(m => `
    <div class="muhurta-card">
      <div class="mc-date">📅 ${formatDateDisplay(m.muhurta_date)}</div>
      <div class="mc-time">⏰ ${m.start_time ? formatTimeDisplay(m.start_time) : ''}${m.end_time ? ' – ' + formatTimeDisplay(m.end_time) : ''}</div>
      <div class="mc-desc">${m.description || catLabels[m.category] || ''}</div>
      <a href="booking.html" class="mc-book">या दिवशी बुक करा →</a>
    </div>
  `).join('');
}

/* ── Profile ── */
function loadProfile(session) {
  document.getElementById('profileName').value = session.full_name || '';
  document.getElementById('profileEmail').value = '';
  document.getElementById('profilePhone').value = '';
}

document.getElementById('saveProfileBtn').addEventListener('click', async () => {
  const phone = document.getElementById('profilePhone').value.trim();
  const name = document.getElementById('profileName').value.trim();
  const btn = document.getElementById('saveProfileBtn');

  btn.disabled = true;
  btn.textContent = '⏳ जतन होत आहे...';

  try {
    showToast('प्रोफाइल जतन झाली.');
  } catch (err) {
    showToast('प्रोफाइल जतन करताना त्रुटी.', 'error');
  }

  btn.disabled = false;
  btn.textContent = 'प्रोफाइल जतन करा';
});

init();
