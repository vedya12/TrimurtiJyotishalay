/* ── Standalone Utility Helpers (Replacing external imports) ── */
function generateBookingRef() {
  return 'TJ-' + Math.floor(100000 + Math.random() * 900000);
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatTimeDisplay(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${m} ${ampm}`;
}

const WHATSAPP_NUMBER = '919876543210'; // Demo WhatsApp Number

/* ── Mock Data ── */
const MOCK_SERVICES = [
  {
    id: 'svc-1',
    name_mr: 'जन्म कुंडली मार्गदर्शन',
    name: 'Janma Kundali Guidance',
    duration_minutes: 60,
    description_mr: 'सविस्तर जन्म पत्रिका, ग्रह स्थिती आणि भविष्य मार्गदर्शन.',
    base_price: 501
  },
  {
    id: 'svc-2',
    name_mr: 'गुण जुळवणी / विवाह जुळवणी',
    name: 'Gun Milan',
    duration_minutes: 45,
    description_mr: 'वर-वधू पत्रिका मिलन व गुण दोष विश्लेषण.',
    base_price: 351
  },
  {
    id: 'svc-3',
    name_mr: 'वास्तू शांती सल्ला',
    name: 'Vastu Shanti Consultation',
    duration_minutes: 90,
    description_mr: 'घर व व्यवसायासाठी वास्तू दोष निवारण सल्ला.',
    base_price: 1100
  },
  {
    id: 'svc-4',
    name_mr: 'नवग्रह शांती मार्गदर्शन',
    name: 'Navgrah Shanti Guidance',
    duration_minutes: 60,
    description_mr: 'ग्रह दोष निवारण आणि पूजाविधी माहिती.',
    base_price: 751
  }
];

// Pre-filled mock dates for availability testing
const MOCK_BLOCKED_DATES = new Set(['2026-08-15', '2026-08-26']);
const MOCK_BOOKED_SLOTS = {
  '2026-08-10': ['09:00', '10:00', '11:00'],
  '2026-08-12': ['14:00', '15:00'],
};

/* ── State ── */
let currentStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let calendarMonth = new Date();
calendarMonth.setDate(1);

let bookedDates = new Set();
let blockedDates = MOCK_BLOCKED_DATES;
let bookedSlots = MOCK_BOOKED_SLOTS;

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
];

const MONTH_NAMES_MR = [
  'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
];
const DAY_NAMES_MR = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

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

/* ── Step Navigation ── */
function goToStep(step) {
  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');

  document.querySelectorAll('.step-indicator .step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'completed');
    if (s < step) el.classList.add('completed');
    else if (s === step) el.classList.add('active');
  });

  document.querySelectorAll('.step-line').forEach((el, i) => {
    el.classList.toggle('active', i < step - 1);
  });

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.goToStep = goToStep;

/* ── Load Services (Mocked) ── */
async function loadServices() {
  const grid = document.getElementById('serviceGrid');
  grid.innerHTML = '';

  if (!MOCK_SERVICES || MOCK_SERVICES.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--brown-lt);">सध्या कोणत्याही सेवा उपलब्ध नाहीत.</p>';
    return;
  }

  MOCK_SERVICES.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
      <h3>${svc.name_mr || svc.name}</h3>
      <div class="svc-duration">⏱ ${svc.duration_minutes} मिनिटे</div>
      <div class="svc-desc">${svc.description_mr || ''}</div>
      <div class="svc-price">₹${svc.base_price} <small>पासून</small></div>
    `;
    card.addEventListener('click', () => selectService(svc, card));
    grid.appendChild(card);
  });
}

function selectService(svc, card) {
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  selectedService = svc;

  setTimeout(() => {
    goToStep(2);
    renderCalendar();
  }, 300);
}

