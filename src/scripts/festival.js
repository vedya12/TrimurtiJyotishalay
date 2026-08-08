

import { FESTIVAL_DATA, FESTIVAL_DICTIONARY } from '../data/festivals.js';

let currentLang = 'mr';
let selectedCategory = 'all';
let searchQuery = '';
let currentDatePointer = new Date(2026, 7, 1); // Default to August 2026
let countdownTimerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initMonthNavigation();
  initSearchAndFilters();
  initModalListeners();
  
  renderAll();
});

/* Language Switcher Logic */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      langButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentLang = e.target.getAttribute('data-lang') || 'mr';
      updatePageTranslations();
      renderAll();
    });
  });
}

function updatePageTranslations() {
  const dict = FESTIVAL_DICTIONARY[currentLang];
  
  document.getElementById('txtHeroTitle').textContent = dict.heroTitle;
  document.getElementById('txtHeroSub').textContent = dict.heroSub;
  document.getElementById('txtTodayBadge').textContent = dict.todayHighlight;
  document.getElementById('txtUpcomingTitle').textContent = dict.upcomingTitle;
  document.getElementById('searchInput').placeholder = dict.searchPlaceholder;
  document.getElementById('btnResetCurrentMonth').textContent = dict.currentMonth;
  
  document.getElementById('btnCatAll').textContent = dict.all;
  document.getElementById('btnCatFestival').textContent = dict.festival;
  document.getElementById('btnCatVrat').textContent = dict.vrat;
  document.getElementById('btnCatJayanti').textContent = dict.jayanti;
  document.getElementById('btnCatReligious').textContent = dict.religious_day;
  document.getElementById('btnCatSpecial').textContent = dict.special_puja;

  document.getElementById('txtEmptyState').textContent = dict.noFestivalsFound;
  document.getElementById('txtCountdownTitle').textContent = dict.countdownTitle;
  document.getElementById('lblDays').textContent = dict.countdownDays;
  document.getElementById('lblHours').textContent = dict.countdownHours;
  document.getElementById('lblMins').textContent = dict.countdownMins;

  document.getElementById('lblPujaTimeTitle').textContent = `⏰ ${dict.pujaTimeLabel}`;
  document.getElementById('lblVratInfoTitle').textContent = `🚩 ${dict.vratInfoLabel}`;
  document.getElementById('btnModalPanchang').textContent = dict.viewPanchang;
  document.getElementById('btnModalBookService').textContent = dict.bookPuja;
}

/* Month Navigation Logic */
function initMonthNavigation() {
  document.getElementById('btnPrevMonth').addEventListener('click', () => {
    currentDatePointer.setMonth(currentDatePointer.getMonth() - 1);
    renderAll();
  });

  document.getElementById('btnNextMonth').addEventListener('click', () => {
    currentDatePointer.setMonth(currentDatePointer.getMonth() + 1);
    renderAll();
  });

  document.getElementById('btnResetCurrentMonth').addEventListener('click', () => {
    const now = new Date();
    currentDatePointer = new Date(now.getFullYear(), now.getMonth(), 1);
    renderAll();
  });
}

/* Search and Filters Logic */
function initSearchAndFilters() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderFestivalGrid();
  });

  const categoryPills = document.querySelectorAll('.pill-btn');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      categoryPills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      selectedCategory = e.target.getAttribute('data-category');
      renderFestivalGrid();
    });
  });
}

/* Render Master Function */
function renderAll() {
  updateMonthDisplay();
  renderTodayHighlight();
  renderUpcomingChips();
  renderFestivalGrid();
}

