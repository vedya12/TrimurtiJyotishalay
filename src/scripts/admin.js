import { supabase, getCurrentUser, getUserProfile, isAdmin, signOut, formatDateDisplay, formatTimeDisplay, WHATSAPP_NUMBER } from '../lib/supabase.js';

/* ── State ── */
let adminCalMonth = new Date();
adminCalMonth.setDate(1);
let calBookings = {};
let calEvents = {};
let calBlocked = new Set();
let currentBookings = [];

const MONTH_NAMES_MR = [
  'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
];
const DAY_NAMES_MR = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

const STATUS_LABELS = {
  pending: 'प्रलंबित',
  confirmed: 'निश्चित',
  completed: 'पूर्ण',
  cancelled: 'रद्द'
};

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

/* ── Tab Switching ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

/* ═══════════════════════════════════════════════════════
   CALENDAR TAB
   ═══════════════════════════════════════════════════════ */
async function loadCalendarData() {
  const year = adminCalMonth.getFullYear();
  const month = adminCalMonth.getMonth();
  const startDate = new Date(year, month, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

  try {
    const [bookingsRes, eventsRes, blockedRes] = await Promise.all([
      supabase.from('bookings').select('*').gte('event_date', startDate).lte('event_date', endDate).neq('status', 'cancelled'),
      supabase.from('events').select('*').gte('event_date', startDate).lte('event_date', endDate),
      supabase.from('blocked_dates').select('*').gte('block_date', startDate).lte('block_date', endDate)
    ]);

    calBookings = {};
    if (bookingsRes.data) {
      bookingsRes.data.forEach(b => {
        if (!calBookings[b.event_date]) calBookings[b.event_date] = [];
        calBookings[b.event_date].push(b);
      });
    }

    calEvents = {};
    if (eventsRes.data) {
      eventsRes.data.forEach(ev => {
        if (!calEvents[ev.event_date]) calEvents[ev.event_date] = [];
        calEvents[ev.event_date].push(ev);
      });
    }

    calBlocked = new Set();
    if (blockedRes.data) {
      blockedRes.data.forEach(b => calBlocked.add(b.block_date));
    }

    renderAdminCalendar();
  } catch (err) {
    showToast('कॅलेंडर डेटा लोड करताना त्रुटी.', 'error');
  }
}

function renderAdminCalendar() {
  const year = adminCalMonth.getFullYear();
  const month = adminCalMonth.getMonth();
  document.getElementById('adminMonthLabel').textContent = `${MONTH_NAMES_MR[month]} ${year}`;

  const grid = document.getElementById('adminCalendarGrid');
  grid.innerHTML = '';

  DAY_NAMES_MR.forEach(dn => {
    const el = document.createElement('div');
    el.className = 'cal-day-name';
    el.textContent = dn;
    grid.appendChild(el);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(year, month, d);
    dateObj.setHours(0, 0, 0, 0);

    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    el.dataset.date = dateStr;

    const hasBooking = calBookings[dateStr] && calBookings[dateStr].length > 0;
    const hasEvent = calEvents[dateStr] && calEvents[dateStr].length > 0;
    const hasBlocked = calBlocked.has(dateStr);

    if (hasBooking && hasEvent) {
      el.classList.add('has-both');
    } else if (hasBooking) {
      el.classList.add('has-booking');
    } else if (hasEvent) {
      el.classList.add('has-event');
    } else if (hasBlocked) {
      el.classList.add('has-blocked');
    }

    if (hasBooking || hasEvent || hasBlocked) {
      const count = (calBookings[dateStr]?.length || 0) + (calEvents[dateStr]?.length || 0);
      if (count > 0) {
        const countEl = document.createElement('span');
        countEl.className = 'cal-day-count';
        countEl.textContent = `${count}↓`;
        el.appendChild(countEl);
      }
      el.addEventListener('click', () => showDayDetail(dateStr));
    }

    if (dateObj.getTime() === today.getTime()) {
      el.classList.add('today');
    }

    grid.appendChild(el);
  }
}

function showDayDetail(dateStr) {
  const detail = document.getElementById('dayDetail');
  const content = document.getElementById('dayDetailContent');
  const header = document.getElementById('dayDetailDate');

  header.textContent = formatDateDisplay(dateStr);
  content.innerHTML = '';

  const items = [];

  (calBookings[dateStr] || []).forEach(b => {
    items.push({ type: 'booking', data: b });
  });
  (calEvents[dateStr] || []).forEach(ev => {
    items.push({ type: 'event', data: ev });
  });
  if (calBlocked.has(dateStr)) {
    items.push({ type: 'blocked', data: { block_date: dateStr } });
  }

  if (items.length === 0) {
    content.innerHTML = '<p class="empty-state">या दिवशी कोणतेही बुकिंग किंवा कार्यक्रम नाहीत.</p>';
  } else {
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'detail-item';

      if (item.type === 'booking') {
        const b = item.data;
        div.innerHTML = `
          <span class="di-type booking">बुकिंग</span>
          <div class="di-title">${b.client_name} — ${b.booking_reference}</div>
          <div class="di-time">⏰ ${formatTimeDisplay(b.start_time)}${b.end_time ? ' – ' + formatTimeDisplay(b.end_time) : ''}</div>
          ${b.location ? `<div class="di-meta">📍 ${b.location}</div>` : ''}
          <div class="di-meta">📞 ${b.client_phone} | ${STATUS_LABELS[b.status] || b.status}</div>
        `;
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => openBookingModal(b.id));
      } else if (item.type === 'event') {
        const ev = item.data;
        div.innerHTML = `
          <span class="di-type event">कार्यक्रम</span>
          <div class="di-title">${ev.title}</div>
          <div class="di-time">⏰ ${formatTimeDisplay(ev.start_time)}${ev.end_time ? ' – ' + formatTimeDisplay(ev.end_time) : ''}</div>
          ${ev.location ? `<div class="di-meta">📍 ${ev.location}</div>` : ''}
          ${ev.contact_person ? `<div class="di-meta">👤 ${ev.contact_person}${ev.contact_phone ? ' • ' + ev.contact_phone : ''}</div>` : ''}
        `;
      } else if (item.type === 'blocked') {
        div.innerHTML = `
          <span class="di-type blocked">सुट्टी</span>
          <div class="di-title">सुट्टीचा दिवस</div>
        `;
      }

      content.appendChild(div);
    });
  }

  detail.style.display = 'block';
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('adminPrevMonth').addEventListener('click', () => {
  adminCalMonth.setMonth(adminCalMonth.getMonth() - 1);
  loadCalendarData();
});
document.getElementById('adminNextMonth').addEventListener('click', () => {
  adminCalMonth.setMonth(adminCalMonth.getMonth() + 1);
  loadCalendarData();
});