/* ── Calendar Rendering (Mocked) ── */
async function renderCalendar() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const monthLabel = document.getElementById('monthLabel');
  monthLabel.textContent = `${MONTH_NAMES_MR[month]} ${year}`;

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  // Day names header
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

  // Padding cells
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  // Month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(year, month, d);
    dateObj.setHours(0, 0, 0, 0);

    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    el.dataset.date = dateStr;

    if (dateObj < today) {
      el.classList.add('past');
    } else if (blockedDates.has(dateStr)) {
      el.classList.add('blocked');
      el.title = 'सुट्टी';
    } else if (bookedSlots[dateStr] && bookedSlots[dateStr].length >= TIME_SLOTS.length) {
      el.classList.add('booked');
      el.title = 'सर्व वेळ बुक आहेत';
    } else {
      el.classList.add('available');
      el.addEventListener('click', () => selectDate(dateStr, el));
    }

    if (dateObj.getTime() === today.getTime()) {
      el.classList.add('today');
    }

    if (dateStr === selectedDate) {
      el.classList.add('selected');
    }

    grid.appendChild(el);
  }
}

function selectDate(dateStr, el) {
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  selectedDate = dateStr;
  renderTimeSlots();
}

function renderTimeSlots() {
  const section = document.getElementById('timeSection');
  const slotsEl = document.getElementById('timeSlots');
  const nextBtn = document.getElementById('nextFromStep2');

  section.style.display = 'block';
  slotsEl.innerHTML = '';

  const takenSlots = bookedSlots[selectedDate] || [];

  TIME_SLOTS.forEach(time => {
    const slot = document.createElement('div');
    slot.className = 'time-slot';
    slot.textContent = formatTimeDisplay(time);
    slot.dataset.time = time;

    if (takenSlots.includes(time)) {
      slot.classList.add('disabled');
      slot.title = 'हा वेळ बुक आहे';
    } else {
      slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = time;
        nextBtn.disabled = false;
      });
    }

    slotsEl.appendChild(slot);
  });

  section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('nextFromStep2').addEventListener('click', () => {
  if (!selectedDate || !selectedTime) {
    showToast('कृपया तारीख आणि वेळ निवडा.', 'error');
    return;
  }
  renderSummary();
  goToStep(3);
});

document.getElementById('prevMonth').addEventListener('click', () => {
  calendarMonth.setMonth(calendarMonth.getMonth() - 1);
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  calendarMonth.setMonth(calendarMonth.getMonth() + 1);
  renderCalendar();
});

/* ── Summary ── */
function renderSummary() {
  const summary = document.getElementById('bookingSummary');
  const endTime = new Date(`2000-01-01T${selectedTime}`);
  endTime.setMinutes(endTime.getMinutes() + (selectedService?.duration_minutes || 60));
  const endStr = endTime.toTimeString().substring(0, 5);

  summary.innerHTML = `
    <h3>📋 बुकिंग सारांश</h3>
    <div class="summary-row"><span class="label">सेवा:</span><span class="value">${selectedService?.name_mr || selectedService?.name}</span></div>
    <div class="summary-row"><span class="label">तारीख:</span><span class="value">${formatDateDisplay(selectedDate)}</span></div>
    <div class="summary-row"><span class="label">वेळ:</span><span class="value">${formatTimeDisplay(selectedTime)} – ${formatTimeDisplay(endStr)}</span></div>
    <div class="summary-row"><span class="label">वेळ अंतर:</span><span class="value">${selectedService?.duration_minutes || 60} मिनिटे</span></div>
    <div class="summary-row"><span class="label">अंदाजे शुल्क:</span><span class="value">₹${selectedService?.base_price || 0}</span></div>
  `;
}

