/**
 * Trimurti Jyotishalay - Gallery & Lightbox Logic
 */

// ── 1. DEMO DATA ──
const galleryData = [
  {
    id: 1,
    category: "puja",
    title: {
      mr: "विशेष महापूजा विधी",
      hi: "विशेष महापूजा विधि",
      en: "Special Mahapuja Ceremony"
    },
    // High-quality SVG placeholders formatted specifically for Trimurti Jyotishalay
    image: generateSpiritualSVG("विशेष महापूजा", "🪔", "puja")
  },
  {
    id: 2,
    category: "festival",
    title: {
      mr: "महाशिवरात्री उत्सव सोहळा",
      hi: "महाशिवरात्रि उत्सव समारोह",
      en: "Mahashivratri Celebration"
    },
    image: generateSpiritualSVG("महाशिवरात्री उत्सव", "🔱", "festival")
  },
  {
    id: 3,
    category: "temple",
    title: {
      mr: "मुख्य मंदिर मुख्य प्रवेशद्वार",
      hi: "मुख्य मंदिर मुख्य द्वार",
      en: "Main Temple Entrance"
    },
    image: generateSpiritualSVG("मंदिर परिसर", "🛕", "temple")
  },
  {
    id: 4,
    category: "guruji",
    title: {
      mr: "गुरुजींचे मार्गदर्शन व मार्गदर्शन सत्र",
      hi: "गुरुजी का मार्गदर्शन सत्र",
      en: "Guruji Guidance Session"
    },
    image: generateSpiritualSVG("गुरुजी दर्शन", "🙏", "guruji")
  },
  {
    id: 5,
    category: "events",
    title: {
      mr: "वार्षिक सत्यनारायण महापूजा",
      hi: "वार्षिक सत्यनारायण पूजा",
      en: "Annual Satyanarayan Puja"
    },
    image: generateSpiritualSVG("वार्षिक महापूजा", "🌸", "events")
  },
  {
    id: 6,
    category: "puja",
    title: {
      mr: "नवग्रह शांती विधी",
      hi: "नवग्रह शांति पूजा",
      en: "Navgrah Shanti Ritual"
    },
    image: generateSpiritualSVG("नवग्रह शांती", "☸", "puja")
  },
  {
    id: 7,
    category: "festival",
    title: {
      mr: "दिवाळी दीपोत्सव सजावट",
      hi: "दीपावली दीपोत्सव",
      en: "Diwali Deepotsav Decoration"
    },
    image: generateSpiritualSVG("दिवाळी उत्सव", "🪔", "festival")
  },
  {
    id: 8,
    category: "temple",
    title: {
      mr: "मंदिर गाभारा व मूर्ती शृंगार",
      hi: "मंदिर गर्भगृह दर्शन",
      en: "Sanctum Sanctorum Decoration"
    },
    image: generateSpiritualSVG("गाभारा दर्शन", "🕉", "temple")
  },
  {
    id: 9,
    category: "festival",
    title: {
        mr: "गुढीपाडवा उत्सव",
        hi: "गुड़ी पड़वा उत्सव",
        en: "Gudi Padwa Festival"
    },
    image: "assets/gallery/gudi-padwa.jpg"
  }
];

// ── 2. TRANSLATIONS DICTIONARY ──
const translations = {
  mr: {
    nav_home: "होम",
    nav_services: "सेवा",
    nav_panchang: "पंचांग",
    nav_gallery: "गॅलरी",
    nav_bhajans: "भजने",
    nav_about: "आमच्याबद्दल",
    nav_contact: "संपर्क",
    nav_book: "+ बुक करा",
    hero_title: "आमची गॅलरी",
    hero_tagline: "पवित्र क्षण आणि आपल्या आठवणी",
    cat_all: "सर्व",
    cat_puja: "पूजा",
    cat_festival: "उत्सव",
    cat_temple: "मंदिर",
    cat_guruji: "गुरुजी",
    cat_events: "कार्यक्रम",
    empty_title: "या श्रेणीमध्ये सध्या कोणतेही फोटो उपलब्ध नाहीत.",
    empty_sub: "लवकरच नवीन फोटो जोडले जातील.",
    view_text: "🔍 पहा"
  },
  hi: {
    nav_home: "होम",
    nav_services: "सेवाएं",
    nav_panchang: "पंचांग",
    nav_gallery: "गैलरी",
    nav_bhajans: "भजन",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क",
    nav_book: "+ बुक करें",
    hero_title: "हमारी गैलरी",
    hero_tagline: "पावन क्षण और पावन स्मृतियां",
    cat_all: "सभी",
    cat_puja: "पूजा",
    cat_festival: "उत्सव",
    cat_temple: "मंदिर",
    cat_guruji: "गुरुजी",
    cat_events: "कार्यक्रम",
    empty_title: "इस श्रेणी में वर्तमान में कोई चित्र उपलब्ध नहीं हैं।",
    empty_sub: "शीघ्र ही नए चित्र जोड़े जाएंगे।",
    view_text: "🔍 देखें"
  },
  en: {
    nav_home: "Home",
    nav_services: "Services",
    nav_panchang: "Panchang",
    nav_gallery: "Gallery",
    nav_bhajans: "Bhajans",
    nav_about: "About",
    nav_contact: "Contact",
    nav_book: "+ Book Now",
    hero_title: "Our Gallery",
    hero_tagline: "Sacred moments and memories from Trimurti Jyotishalay",
    cat_all: "All",
    cat_puja: "Puja",
    cat_festival: "Festivals",
    cat_temple: "Temple",
    cat_guruji: "Guruji",
    cat_events: "Events",
    empty_title: "No photographs available in this category.",
    empty_sub: "New photographs will be added soon.",
    view_text: "🔍 View"
  }
};