function updateMonthDisplay() {
  const monthNames = {
    mr: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
    hi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
  const year = currentDatePointer.getFullYear();
  const monthIdx = currentDatePointer.getMonth();
  const monthStr = monthNames[currentLang][monthIdx];
  document.getElementById('txtCurrentMonthYear').textContent = `${monthStr} ${year}`;
}

/* Render Today's Highlight & Countdown */
function renderTodayHighlight() {
  const dict = FESTIVAL_DICTIONARY[currentLang];
  const todayContent = document.getElementById('todayContent');
  const countdownContainer = document.getElementById('countdownContainer');

  const todayStr = new Date().toISOString().split('T')[0]; // Current Real Date
  const todayFestival = FESTIVAL_DATA.find(f => f.date === todayStr && f.active);

  if (todayFestival) {
    todayContent.innerHTML = `
      <div class="today-info">
        <h3>${todayFestival.icon} ${todayFestival.name[currentLang]}</h3>
        <p>${todayFestival.description[currentLang]}</p>
      </div>
      <button class="btn btn-primary" onclick="window.openFestivalModal('${todayFestival.id}')">${dict.moreDetails}</button>
    `;
    countdownContainer.style.display = 'none';
  } else {
    // Find next upcoming festival from today
    const upcomingList = FESTIVAL_DATA
      .filter(f => f.active && new Date(f.date) >= new Date().setHours(0,0,0,0))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const nextFestival = upcomingList[0];

    if (nextFestival) {
      const formattedDate = formatDateString(nextFestival.date, currentLang);
      todayContent.innerHTML = `
        <div class="today-info">
          <p style="margin-bottom:0.2rem; color:#666;">${dict.noFestivalToday}</p>
          <h3>${dict.nextFestival}: ${nextFestival.icon} ${nextFestival.name[currentLang]}</h3>
          <p>📅 <strong>${formattedDate}</strong></p>
        </div>
        <button class="btn btn-outline-gold" onclick="window.openFestivalModal('${nextFestival.id}')">${dict.moreDetails}</button>
      `;

      countdownContainer.style.display = 'flex';
      startCountdown(nextFestival.date);
    } else {
      todayContent.innerHTML = `<p>${dict.noFestivalToday}</p>`;
      countdownContainer.style.display = 'none';
    }
  }
}

function startCountdown(targetDateStr) {
  if (countdownTimerInterval) clearInterval(countdownTimerInterval);

  const targetDate = new Date(`${targetDateStr}T00:00:00`).getTime();

  const update = () => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      clearInterval(countdownTimerInterval);
      document.getElementById('cntDays').textContent = '00';
      document.getElementById('cntHours').textContent = '00';
      document.getElementById('cntMins').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('cntDays').textContent = String(days).padStart(2, '0');
    document.getElementById('cntHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cntMins').textContent = String(minutes).padStart(2, '0');
  };

  update();
  countdownTimerInterval = setInterval(update, 60000); // 1-minute updates for CPU efficiency
}

/* Render Upcoming 30-Day Quick Chips */
function renderUpcomingChips() {
  const container = document.getElementById('upcomingChipsList');
  container.innerHTML = '';

  const now = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(now.getDate() + 30);

  const upcoming = FESTIVAL_DATA.filter(f => {
    const fDate = new Date(f.date);
    return f.active && fDate >= now.setHours(0,0,0,0) && fDate <= thirtyDaysLater;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  upcoming.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'upcoming-chip';
    const d = new Date(item.date);
    const dayMonth = `${d.getDate()} ${getMonthShortName(d.getMonth(), currentLang)}`;

    chip.innerHTML = `
      <span>${item.icon} ${item.name[currentLang]}</span>
      <span class="chip-date">${dayMonth}</span>
    `;

    chip.addEventListener('click', () => window.openFestivalModal(item.id));
    container.appendChild(chip);
  });
}