/* ── Form Submit (Simulated Local Booking) ── */
const form = document.getElementById('bookingForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const location = document.getElementById('clientLocation').value.trim();
  const notes = document.getElementById('clientNotes').value.trim();

  // Validate
  if (!name || name.length < 2) {
    document.getElementById('clientName').classList.add('error');
    showToast('कृपया योग्य नाव प्रविष्ट करा.', 'error');
    return;
  }

  const phoneClean = phone.replace(/\s|-/g, '');
  if (!/^[6-9]\d{9}$/.test(phoneClean)) {
    document.getElementById('clientPhone').classList.add('error');
    showToast('कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा.', 'error');
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ बुकिंग होत आहे...';

  // Simulate network delay for submission
  setTimeout(() => {
    const bookingRef = generateBookingRef();

    // Add slot to local state to block duplicate booking in demo session
    if (!bookedSlots[selectedDate]) bookedSlots[selectedDate] = [];
    bookedSlots[selectedDate].push(selectedTime);

    // Populate confirmation UI
    document.getElementById('bookingRef').textContent = bookingRef;

    const successDetails = document.getElementById('successDetails');
    successDetails.innerHTML = `
      <div class="detail-row"><span class="label">सेवा:</span><span class="value">${selectedService?.name_mr || selectedService?.name}</span></div>
      <div class="detail-row"><span class="label">तारीख:</span><span class="value">${formatDateDisplay(selectedDate)}</span></div>
      <div class="detail-row"><span class="label">वेळ:</span><span class="value">${formatTimeDisplay(selectedTime)}</span></div>
      <div class="detail-row"><span class="label">नाव:</span><span class="value">${name}</span></div>
      <div class="detail-row"><span class="label">मोबाईल:</span><span class="value">${phoneClean}</span></div>
    `;

    // WhatsApp Action Button with corrected Marathi spelling
    const waBtn = document.getElementById('waBtn');
    const waText = `🕉 *त्रिमूर्ती ज्योतिषालय — बुकिंग नोंद*\n─────────────────────\n📋 *बुकिंग आयडी:* ${bookingRef}\n🛎 *सेवा:* ${selectedService?.name_mr || selectedService?.name}\n📅 *तारीख:* ${formatDateDisplay(selectedDate)}\n⏰ *वेळ:* ${formatTimeDisplay(selectedTime)}\n👤 *नाव:* ${name}\n📞 *मोबाईल:* ${phoneClean}${location ? `\n📍 *स्थान:* ${location}` : ''}${notes ? `\n💬 *सूचना:* ${notes}` : ''}\n─────────────────────\n_कृपया बुकिंग नोंदणीसाठी आम्हाला भेट द्या._`;
    
    waBtn.onclick = () => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank', 'noopener');
    };

    goToStep(4);
    document.querySelectorAll('.step-indicator .step').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.remove('active', 'completed');
      if (s <= 3) el.classList.add('completed');
    });
    document.querySelectorAll('.step-line').forEach(el => el.classList.add('active'));

    showToast('डेमो बुकिंग यशस्वीरित्या सबमिट झाले!', 'success');
  }, 800);
});

// Clear error on input
form.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});

/* ── Init ── */
loadServices();


























// // import { supabase, generateBookingRef, formatDateDisplay, formatTimeDisplay, WHATSAPP_NUMBER, getCurrentUser } from '../lib/supabase.js';
// import { isLoggedIn, getSession } from '../lib/auth.js';

// /* ── State ── */
// let currentStep = 1;
// let selectedService = null;
// let selectedDate = null;
// let selectedTime = null;
// let calendarMonth = new Date();
// calendarMonth.setDate(1);

// let bookedDates = new Set();
// let blockedDates = new Set();
// let bookedSlots = {}; // { 'YYYY-MM-DD': ['09:00', '10:00'] }

// const TIME_SLOTS = [
//   '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
//   '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
//   '18:00', '19:00', '20:00'
// ];

// const MONTH_NAMES_MR = [
//   'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
//   'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
// ];
// const DAY_NAMES_MR = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

// /* ── Toast ── */
// const toast = document.createElement('div');
// toast.className = 'toast';
// document.body.appendChild(toast);
// let toastTimer = null;
// function showToast(msg, type = 'success') {
//   toast.textContent = msg;
//   toast.className = `toast ${type} show`;
//   clearTimeout(toastTimer);
//   toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
// }

// /* ── Step Navigation ── */
// function goToStep(step) {
//   document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
//   document.getElementById(`step${step}`).classList.add('active');

//   document.querySelectorAll('.step-indicator .step').forEach(el => {
//     const s = parseInt(el.dataset.step);
//     el.classList.remove('active', 'completed');
//     if (s < step) el.classList.add('completed');
//     else if (s === step) el.classList.add('active');
//   });

//   document.querySelectorAll('.step-line').forEach((el, i) => {
//     el.classList.toggle('active', i < step - 1);
//   });

//   currentStep = step;
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// }
// window.goToStep = goToStep;