// ── 3. STATE MANAGEMENT ──
let currentLang = localStorage.getItem('selectedLanguage') || 'mr';
let currentCategory = 'all';
let filteredItems = [];
let activeLightboxIndex = 0;

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const emptyState = document.getElementById('galleryEmptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const languageSelect = document.getElementById('languageSelect');

// Lightbox Elements
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxBadge = document.getElementById('lightboxCategoryBadge');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');

// ── 4. INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  // Sync Language Selector
  if (languageSelect) {
    languageSelect.value = currentLang;
    languageSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('selectedLanguage', currentLang);
      updatePageLanguage();
      renderGallery();
    });
  }

  // Language Switcher Initialization
const langBtns = document.querySelectorAll('.lang-btn');

function syncLanguageUI(lang) {
  langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.getAttribute('data-lang');
    localStorage.setItem('selectedLanguage', currentLang);
    syncLanguageUI(currentLang);
    updatePageLanguage();
    renderGallery();
  });
});

// Set active button on load
syncLanguageUI(currentLang);

  // Bind Filter Events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      currentCategory = btn.getAttribute('data-category');
      renderGallery();
    });
  });

  // Bind Lightbox Controls
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxPrevBtn.addEventListener('click', showPrevImage);
  lightboxNextBtn.addEventListener('click', showNextImage);

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });

  // Initial Load with Skeletons
  renderSkeletons();
  setTimeout(() => {
    updatePageLanguage();
    renderGallery();
  }, 250);
});

// ── 5. RENDER FUNCTIONS ──
function renderSkeletons() {
  galleryGrid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('');
}

function renderGallery() {
  // Filter Array
  filteredItems = currentCategory === 'all' 
    ? galleryData 
    : galleryData.filter(item => item.category === currentCategory);

  if (filteredItems.length === 0) {
    galleryGrid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  galleryGrid.style.display = 'grid';

  const viewText = translations[currentLang]?.view_text || '🔍 View';

  galleryGrid.innerHTML = filteredItems.map((item, index) => {
    const itemTitle = item.title[currentLang] || item.title.mr;
    const catLabel = getCategoryLabel(item.category);

    return `
      <div class="gallery-card" onclick="openLightbox(${index})" tabindex="0" role="button" aria-label="${itemTitle}">
        <img src="${item.image}" alt="${itemTitle}" loading="lazy" />
        <div class="card-overlay">
          <span class="overlay-category">${catLabel}</span>
          <h3 class="overlay-title">${itemTitle}</h3>
          <span class="overlay-view-btn">${viewText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function getCategoryLabel(catKey) {
  const map = {
    puja: translations[currentLang]?.cat_puja || "पूजा",
    festival: translations[currentLang]?.cat_festival || "उत्सव",
    temple: translations[currentLang]?.cat_temple || "मंदिर",
    guruji: translations[currentLang]?.cat_guruji || "गुरुजी",
    events: translations[currentLang]?.cat_events || "कार्यक्रम"
  };
  return map[catKey] || catKey;
}

// ── 6. LIGHTBOX LOGIC ──
window.openLightbox = function(index) {
  activeLightboxIndex = index;
  updateLightboxContent();
  lightboxOverlay.classList.add('active');
  lightboxOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

function closeLightbox() {
  lightboxOverlay.classList.remove('active');
  lightboxOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showPrevImage() {
  activeLightboxIndex = (activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
  updateLightboxContent();
}

function showNextImage() {
  activeLightboxIndex = (activeLightboxIndex + 1) % filteredItems.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const item = filteredItems[activeLightboxIndex];
  if (!item) return;

  const itemTitle = item.title[currentLang] || item.title.mr;
  const catLabel = getCategoryLabel(item.category);

  lightboxImg.src = item.image;
  lightboxImg.alt = itemTitle;
  lightboxTitle.textContent = itemTitle;
  lightboxBadge.textContent = catLabel;
}

// ── 7. LANGUAGE SWITCHING ──
function updatePageLanguage() {
  const dict = translations[currentLang] || translations.mr;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

// ── 8. SVG PLACEHOLDER GENERATOR ──
function generateSpiritualSVG(title, symbol, category) {
  const bgColors = {
    puja: '%238b1a1a',
    festival: '%23c8860a',
    temple: '%235c1d24',
    guruji: '%237c2d12',
    events: '%23854d0e'
  };

  const bg = bgColors[category] || '%238b1a1a';
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="${bg}"/><circle cx="300" cy="180" r="70" fill="%23ffffff" opacity="0.12"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="64" fill="%23e2c08d">${symbol}</text><text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-weight="bold" font-size="28" fill="%23ffffff" font-family="sans-serif">${title}</text><text x="50%" y="82%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%23ebdcc4" font-family="sans-serif">Trimurti Jyotishalay</text></svg>`;

  return `data:image/svg+xml;utf8,${svgString}`;
}