/* Render Festival Cards Grid */
function renderFestivalGrid() {
  const container = document.getElementById('festivalGridContainer');
  const emptyState = document.getElementById('emptyStateBox');
  const dict = FESTIVAL_DICTIONARY[currentLang];
  container.innerHTML = '';

  const selectedYear = currentDatePointer.getFullYear();
  const selectedMonth = currentDatePointer.getMonth();

  const filtered = FESTIVAL_DATA.filter(f => {
    if (!f.active) return false;

    const fDate = new Date(f.date);
    const matchesMonthYear = fDate.getFullYear() === selectedYear && fDate.getMonth() === selectedMonth;
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;

    const nameTxt = (f.name[currentLang] || '').toLowerCase();
    const descTxt = (f.description[currentLang] || '').toLowerCase();
    const matchesSearch = !searchQuery || nameTxt.includes(searchQuery) || descTxt.includes(searchQuery);

    return matchesMonthYear && matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'festival-card';

      const formattedDate = formatDateString(item.date, currentLang);
      const dayName = getDayName(item.date, currentLang);
      const categoryLabel = dict[item.category] || item.category;

      let serviceBookingBtn = '';
      if (item.relatedServiceId) {
        serviceBookingBtn = `<a href="booking.html?service=${encodeURIComponent(item.relatedServiceId)}" class="btn btn-primary">${dict.bookPuja}</a>`;
      }

      card.innerHTML = `
        <div>
          <div class="card-header-row">
            <span class="card-icon">${item.icon}</span>
            <span class="card-category-tag">${categoryLabel}</span>
          </div>
          <h3 class="card-title">${item.name[currentLang]}</h3>
          <div class="card-date-info">📅 ${formattedDate} (${dayName})</div>
          <p class="card-description">${item.description[currentLang]}</p>
        </div>
        <div class="card-actions">
          <button class="btn-details" onclick="window.openFestivalModal('${item.id}')">${dict.moreDetails}</button>
          ${serviceBookingBtn}
        </div>
      `;

      container.appendChild(card);
    });
  }
}

/* Modal Control & Accessibility */
function initModalListeners() {
  const modal = document.getElementById('festivalModal');
  const closeBtn = document.getElementById('btnCloseModal');

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });

  window.openFestivalModal = (id) => {
    const item = FESTIVAL_DATA.find(f => f.id === id);
    if (!item) return;

    const dict = FESTIVAL_DICTIONARY[currentLang];
    document.getElementById('mdlIcon').textContent = item.icon;
    document.getElementById('mdlTitle').textContent = item.name[currentLang];
    document.getElementById('mdlCategory').textContent = dict[item.category] || item.category;
    document.getElementById('mdlDate').textContent = formatDateString(item.date, currentLang);
    document.getElementById('mdlDay').textContent = getDayName(item.date, currentLang);
    document.getElementById('mdlDescription').textContent = item.description[currentLang];

    // Puja timing
    const blockPuja = document.getElementById('blockPujaTime');
    if (item.pujaTime && item.pujaTime[currentLang]) {
      blockPuja.style.display = 'block';
      document.getElementById('mdlPujaTime').textContent = item.pujaTime[currentLang];
    } else {
      blockPuja.style.display = 'none';
    }

    // Vrat info
    const blockVrat = document.getElementById('blockVratInfo');
    if (item.vratInfo && item.vratInfo[currentLang]) {
      blockVrat.style.display = 'block';
      document.getElementById('mdlVratInfo').textContent = item.vratInfo[currentLang];
    } else {
      blockVrat.style.display = 'none';
    }

    // Panchang button link
    const panchangBtn = document.getElementById('btnModalPanchang');
    panchangBtn.href = `panchang.html?date=${item.date}`;

    // Booking service button link
    const bookBtn = document.getElementById('btnModalBookService');
    if (item.relatedServiceId) {
      bookBtn.style.display = 'inline-block';
      bookBtn.href = `booking.html?service=${encodeURIComponent(item.relatedServiceId)}`;
    } else {
      bookBtn.style.display = 'none';
    }

    modal.style.display = 'flex';
  };
}

function closeModal() {
  document.getElementById('festivalModal').style.display = 'none';
}

/* Helper Functions */
function formatDateString(dateStr, lang) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = getMonthShortName(d.getMonth(), lang);
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function getMonthShortName(monthIdx, lang) {
  const months = {
    mr: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"],
    hi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  };
  return months[lang][monthIdx];
}

function getDayName(dateStr, lang) {
  const d = new Date(dateStr);
  const days = {
    mr: ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
    hi: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  return days[lang][d.getDay()];
}