// /* ── Load Services ── */
// async function loadServices() {
//   const grid = document.getElementById('serviceGrid');
//   try {
//     const { data, error } = await supabase
//       .from('services')
//       .select('*')
//       .eq('is_active', true)
//       .order('sort_order', { ascending: true });

//     if (error) throw error;

//     grid.innerHTML = '';
//     if (!data || data.length === 0) {
//       grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--brown-lt);">सध्या कोणत्याही सेवा उपलब्ध नाहीत.</p>';
//       return;
//     }

//     data.forEach(svc => {
//       const card = document.createElement('div');
//       card.className = 'service-card';
//       card.innerHTML = `
//         <h3>${svc.name_mr || svc.name}</h3>
//         <div class="svc-duration">⏱ ${svc.duration_minutes} मिनिटे</div>
//         <div class="svc-desc">${svc.description_mr || svc.description || ''}</div>
//         <div class="svc-price">₹${svc.base_price} <small>पासून</small></div>
//       `;
//       card.addEventListener('click', () => selectService(svc, card));
//       grid.appendChild(card);
//     });
//   } catch (err) {
//     grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--red);">सेवा लोड करताना त्रुटी. कृपया पृष्ठ रिफ्रेश करा.</p>';
//   }
// }

// function selectService(svc, card) {
//   document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
//   card.classList.add('selected');
//   selectedService = svc;

//   setTimeout(() => {
//     goToStep(2);
//     renderCalendar();
//   }, 300);
// }

// /* ── Load Availability Data ── */
// async function loadAvailability() {
//   const year = calendarMonth.getFullYear();
//   const month = calendarMonth.getMonth();
//   const startDate = new Date(year, month, 1).toISOString().split('T')[0];
//   const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

//   try {
//     const [bookingsRes, blockedRes] = await Promise.all([
//       supabase.from('bookings').select('event_date, start_time, status')
//         .gte('event_date', startDate)
//         .lte('event_date', endDate)
//         .neq('status', 'cancelled'),
//       supabase.from('blocked_dates').select('block_date')
//         .gte('block_date', startDate)
//         .lte('block_date', endDate)
//     ]);

//     bookedDates = new Set();
//     bookedSlots = {};

//     if (bookingsRes.data) {
//       bookingsRes.data.forEach(b => {
//         const d = b.event_date;
//         if (!bookedSlots[d]) bookedSlots[d] = [];
//         if (b.start_time) bookedSlots[d].push(b.start_time.substring(0, 5));
//       });
//     }

//     blockedDates = new Set();
//     if (blockedRes.data) {
//       blockedRes.data.forEach(b => blockedDates.add(b.block_date));
//     }
//   } catch (err) {
//     // Silently fail — calendar still renders as all available
//   }
// }

// /* ── Calendar Rendering ── */
// async function renderCalendar() {
//   await loadAvailability();

//   const year = calendarMonth.getFullYear();
//   const month = calendarMonth.getMonth();
//   const monthLabel = document.getElementById('monthLabel');
//   monthLabel.textContent = `${MONTH_NAMES_MR[month]} ${year}`;

//   const grid = document.getElementById('calendarGrid');
//   grid.innerHTML = '';

//   // Day names
//   DAY_NAMES_MR.forEach(dn => {
//     const el = document.createElement('div');
//     el.className = 'cal-day-name';
//     el.textContent = dn;
//     grid.appendChild(el);
//   });

//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // Empty cells
//   for (let i = 0; i < firstDay; i++) {
//     const el = document.createElement('div');
//     el.className = 'cal-day empty';
//     grid.appendChild(el);
//   }

//   for (let d = 1; d <= daysInMonth; d++) {
//     const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
//     const dateObj = new Date(year, month, d);
//     dateObj.setHours(0, 0, 0, 0);

//     const el = document.createElement('div');
//     el.className = 'cal-day';
//     el.textContent = d;
//     el.dataset.date = dateStr;

