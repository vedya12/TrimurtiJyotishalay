/**
 * Feature 14 — Daily Quote / Shloka of the Day
 * Trimurti Jyotishalay
 */

document.addEventListener('DOMContentLoaded', () => {
  initDailyQuote();
});

let currentQuotesData = [];
let selectedQuoteIndex = 0;
let isMeaningVisible = false;

// UI Translations Dictionary
const quoteI18n = {
  heading: {
    mr: 'आजचा सुविचार',
    hi: 'आज का विचार',
    en: "Today's Thought & Shloka"
  },
  readMeaningBtn: {
    mr: '📖 अर्थ वाचा',
    hi: '📖 अर्थ पढ़ें',
    en: '📖 Read Meaning'
  },
  hideMeaningBtn: {
    mr: '🙈 अर्थ लपवा',
    hi: '🙈 अर्थ छिपाएं',
    en: '🙈 Hide Meaning'
  },
  meaningTitle: {
    mr: '📖 अर्थ',
    hi: '📖 अर्थ',
    en: '📖 Meaning'
  },
  fallbackError: {
    mr: 'आजचा सुविचार लोड होऊ शकला नाही. कृपया नंतर प्रयत्न करा.',
    hi: 'आज का विचार लोड नहीं हो सका। कृपया बाद में प्रयास करें।',
    en: 'Unable to load today\'s quote. Please try again later.'
  }
};

/**
 * 1. Initialize Daily Quote Component
 */
async function initDailyQuote() {
  const container = document.getElementById('dailyQuoteCard');
  if (!container) return;

  try {
    const response = await fetch('data/daily-quotes.json');
    if (!response.ok) throw new Error('Failed to fetch quote data');
    
    currentQuotesData = await response.json();
    if (!currentQuotesData || currentQuotesData.length === 0) {
      throw new Error('Quotes array is empty');
    }

    // 2. Calculate Deterministic Index based on Current Date
    selectedQuoteIndex = getDailyQuoteIndex(currentQuotesData.length);

    // 3. Render Quote
    renderDailyQuote();

    // 4. Hook up Language Switcher Listener
    setupLanguageListener();

  } catch (error) {
    console.error('DailyQuote Error:', error);
    renderFallbackUI(container);
  }
}

/**
 * 2. Calculate Day of Year to map to Quote Index (Modulo)
 */
function getDailyQuoteIndex(totalQuotes) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay); // Day 1 to 365/366

  // Zero-based index modulo total quotes count
  return (dayOfYear - 1) % totalQuotes;
}

/**
 * 3. Get Current Active Language ('mr', 'hi', or 'en')
 */
function getCurrentLang() {
  const activeBtn = document.querySelector('.lang-btn.active');
  if (activeBtn) {
    const lang = activeBtn.getAttribute('data-lang');
    if (['mr', 'hi', 'en'].includes(lang)) return lang;
  }
  return 'mr'; // Default fallback Marathi
}

/**
 * 4. Render UI
 */
function renderDailyQuote() {
  const quote = currentQuotesData[selectedQuoteIndex];
  const lang = getCurrentLang();

  const headingText = quoteI18n.heading[lang] || quoteI18n.heading.mr;
  const readBtnText = isMeaningVisible 
    ? (quoteI18n.hideMeaningBtn[lang] || quoteI18n.hideMeaningBtn.mr)
    : (quoteI18n.readMeaningBtn[lang] || quoteI18n.readMeaningBtn.mr);
  const meaningTitleText = quoteI18n.meaningTitle[lang] || quoteI18n.meaningTitle.mr;

  const quoteText = quote.text[lang] || quote.text.mr;
  const sourceText = quote.source[lang] || quote.source.mr;
  const meaningText = quote.meaning[lang] || quote.meaning.mr;

  const cardElement = document.getElementById('dailyQuoteCard');
  if (!cardElement) return;

  cardElement.innerHTML = `
    <span class="daily-quote-symbol" aria-hidden="true">🕉</span>
    <h3 class="daily-quote-heading" id="quoteHeading">${headingText}</h3>
    
    <div class="daily-quote-body">
      <p class="quote-text">“${quoteText}”</p>
      <div class="quote-source">— ${sourceText}</div>
    </div>

    <button type="button" 
            class="quote-meaning-btn" 
            id="toggleMeaningBtn" 
            aria-expanded="${isMeaningVisible}" 
            aria-controls="quoteMeaningBox">
      ${readBtnText}
    </button>

    <div class="quote-meaning-box ${isMeaningVisible ? 'active' : ''}" id="quoteMeaningBox" role="region" aria-labelledby="toggleMeaningBtn">
      <div class="quote-meaning-title">${meaningTitleText}</div>
      <p class="quote-meaning-content">${meaningText}</p>
    </div>
  `;

  // Attach Toggle Event Listener
  const toggleBtn = document.getElementById('toggleMeaningBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMeaningVisibility);
  }
}

/**
 * 5. Toggle Read/Hide Meaning Visibility
 */
function toggleMeaningVisibility() {
  isMeaningVisible = !isMeaningVisible;
  const meaningBox = document.getElementById('quoteMeaningBox');
  const toggleBtn = document.getElementById('toggleMeaningBtn');
  const lang = getCurrentLang();

  if (meaningBox) {
    meaningBox.classList.toggle('active', isMeaningVisible);
  }

  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', isMeaningVisible.toString());
    toggleBtn.innerHTML = isMeaningVisible 
      ? (quoteI18n.hideMeaningBtn[lang] || quoteI18n.hideMeaningBtn.mr)
      : (quoteI18n.readMeaningBtn[lang] || quoteI18n.readMeaningBtn.mr);
  }
}

/**
 * 6. Synchronize with Website's Existing Language Switcher
 */
function setupLanguageListener() {
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Small timeout to allow active class switch on button before re-rendering
      setTimeout(() => {
        if (currentQuotesData.length > 0) {
          renderDailyQuote();
        }
      }, 50);
    });
  });
}

/**
 * 7. Graceful Fallback if JSON fails to load
 */
function renderFallbackUI(container) {
  const lang = getCurrentLang();
  const errorMsg = quoteI18n.fallbackError[lang] || quoteI18n.fallbackError.mr;

  container.innerHTML = `
    <span class="daily-quote-symbol" aria-hidden="true">🕉</span>
    <div class="quote-error-box">${errorMsg}</div>
  `;
}