/* ═══════════════════════════════════════════════════════
   BOOKINGS TAB
   ═══════════════════════════════════════════════════════ */
async function loadBookings(filter = 'all') {
  const list = document.getElementById('bookingsList');
  list.innerHTML = '<div class="loading-text">बुकिंग लोड होत आहे...</div>';

  try {
    let query = supabase.from('bookings').select('*').order('event_date', { ascending: false }).order('start_time', { ascending: true });
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }
    const { data, error } = await query;
    if (error) throw error;

    currentBookings = data || [];
    renderBookings(data || []);
    updatePendingBadge(data || []);
  } catch (err) {
    list.innerHTML = '<p class="empty-state">बुकिंग लोड करताना त्रुटी.</p>';
  }
}

function updatePendingBadge(allBookings) {
  // Count pending across ALL bookings, not just filtered
  if (allBookings === currentBookings) {
    const pending = allBookings.filter(b => b.status === 'pending').length;
    const badge = document.getElementById('pendingBadge');
    if (pending > 0) {
      badge.textContent = pending;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function renderBookings(bookings) {
  const list = document.getElementById('bookingsList');

  if (bookings.length === 0) {
    list.innerHTML = '<p class="empty-state">कोणतेही बुकिंग नाहीत.</p>';
    return;
  }

  list.innerHTML = '';
  bookings.forEach(b => {
    const card = document.createElement('div');
    card.className = `booking-card status-${b.status}`;

    const dateParts = b.event_date ? b.event_date.split('-') : '';
    const dayNum = dateParts ? dateParts[2] : '';
    const monthName = dateParts ? MONTH_NAMES_MR[parseInt(dateParts[1]) - 1]?.slice(0, 3) : '';

    card.innerHTML = `
      <div class="booking-date-box">
        <div class="bd-day">${dayNum}</div>
        <div class="bd-month">${monthName}</div>
      </div>
      <div class="booking-info">
        <div class="bi-ref">${b.booking_reference}</div>
        <div class="bi-name">${b.client_name}</div>
        <div class="bi-service">⏰ ${formatTimeDisplay(b.start_time)}${b.location ? ' • 📍 ' + b.location : ''}</div>
        <div class="bi-meta">📞 ${b.client_phone}${b.client_email ? ' • ' + b.client_email : ''}</div>
        <div class="booking-actions">
          <button class="btn-view" onclick="openBookingModal('${b.id}')">📋 तपशील</button>
        </div>
      </div>
      <span class="status-badge ${b.status}">${STATUS_LABELS[b.status] || b.status}</span>
    `;
    list.appendChild(card);
  });
}

document.getElementById('bookingFilter').addEventListener('change', (e) => {
  loadBookings(e.target.value);
});

/* ── Booking Detail Modal ── */
window.openBookingModal = async function(bookingId) {
  try {
    const { data: b, error } = await supabase.from('bookings').select('*, services(name, name_mr)').eq('id', bookingId).maybeSingle();
    if (error || !b) { showToast('बुकिंग तपशील लोड करताना त्रुटी.', 'error'); return; }

    const svcName = b.services ? (b.services.name_mr || b.services.name) : '—';
    const content = document.getElementById('bookingModalContent');

    content.innerHTML = `
      <div class="bm-header">
        <div>
          <h3>${b.client_name}</h3>
          <div style="font-size:.78rem;color:var(--brown-lt);font-family:'Courier New',monospace;">${b.booking_reference}</div>
        </div>
        <button class="bm-close" onclick="document.getElementById('bookingModalOverlay').style.display='none'">✕</button>
      </div>

      <div class="bm-section">
        <h4>बुकिंग तपशील</h4>
        <div class="bm-row"><span class="label">सेवा:</span><span class="value">${svcName}</span></div>
        <div class="bm-row"><span class="label">तारीख:</span><span class="value">${formatDateDisplay(b.event_date)}</span></div>
        <div class="bm-row"><span class="label">वेळ:</span><span class="value">${formatTimeDisplay(b.start_time)}${b.end_time ? ' – ' + formatTimeDisplay(b.end_time) : ''}</span></div>
        ${b.location ? `<div class="bm-row"><span class="label">स्थान:</span><span class="value">${b.location}</span></div>` : ''}
        <div class="bm-row"><span class="label">स्थिती:</span><span class="value"><span class="status-badge ${b.status}">${STATUS_LABELS[b.status] || b.status}</span></span></div>
      </div>

      <div class="bm-section">
        <h4>क्लायंट माहिती</h4>
        <div class="bm-row"><span class="label">नाव:</span><span class="value">${b.client_name}</span></div>
        <div class="bm-row"><span class="label">फोन:</span><span class="value">${b.client_phone}</span></div>
        ${b.client_email ? `<div class="bm-row"><span class="label">ईमेल:</span><span class="value">${b.client_email}</span></div>` : ''}
      </div>

      ${b.notes ? `<div class="bm-section"><h4>क्लायंट सूचना</h4><p style="font-size:.88rem;color:var(--brown);padding:8px;background:var(--cream-dk);border-radius:8px;">${b.notes}</p></div>` : ''}

      <div class="bm-admin-notes">
        <h4>व्यवस्थापक सूचना</h4>
        <textarea id="adminNotesField" placeholder="येथे तुमच्या सूचना लिहा...">${b.admin_notes || ''}</textarea>
      </div>

      <div class="bm-status-actions">
        <button class="bm-btn-confirm" onclick="updateBookingStatus('${b.id}', 'confirmed')">✓ निश्चित करा</button>
        <button class="bm-btn-complete" onclick="updateBookingStatus('${b.id}', 'completed')">✓ पूर्ण करा</button>
        <button class="bm-btn-cancel" onclick="updateBookingStatus('${b.id}', 'cancelled')">✕ रद्द करा</button>
        <button class="bm-btn-delete" onclick="deleteBooking('${b.id}')">🗑 हटवा</button>
      </div>

      <div style="margin-top:12px;display:flex;gap:8px;">
        <button class="btn-secondary" style="flex:1;" onclick="saveAdminNotes('${b.id}')">सूचना जतन करा</button>
        <a href="https://wa.me/91${b.client_phone}?text=${encodeURIComponent(`नमस्कार ${b.client_name}, तुमची बुकिंग (${b.booking_reference}) ${formatDateDisplay(b.event_date)} रोजी ${formatTimeDisplay(b.start_time)} वाजता नोंदणी झाली आहे. - त्रिमूर्ती ज्योतिषालय`)}" target="_blank" rel="noopener" class="btn-primary" style="flex:1;text-align:center;text-decoration:none;">💬 WhatsApp</a>
      </div>
    `;

    document.getElementById('bookingModalOverlay').style.display = 'flex';
  } catch (err) {
    showToast('त्रुटी आली.', 'error');
  }
};

window.updateBookingStatus = async function(id, status) {
  try {
    const { error } = await supabase.from('bookings').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    showToast(`बुकिंग ${STATUS_LABELS[status]} केले.`);
    document.getElementById('bookingModalOverlay').style.display = 'none';
    loadBookings(document.getElementById('bookingFilter').value);
    loadCalendarData();
  } catch (err) {
    showToast('स्थिती अद्ययावत करताना त्रुटी.', 'error');
  }
};

window.saveAdminNotes = async function(id) {
  const notes = document.getElementById('adminNotesField').value.trim();
  try {
    const { error } = await supabase.from('bookings').update({ admin_notes: notes, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    showToast('सूचना जतन झाल्या.');
  } catch (err) {
    showToast('सूचना जतन करताना त्रुटी.', 'error');
  }
};

window.deleteBooking = async function(id) {
  if (!confirm('हे बुकिंग कायमचे हटवायचे आहे का?')) return;
  try {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
    showToast('बुकिंग हटवले.');
    document.getElementById('bookingModalOverlay').style.display = 'none';
    loadBookings(document.getElementById('bookingFilter').value);
    loadCalendarData();
  } catch (err) {
    showToast('बुकिंग हटवताना त्रुटी.', 'error');
  }
};

/* ═══════════════════════════════════════════════════════
   EVENTS TAB
   ═══════════════════════════════════════════════════════ */
async function loadEvents() {
  const list = document.getElementById('eventsList');
  list.innerHTML = '<div class="loading-text">कार्यक्रम लोड होत आहे...</div>';

  try {
    const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-state">कोणतेही कार्यक्रम नाहीत. "नवीन कार्यक्रम" बटण क्लिक करा.</p>';
      return;
    }

    list.innerHTML = '';
    data.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.innerHTML = `
        <div class="event-info">
          <span class="ei-type">${ev.event_type || 'कार्यक्रम'}</span>
          <div class="ei-title">${ev.title}</div>
          <div class="ei-meta">📅 ${formatDateDisplay(ev.event_date)} | ⏰ ${formatTimeDisplay(ev.start_time)}${ev.end_time ? ' – ' + formatTimeDisplay(ev.end_time) : ''}</div>
          ${ev.location ? `<div class="ei-meta">📍 ${ev.location}</div>` : ''}
          ${ev.contact_person ? `<div class="ei-meta">👤 ${ev.contact_person}${ev.contact_phone ? ' • ' + ev.contact_phone : ''}</div>` : ''}
        </div>
        <div class="event-actions">
          <button class="btn-edit" onclick="openEventModal('${ev.id}')">✏ संपादन</button>
          <button class="btn-del" onclick="deleteEvent('${ev.id}')">🗑</button>
        </div>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = '<p class="empty-state">कार्यक्रम लोड करताना त्रुटी.</p>';
  }
}

window.openEventModal = async function(eventId) {
  const overlay = document.getElementById('eventModalOverlay');
  const form = document.getElementById('eventForm');
  form.reset();
  document.getElementById('eventId').value = '';

  if (eventId) {
    document.getElementById('eventModalTitle').textContent = 'कार्यक्रम संपादन';
    try {
      const { data: ev, error } = await supabase.from('events').select('*').eq('id', eventId).maybeSingle();
      if (error || !ev) return;
      document.getElementById('eventId').value = ev.id;
      document.getElementById('eventTitle').value = ev.title;
      document.getElementById('eventType').value = ev.event_type || 'Other';
      document.getElementById('eventDate').value = ev.event_date;
      document.getElementById('eventStartTime').value = ev.start_time;
      document.getElementById('eventEndTime').value = ev.end_time || '';
      document.getElementById('eventLocation').value = ev.location || '';
      document.getElementById('eventContact').value = ev.contact_person || '';
      document.getElementById('eventPhone').value = ev.contact_phone || '';
      document.getElementById('eventNotes').value = ev.notes || '';
    } catch (err) {
      showToast('कार्यक्रम तपशील लोड करताना त्रुटी.', 'error');
    }
  } else {
    document.getElementById('eventModalTitle').textContent = 'नवीन कार्यक्रम';
  }

  overlay.style.display = 'flex';
};

window.closeEventModal = function() {
  document.getElementById('eventModalOverlay').style.display = 'none';
};

document.getElementById('eventForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('eventId').value;
  const payload = {
    title: document.getElementById('eventTitle').value.trim(),
    event_type: document.getElementById('eventType').value,
    event_date: document.getElementById('eventDate').value,
    start_time: document.getElementById('eventStartTime').value,
    end_time: document.getElementById('eventEndTime').value || null,
    location: document.getElementById('eventLocation').value.trim() || null,
    contact_person: document.getElementById('eventContact').value.trim() || null,
    contact_phone: document.getElementById('eventPhone').value.trim() || null,
    notes: document.getElementById('eventNotes').value.trim() || null
  };

  try {
    if (id) {
      const { error } = await supabase.from('events').update(payload).eq('id', id);
      if (error) throw error;
      showToast('कार्यक्रम अद्ययावत झाला.');
    } else {
      const { error } = await supabase.from('events').insert(payload);
      if (error) throw error;
      showToast('नवीन कार्यक्रम जोडला.');
    }
    closeEventModal();
    loadEvents();
    loadCalendarData();
  } catch (err) {
    showToast('कार्यक्रम जतन करताना त्रुटी.', 'error');
  }
});

window.deleteEvent = async function(id) {
  if (!confirm('हा कार्यक्रम हटवायचा आहे का?')) return;
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    showToast('कार्यक्रम हटवला.');
    loadEvents();
    loadCalendarData();
  } catch (err) {
    showToast('कार्यक्रम हटवताना त्रुटी.', 'error');
  }
};

/* ═══════════════════════════════════════════════════════
   BLOCKED DATES TAB
   ═══════════════════════════════════════════════════════ */
async function loadBlockedDates() {
  const list = document.getElementById('blockedList');
  list.innerHTML = '<div class="loading-text">सुट्टी दिवस लोड होत आहे...</div>';

  try {
    const { data, error } = await supabase.from('blocked_dates').select('*').order('block_date', { ascending: true });
    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-state">कोणतेही सुट्टी दिवस नाहीत.</p>';
      return;
    }

    list.innerHTML = '';
    data.forEach(b => {
      const card = document.createElement('div');
      card.className = 'blocked-card';
      card.innerHTML = `
        <div>
          <div class="bl-date">📅 ${formatDateDisplay(b.block_date)}</div>
          ${b.reason ? `<div class="bl-reason">${b.reason}</div>` : ''}
        </div>
        <button class="btn-del" onclick="deleteBlocked('${b.id}')">🗑 हटवा</button>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = '<p class="empty-state">सुट्टी दिवस लोड करताना त्रुटी.</p>';
  }
}

window.openBlockModal = function() {
  document.getElementById('blockForm').reset();
  document.getElementById('blockModalOverlay').style.display = 'flex';
};

window.closeBlockModal = function() {
  document.getElementById('blockModalOverlay').style.display = 'none';
};

document.getElementById('blockForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const date = document.getElementById('blockDate').value;
  const reason = document.getElementById('blockReason').value.trim();

  try {
    const { error } = await supabase.from('blocked_dates').insert({ block_date: date, reason: reason || null });
    if (error) {
      if (error.code === '23505') {
        showToast('हा दिवस आधीच ब्लॉक केला आहे.', 'error');
      } else {
        throw error;
      }
      return;
    }
    showToast('सुट्टी दिवस जोडला.');
    closeBlockModal();
    loadBlockedDates();
    loadCalendarData();
  } catch (err) {
    showToast('दिवस ब्लॉक करताना त्रुटी.', 'error');
  }
});

window.deleteBlocked = async function(id) {
  if (!confirm('हा सुट्टी दिवस हटवायचा आहे का?')) return;
  try {
    const { error } = await supabase.from('blocked_dates').delete().eq('id', id);
    if (error) throw error;
    showToast('सुट्टी दिवस हटवला.');
    loadBlockedDates();
    loadCalendarData();
  } catch (err) {
    showToast('हटवताना त्रुटी.', 'error');
  }
};

/* ═══════════════════════════════════════════════════════
   SERVICES TAB
   ═══════════════════════════════════════════════════════ */
async function loadAdminServices() {
  const list = document.getElementById('adminServicesList');
  list.innerHTML = '<div class="loading-text">सेवा लोड होत आहे...</div>';

  try {
    const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-state">कोणत्याही सेवा नाहीत.</p>';
      return;
    }

    list.innerHTML = '';
    data.forEach(svc => {
      const card = document.createElement('div');
      card.className = 'service-admin-card';
      card.innerHTML = `
        <div class="sa-name">${svc.name_mr || svc.name}</div>
        <div class="sa-meta">⏱ ${svc.duration_minutes} मिनिटे | 📋 क्रम ${svc.sort_order} ${svc.is_active ? '' : '| निष्क्रिय'}</div>
        <div class="sa-price">₹${svc.base_price}</div>
        <div class="sa-actions">
          <button class="btn-edit" onclick="openServiceModal('${svc.id}')">✏ संपादन</button>
          <button class="btn-del" onclick="deleteService('${svc.id}')">🗑</button>
        </div>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = '<p class="empty-state">सेवा लोड करताना त्रुटी.</p>';
  }
}

window.openServiceModal = async function(svcId) {
  const form = document.getElementById('serviceForm');
  form.reset();
  document.getElementById('svcId').value = '';

  if (svcId) {
    document.getElementById('serviceModalTitle').textContent = 'सेवा संपादन';
    try {
      const { data: svc, error } = await supabase.from('services').select('*').eq('id', svcId).maybeSingle();
      if (error || !svc) return;
      document.getElementById('svcId').value = svc.id;
      document.getElementById('svcName').value = svc.name;
      document.getElementById('svcNameMr').value = svc.name_mr || '';
      document.getElementById('svcDesc').value = svc.description || '';
      document.getElementById('svcDuration').value = svc.duration_minutes;
      document.getElementById('svcPrice').value = svc.base_price;
      document.getElementById('svcSort').value = svc.sort_order;
    } catch (err) {
      showToast('सेवा तपशील लोड करताना त्रुटी.', 'error');
    }
  } else {
    document.getElementById('serviceModalTitle').textContent = 'नवीन सेवा';
  }

  document.getElementById('serviceModalOverlay').style.display = 'flex';
};

window.closeServiceModal = function() {
  document.getElementById('serviceModalOverlay').style.display = 'none';
};

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('svcId').value;
  const payload = {
    name: document.getElementById('svcName').value.trim(),
    name_mr: document.getElementById('svcNameMr').value.trim() || null,
    description: document.getElementById('svcDesc').value.trim() || null,
    duration_minutes: parseInt(document.getElementById('svcDuration').value) || 60,
    base_price: parseFloat(document.getElementById('svcPrice').value) || 0,
    sort_order: parseInt(document.getElementById('svcSort').value) || 0,
    is_active: true
  };

  try {
    if (id) {
      const { error } = await supabase.from('services').update(payload).eq('id', id);
      if (error) throw error;
      showToast('सेवा अद्ययावत झाली.');
    } else {
      const { error } = await supabase.from('services').insert(payload);
      if (error) throw error;
      showToast('नवीन सेवा जोडली.');
    }
    closeServiceModal();
    loadAdminServices();
  } catch (err) {
    showToast('सेवा जतन करताना त्रुटी.', 'error');
  }
});

window.deleteService = async function(id) {
  if (!confirm('ही सेवा हटवायची आहे का?')) return;
  try {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    showToast('सेवा हटवली.');
    loadAdminServices();
  } catch (err) {
    showToast('सेवा हटवताना त्रुटी.', 'error');
  }
};

/* ── Init ── */
/* ── Auth Guard + Init ── */
async function initAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return;
  }
  const admin = await isAdmin();
  if (!admin) {
    window.location.href = '/dashboard.html';
    return;
  }

  const profile = await getUserProfile();
  document.getElementById('adminName').textContent = profile?.full_name || '';
  document.getElementById('redirectScreen').style.display = 'none';
  document.getElementById('navbar').style.display = 'flex';
  document.getElementById('tabBar').style.display = 'flex';

  document.getElementById('adminLogoutBtn').addEventListener('click', signOut);

  loadCalendarData();
  loadBookings();
  loadEvents();
  loadBlockedDates();
  loadAdminServices();
  loadOverview();
  loadClients();
  loadAdminDocuments();
  loadAdminMuhurtas();
}

initAdmin();

/* ═══════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════ */
async function loadOverview() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [todayBookings, pendingBookings, upcomingEvents, clients] = await Promise.all([
      supabase.from('bookings').select('*').eq('event_date', today).neq('status', 'cancelled'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('events').select('*').gte('event_date', today).order('event_date', { ascending: true }).limit(5),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
    ]);

    document.getElementById('ovTodayCount').textContent = todayBookings.data?.length || 0;
    document.getElementById('ovPending').textContent = pendingBookings.count || 0;
    document.getElementById('ovEvents').textContent = upcomingEvents.data?.length || 0;
    document.getElementById('ovClients').textContent = clients.count || 0;

    // Today's bookings
    const todayList = document.getElementById('ovTodayBookings');
    if (todayBookings.data && todayBookings.data.length > 0) {
      todayList.innerHTML = todayBookings.data.sort((a,b) => a.start_time.localeCompare(b.start_time)).map(b => `
        <div class="booking-card status-${b.status}" style="cursor:pointer;" onclick="openBookingModal('${b.id}')">
          <div class="booking-info">
            <div class="bi-ref">${b.booking_reference}</div>
            <div class="bi-name">${b.client_name}</div>
            <div class="bi-service">⏰ ${formatTimeDisplay(b.start_time)}${b.location ? ' • 📍 ' + b.location : ''}</div>
            <div class="bi-meta">📞 ${b.client_phone}</div>
          </div>
          <span class="status-badge ${b.status}">${STATUS_LABELS[b.status] || b.status}</span>
        </div>
      `).join('');
    } else {
      todayList.innerHTML = '<p class="empty-state">आज कोणतीही बुकिंग नाही.</p>';
    }

    // Upcoming events
    const eventsList = document.getElementById('ovUpcomingEvents');
    if (upcomingEvents.data && upcomingEvents.data.length > 0) {
      eventsList.innerHTML = upcomingEvents.data.map(ev => `
        <div class="event-card">
          <div class="event-info">
            <span class="ei-type">${ev.event_type || 'कार्यक्रम'}</span>
            <div class="ei-title">${ev.title}</div>
            <div class="ei-meta">📅 ${formatDateDisplay(ev.event_date)} | ⏰ ${formatTimeDisplay(ev.start_time)}</div>
            ${ev.location ? `<div class="ei-meta">📍 ${ev.location}</div>` : ''}
          </div>
        </div>
      `).join('');
    } else {
      eventsList.innerHTML = '<p class="empty-state">कोणतेही आगामी कार्यक्रम नाहीत.</p>';
    }
  } catch (err) {
    // silent
  }
}

/* ═══════════════════════════════════════════════════════
   CLIENTS CRM TAB
   ═══════════════════════════════════════════════════════ */
let allClients = [];

async function loadClients() {
  const list = document.getElementById('clientsList');
  try {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    allClients = data || [];
    renderClients(allClients);

    document.getElementById('clientSearch').addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = allClients.filter(c =>
        (c.full_name || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q)
      );
      renderClients(filtered);
    });
  } catch (err) {
    list.innerHTML = '<p class="empty-state">क्लायंट लोड करताना त्रुटी.</p>';
  }
}

async function renderClients(clients) {
  const list = document.getElementById('clientsList');
  if (clients.length === 0) {
    list.innerHTML = '<p class="empty-state">कोणतेही क्लायंट नाहीत.</p>';
    return;
  }

  // Get booking counts per client
  const enriched = await Promise.all(clients.map(async c => {
    const { count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', c.id);
    return { ...c, bookingCount: count || 0 };
  }));

  list.innerHTML = enriched.map(c => {
    const initials = (c.full_name || '?').charAt(0).toUpperCase();
    return `
      <div class="client-card" onclick="openClientModal('${c.id}')">
        <div class="client-avatar">${initials}</div>
        <div class="client-info">
          <div class="ci-name">${c.full_name || 'Unknown'}</div>
          <div class="ci-meta">📞 ${c.phone || '—'}</div>
          <div class="ci-since">नोंदणी: ${formatDateDisplay(c.created_at?.split('T')[0])}</div>
        </div>
        <span class="client-bookings">${c.bookingCount} बुकिंग</span>
      </div>
    `;
  }).join('');
}

window.openClientModal = async function(clientId) {
  try {
    const { data: client, error } = await supabase.from('profiles').select('*').eq('id', clientId).maybeSingle();
    if (error || !client) return;

    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, services(name, name_mr)')
      .eq('client_id', clientId)
      .order('event_date', { ascending: false });

    const { data: docs } = await supabase
      .from('documents')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    const bookingsHtml = (bookings && bookings.length > 0)
      ? bookings.map(b => {
          const svc = b.services ? (b.services.name_mr || b.services.name) : '—';
          return `<div class="bm-row"><span class="label">${formatDateDisplay(b.event_date)}</span><span class="value">${svc} — ${STATUS_LABELS[b.status] || b.status}</span></div>`;
        }).join('')
      : '<p class="empty-state">कोणतीही बुकिंग नाही.</p>';

    const docsHtml = (docs && docs.length > 0)
      ? docs.map(d => `<div class="bm-row"><span class="label">${d.title}</span><span class="value">${formatDateDisplay(d.created_at?.split('T')[0])}</span></div>`).join('')
      : '<p class="empty-state">कोणतेही दस्तऐवज नाही.</p>';

    document.getElementById('clientModalContent').innerHTML = `
      <div class="bm-header">
        <div>
          <h3>${client.full_name || 'Client'}</h3>
          <div style="font-size:.82rem;color:var(--brown-lt);">📞 ${client.phone || '—'}</div>
        </div>
        <button class="bm-close" onclick="document.getElementById('clientModalOverlay').style.display='none'">✕</button>
      </div>
      <div class="bm-section">
        <h4>बुकिंग इतिहास (${bookings?.length || 0})</h4>
        ${bookingsHtml}
      </div>
      <div class="bm-section">
        <h4>दस्तऐवज (${docs?.length || 0})</h4>
        ${docsHtml}
      </div>
      <div class="bm-status-actions">
        <a href="https://wa.me/91${client.phone}?text=${encodeURIComponent('नमस्कार ' + (client.full_name || ''))}" target="_blank" rel="noopener" class="btn-primary" style="text-decoration:none;">💬 WhatsApp</a>
        <button class="btn-secondary" onclick="openDocModalForClient('${client.id}')">📄 दस्तऐवज जोडा</button>
      </div>
    `;
    document.getElementById('clientModalOverlay').style.display = 'flex';
  } catch (err) {
    showToast('क्लायंट तपशील लोड करताना त्रुटी.', 'error');
  }
};

/* ═══════════════════════════════════════════════════════
   DOCUMENTS ADMIN TAB
   ═══════════════════════════════════════════════════════ */
async function loadAdminDocuments() {
  const list = document.getElementById('adminDocList');
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*, profiles:client_id(full_name, phone)')
      .order('created_at', { ascending: false });
    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-state">कोणतेही दस्तऐवज नाहीत.</p>';
      return;
    }

    list.innerHTML = data.map(d => `
      <div class="doc-admin-card">
        <div class="doc-admin-info">
          <div class="dai-title">${d.title}</div>
          <div class="dai-client">👤 ${d.profiles?.full_name || '—'}</div>
          <div class="dai-date">📅 ${formatDateDisplay(d.created_at?.split('T')[0])}</div>
        </div>
        <div class="doc-admin-actions">
          ${d.file_url ? `<a href="${d.file_url}" target="_blank" rel="noopener" class="btn-secondary" style="padding:6px 12px;font-size:.76rem;text-decoration:none;">⬇</a>` : ''}
          <button class="btn-del" onclick="deleteDoc('${d.id}')">🗑</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p class="empty-state">दस्तऐवज लोड करताना त्रुटी.</p>';
  }
}

window.openDocModal = async function() {
  await populateDocClients();
  document.getElementById('docForm').reset();
  document.getElementById('docModalOverlay').style.display = 'flex';
};

window.openDocModalForClient = async function(clientId) {
  document.getElementById('clientModalOverlay').style.display = 'none';
  await populateDocClients();
  document.getElementById('docForm').reset();
  document.getElementById('docClient').value = clientId;
  document.getElementById('docModalOverlay').style.display = 'flex';
};

async function populateDocClients() {
  const select = document.getElementById('docClient');
  const { data } = await supabase.from('profiles').select('id, full_name, phone').order('full_name', { ascending: true });
  select.innerHTML = '<option value="">-- क्लायंट निवडा --</option>';
  if (data) {
    data.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.full_name || 'Unknown'} ${c.phone ? '(' + c.phone + ')' : ''}</option>`;
    });
  }
}

window.closeDocModal = function() {
  document.getElementById('docModalOverlay').style.display = 'none';
};

document.getElementById('docForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = await getCurrentUser();
  const payload = {
    client_id: document.getElementById('docClient').value,
    uploaded_by: user?.id || null,
    title: document.getElementById('docTitle').value.trim(),
    doc_type: document.getElementById('docType').value,
    file_url: document.getElementById('docUrl').value.trim() || null,
    notes: document.getElementById('docNotes').value.trim() || null
  };
  try {
    const { error } = await supabase.from('documents').insert(payload);
    if (error) throw error;
    showToast('दस्तऐवज जोडला.');
    closeDocModal();
    loadAdminDocuments();
  } catch (err) {
    showToast('दस्तऐवज जतन करताना त्रुटी.', 'error');
  }
});

window.deleteDoc = async function(id) {
  if (!confirm('हा दस्तऐवज हटवायचा आहे का?')) return;
  try {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
    showToast('दस्तऐवज हटवला.');
    loadAdminDocuments();
  } catch (err) {
    showToast('हटवताना त्रुटी.', 'error');
  }
};

/* ═══════════════════════════════════════════════════════
   MUHURTAS ADMIN TAB
   ═══════════════════════════════════════════════════════ */
async function loadAdminMuhurtas() {
  const list = document.getElementById('adminMuhurtaList');
  try {
    const { data, error } = await supabase.from('muhurtas').select('*').order('muhurta_date', { ascending: true });
    if (error) throw error;

    if (!data || data.length === 0) {
      list.innerHTML = '<p class="empty-state">कोणतेही मुहूर्त नाहीत.</p>';
      return;
    }

    const catLabels = { marriage: 'विवाह', griha_pravesh: 'गृहप्रवेश', business: 'व्यवसाय', naming: 'नामकरण', vehicle: 'वाहन खरेदी', other: 'इतर' };

    list.innerHTML = data.map(m => `
      <div class="muhurta-admin-card">
        <div class="muhurta-admin-info">
          <span class="mai-cat">${catLabels[m.category] || m.category}</span>
          <div class="mai-date">📅 ${formatDateDisplay(m.muhurta_date)} ${m.start_time ? '| ⏰ ' + formatTimeDisplay(m.start_time) : ''}</div>
          ${m.description ? `<div class="mai-desc">${m.description}</div>` : ''}
        </div>
        <div class="muhurta-admin-actions">
          <button class="btn-edit" onclick="openMuhurtaModal('${m.id}')">✏</button>
          <button class="btn-del" onclick="deleteMuhurta('${m.id}')">🗑</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p class="empty-state">मुहूर्त लोड करताना त्रुटी.</p>';
  }
}

window.openMuhurtaModal = async function(muhurtaId) {
  const form = document.getElementById('muhurtaForm');
  form.reset();
  document.getElementById('muhurtaId').value = '';

  if (muhurtaId) {
    try {
      const { data: m, error } = await supabase.from('muhurtas').select('*').eq('id', muhurtaId).maybeSingle();
      if (error || !m) return;
      document.getElementById('muhurtaId').value = m.id;
      document.getElementById('muhurtaCategory').value = m.category;
      document.getElementById('muhurtaDate').value = m.muhurta_date;
      document.getElementById('muhurtaStart').value = m.start_time || '';
      document.getElementById('muhurtaEnd').value = m.end_time || '';
      document.getElementById('muhurtaDesc').value = m.description || '';
    } catch (err) {}
  }

  document.getElementById('muhurtaModalOverlay').style.display = 'flex';
};

window.closeMuhurtaModal = function() {
  document.getElementById('muhurtaModalOverlay').style.display = 'none';
};

document.getElementById('muhurtaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('muhurtaId').value;
  const payload = {
    category: document.getElementById('muhurtaCategory').value,
    muhurta_date: document.getElementById('muhurtaDate').value,
    start_time: document.getElementById('muhurtaStart').value || null,
    end_time: document.getElementById('muhurtaEnd').value || null,
    description: document.getElementById('muhurtaDesc').value.trim() || null,
    is_active: true
  };
  try {
    if (id) {
      const { error } = await supabase.from('muhurtas').update(payload).eq('id', id);
      if (error) throw error;
      showToast('मुहूर्त अद्ययावत झाला.');
    } else {
      const { error } = await supabase.from('muhurtas').insert(payload);
      if (error) throw error;
      showToast('नवीन मुहूर्त जोडला.');
    }
    closeMuhurtaModal();
    loadAdminMuhurtas();
  } catch (err) {
    showToast('मुहूर्त जतन करताना त्रुटी.', 'error');
  }
});

window.deleteMuhurta = async function(id) {
  if (!confirm('हा मुहूर्त हटवायचा आहे का?')) return;
  try {
    const { error } = await supabase.from('muhurtas').delete().eq('id', id);
    if (error) throw error;
    showToast('मुहूर्त हटवला.');
    loadAdminMuhurtas();
  } catch (err) {
    showToast('हटवताना त्रुटी.', 'error');
  }
};