//     if (dateObj < today) {
//       el.classList.add('past');
//     } else if (blockedDates.has(dateStr)) {
//       el.classList.add('blocked');
//       el.title = 'सुट्टी';
//     } else if (bookedSlots[dateStr] && bookedSlots[dateStr].length >= TIME_SLOTS.length) {
//       el.classList.add('booked');
//       el.title = 'सर्व वेळ बुक आहेत';
//     } else {
//       el.classList.add('available');
//       el.addEventListener('click', () => selectDate(dateStr, el));
//     }

//     if (dateObj.getTime() === today.getTime()) {
//       el.classList.add('today');
//     }

//     if (dateStr === selectedDate) {
//       el.classList.add('selected');
//     }

//     grid.appendChild(el);
//   }
// }

// function selectDate(dateStr, el) {
//   document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
//   el.classList.add('selected');
//   selectedDate = dateStr;
//   renderTimeSlots();
// }

// function renderTimeSlots() {
//   const section = document.getElementById('timeSection');
//   const slotsEl = document.getElementById('timeSlots');
//   const nextBtn = document.getElementById('nextFromStep2');

//   section.style.display = 'block';
//   slotsEl.innerHTML = '';

//   const takenSlots = bookedSlots[selectedDate] || [];

//   TIME_SLOTS.forEach(time => {
//     const slot = document.createElement('div');
//     slot.className = 'time-slot';
//     slot.textContent = formatTimeDisplay(time);
//     slot.dataset.time = time;

//     if (takenSlots.includes(time)) {
//       slot.classList.add('disabled');
//       slot.title = 'हा वेळ बुक आहे';
//     } else {
//       slot.addEventListener('click', () => {
//         document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
//         slot.classList.add('selected');
//         selectedTime = time;
//         nextBtn.disabled = false;
//       });
//     }

//     slotsEl.appendChild(slot);
//   });

//   section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
// }

// document.getElementById('nextFromStep2').addEventListener('click', () => {
//   if (!selectedDate || !selectedTime) {
//     showToast('कृपया तारीख आणि वेळ निवडा.', 'error');
//     return;
//   }
//   renderSummary();
//   goToStep(3);
// });

// document.getElementById('prevMonth').addEventListener('click', () => {
//   calendarMonth.setMonth(calendarMonth.getMonth() - 1);
//   renderCalendar();
// });

// document.getElementById('nextMonth').addEventListener('click', () => {
//   calendarMonth.setMonth(calendarMonth.getMonth() + 1);
//   renderCalendar();
// });

// /* ── Summary ── */
// function renderSummary() {
//   const summary = document.getElementById('bookingSummary');
//   const endTime = new Date(`2000-01-01T${selectedTime}`);
//   endTime.setMinutes(endTime.getMinutes() + (selectedService?.duration_minutes || 60));
//   const endStr = endTime.toTimeString().substring(0, 5);

//   summary.innerHTML = `
//     <h3>📋 बुकिंग सारांश</h3>
//     <div class="summary-row"><span class="label">सेवा:</span><span class="value">${selectedService?.name_mr || selectedService?.name}</span></div>
//     <div class="summary-row"><span class="label">तारीख:</span><span class="value">${formatDateDisplay(selectedDate)}</span></div>
//     <div class="summary-row"><span class="label">वेळ:</span><span class="value">${formatTimeDisplay(selectedTime)} – ${formatTimeDisplay(endStr)}</span></div>
//     <div class="summary-row"><span class="label">वेळ अंतर:</span><span class="value">${selectedService?.duration_minutes || 60} मिनिटे</span></div>
//     <div class="summary-row"><span class="label">अंदाजे शुल्क:</span><span class="value">₹${selectedService?.base_price || 0}</span></div>
//   `;
// }

// /* ── Form Submit ── */
// const form = document.getElementById('bookingForm');
// form.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const name = document.getElementById('clientName').value.trim();
//   const phone = document.getElementById('clientPhone').value.trim();
//   const email = document.getElementById('clientEmail').value.trim();
//   const location = document.getElementById('clientLocation').value.trim();
//   const notes = document.getElementById('clientNotes').value.trim();

//   // Validate
//   if (!name || name.length < 2) {
//     document.getElementById('clientName').classList.add('error');
//     showToast('कृपया योग्य नाव प्रविष्ट करा.', 'error');
//     return;
//   }

//   const phoneClean = phone.replace(/\s|-/g, '');
//   if (!/^[6-9]\d{9}$/.test(phoneClean)) {
//     document.getElementById('clientPhone').classList.add('error');
//     showToast('कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा.', 'error');
//     return;
//   }

//   const submitBtn = document.getElementById('submitBtn');
//   submitBtn.disabled = true;
//   submitBtn.textContent = '⏳ बुकिंग होत आहे...';

//   const bookingRef = generateBookingRef();

//   // Calculate end time
//   const endTime = new Date(`2000-01-01T${selectedTime}`);
//   endTime.setMinutes(endTime.getMinutes() + (selectedService?.duration_minutes || 60));
//   const endStr = endTime.toTimeString().substring(0, 5);

//   // Link to authenticated user if logged in
//   const currentUser = isLoggedIn() ? getSession() : null;
//   // NOTE: client_id column is uuid, tied to real Supabase auth (profiles.id).
//   // The demo/localStorage session has no real auth.uid(), so we must not send it —
//   // sending a plain username string here would error out on the uuid column.
//   const clientId = null;

//   try {
//     const { data, error } = await supabase.from('bookings').insert({
//       booking_reference: bookingRef,
//       service_id: selectedService?.id || null,
//       client_id: clientId,
//       client_name: name,
//       client_phone: phoneClean,
//       client_email: email || null,
//       event_date: selectedDate,
//       start_time: selectedTime,
//       end_time: endStr,
//       location: location || null,
//       notes: notes || null,
//       status: 'pending'
//     }).select().maybeSingle();

//     if (error) throw error;

//     // Show success
//     document.getElementById('bookingRef').textContent = bookingRef;

//     const successDetails = document.getElementById('successDetails');
//     successDetails.innerHTML = `
//       <div class="detail-row"><span class="label">सेवा:</span><span class="value">${selectedService?.name_mr || selectedService?.name}</span></div>
//       <div class="detail-row"><span class="label">तारीख:</span><span class="value">${formatDateDisplay(selectedDate)}</span></div>
//       <div class="detail-row"><span class="label">वेळ:</span><span class="value">${formatTimeDisplay(selectedTime)}</span></div>
//       <div class="detail-row"><span class="label">नाव:</span><span class="value">${name}</span></div>
//       <div class="detail-row"><span class="label">मोबाईल:</span><span class="value">${phoneClean}</span></div>
//     `;

//     // WhatsApp button
//     const waBtn = document.getElementById('waBtn');
//     const waText = `🕉 *त्रिमूर्ती ज्योतिषालय — बुकिंग नोंद*\n─────────────────────\n📋 *बुकिंग आयडी:* ${bookingRef}\n🛎 *सेवा:* ${selectedService?.name_mr || selectedService?.name}\n📅 *तारीख:* ${formatDateDisplay(selectedDate)}\n⏰ *वेळ:* ${formatTimeDisplay(selectedTime)}\n👤 *नाव:* ${name}\n📞 *मोबाईल:* ${phoneClean}${location ? `\n📍 *स्थान:* ${location}` : ''}${notes ? `\n💬 *सूचना:* ${notes}` : ''}\n─────────────────────\n_kृपया बुकिंग नोंदणीसाठी आम्हाला भेट द्या._`;
//     waBtn.addEventListener('click', () => {
//       window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank', 'noopener');
//     });

//     goToStep(4);
//     document.querySelectorAll('.step-indicator .step').forEach(el => {
//       const s = parseInt(el.dataset.step);
//       el.classList.remove('active', 'completed');
//       if (s <= 3) el.classList.add('completed');
//     });
//     document.querySelectorAll('.step-line').forEach(el => el.classList.add('active'));

//   } catch (err) {
//     showToast('बुकिंग अयशस्वी. कृपया पुन्हा प्रयत्न करा.', 'error');
//     submitBtn.disabled = false;
//     submitBtn.textContent = 'बुकिंग पाठवा ✓';
//   }
// });

// // Clear error on input
// form.querySelectorAll('input, textarea').forEach(el => {
//   el.addEventListener('input', () => el.classList.remove('error'));
// });

// /* ── Init ── */
// loadServices();