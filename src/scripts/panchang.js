// Add this at the very top of panchang.js
document.addEventListener("DOMContentLoaded", () => {
  const mountPoint = document.getElementById('panchang-mount-point');
  
  if (mountPoint) {
    // Inject the HTML structure
    mountPoint.innerHTML = `
      <div class="panchang-widget" id="panchangWidget">
  <!-- Header -->
  <div class="panchang-header">
    <div class="panchang-title">
      <span class="om-icon">🕉</span>
      <div>
        <h2>Today's Panchang</h2>
        <span class="panchang-date" id="pDate">Loading date...</span>
      </div>
    </div>
    <div class="panchang-actions">
      <button id="btnCopyPanchang" class="icon-btn" title="Copy Panchang">📋</button>
      <button id="btnSharePanchang" class="icon-btn" title="Share via WhatsApp">💬</button>
      <button id="btnPdfPanchang" class="icon-btn" title="Download PDF">📄</button>
    </div>
  </div>

  <!-- Skeleton Loader (Visible during data fetch) -->
  <div class="panchang-grid panchang-skeleton" id="panchangSkeleton">
    <div class="skel-card"></div><div class="skel-card"></div>
    <div class="skel-card"></div><div class="skel-card"></div>
    <div class="skel-card"></div><div class="skel-card"></div>
    <div class="skel-card skel-wide"></div>
    <div class="skel-card skel-wide"></div>
  </div>

  <!-- Main Content Grid (Hidden initially) -->
  <div class="panchang-grid" id="panchangGrid" style="display: none;">
    <!-- Celestial Times -->
    <div class="p-card">
      <div class="p-icon">🌞</div>
      <div class="p-info"><small>Sunrise</small><strong id="pSunrise">--</strong></div>
    </div>
    <div class="p-card">
      <div class="p-icon">🌇</div>
      <div class="p-info"><small>Sunset</small><strong id="pSunset">--</strong></div>
    </div>

    <!-- Core Panchang -->
    <div class="p-card">
      <div class="p-icon">🌙</div>
      <div class="p-info"><small>Tithi</small><strong id="pTithi">--</strong></div>
    </div>
    <div class="p-card">
      <div class="p-icon">⭐</div>
      <div class="p-info"><small>Nakshatra</small><strong id="pNakshatra">--</strong></div>
    </div>
    <div class="p-card">
      <div class="p-icon">📖</div>
      <div class="p-info"><small>Yoga</small><strong id="pYoga">--</strong></div>
    </div>
    <div class="p-card">
      <div class="p-icon">🪔</div>
      <div class="p-info"><small>Karana</small><strong id="pKarana">--</strong></div>
    </div>

    <!-- Inauspicious / Auspicious Timings -->
    <div class="p-card timing-card alert">
      <div class="p-icon">🕒</div>
      <div class="p-info"><small>Rahu Kaal</small><strong id="pRahuKaal">--</strong></div>
    </div>
    <div class="p-card timing-card warning">
      <div class="p-icon">⏳</div>
      <div class="p-info"><small>Yamaganda</small><strong id="pYamaganda">--</strong></div>
    </div>
    <div class="p-card timing-card neutral">
      <div class="p-icon">🐍</div>
      <div class="p-info"><small>Gulika Kalam</small><strong id="pGulika">--</strong></div>
    </div>

    <!-- Festival & Recommendation -->
    <div class="p-card highlight">
      <div class="p-icon">🙏</div>
      <div class="p-info"><small>Today's Festival</small><strong id="pFestival">--</strong></div>
    </div>
    <div class="p-card highlight secondary">
      <div class="p-icon">📿</div>
      <div class="p-info"><small>Recommended Puja</small><strong id="pRecommendedPuja">--</strong></div>
    </div>

    <!-- Do's and Don'ts Lists -->
    <div class="p-card list-card good">
      <small>🟢 Good For</small>
      <ul id="pGoodFor"></ul>
    </div>
    <div class="p-card list-card avoid">
      <small>🔴 Avoid</small>
      <ul id="pAvoid"></ul>
    </div>
  </div>

  <!-- Footer -->
  <div class="panchang-footer">
    <button class="btn-primary" id="btnViewFull">View Full Panchang →</button>
  </div>
</div>
    `;
    
    // Once the HTML is injected, initialize the widget data
    initPanchangWidget();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initPanchangWidget();
});

function initPanchangWidget() {
  fetchPanchangData();
  setupActionListeners();
}

/**
 * Simulates fetching data from a REST API. 
 * To switch to a real API, replace this body with:
 * return fetch('/api/panchang/today').then(res => res.json());
 */
function getPanchangAPI() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        date: "7 August 2026",
        sunrise: "06:12 AM",
        sunset: "06:58 PM",
        tithi: "Shukla Tritiya",
        nakshatra: "Rohini",
        yoga: "Siddha",
        karana: "Garaja",
        rahuKaal: "01:30 PM - 03:00 PM",
        yamaganda: "09:00 AM - 10:30 AM",
        gulika: "06:00 AM - 07:30 AM",
        festival: "Nag Panchami",
        goodFor: ["Business", "Education", "Housewarming"],
        avoid: ["Marriage", "Vehicle Purchase"],
        recommendedPuja: "Nag Puja"
      });
    }, 1200); // Simulated network delay for skeleton loader
  });
}

/**
 * Fetches the data and manages the UI state (Skeleton -> Data)
 */
async function fetchPanchangData() {
  try {
    const panchangData = await getPanchangAPI();
    
    // Store data globally for copy/share functionality
    window.currentPanchangData = panchangData;
    
    renderPanchang(panchangData);
    
    // Switch from skeleton to real grid
    document.getElementById('panchangSkeleton').style.display = 'none';
    document.getElementById('panchangGrid').style.display = 'grid';
  } catch (error) {
    console.error("Failed to load Panchang data:", error);
    document.getElementById('panchangSkeleton').innerHTML = `<p style="color: red; padding: 20px;">Unable to load Panchang data. Please try again later.</p>`;
  }
}

/**
 * Populates the DOM with the JSON data
 */
function renderPanchang(data) {
  document.getElementById('pDate').textContent = data.date;
  document.getElementById('pSunrise').textContent = data.sunrise;
  document.getElementById('pSunset').textContent = data.sunset;
  document.getElementById('pTithi').textContent = data.tithi;
  document.getElementById('pNakshatra').textContent = data.nakshatra;
  document.getElementById('pYoga').textContent = data.yoga;
  document.getElementById('pKarana').textContent = data.karana;
  
  document.getElementById('pRahuKaal').textContent = data.rahuKaal;
  document.getElementById('pYamaganda').textContent = data.yamaganda;
  document.getElementById('pGulika').textContent = data.gulika;
  
  document.getElementById('pFestival').textContent = data.festival || "None";
  document.getElementById('pRecommendedPuja').textContent = data.recommendedPuja || "Daily Puja";

  // Render Arrays (Good For / Avoid)
  const ulGood = document.getElementById('pGoodFor');
  ulGood.innerHTML = data.goodFor.map(item => `<li>✔ ${item}</li>`).join('');
  
  const ulAvoid = document.getElementById('pAvoid');
  ulAvoid.innerHTML = data.avoid.map(item => `<li>✖ ${item}</li>`).join('');
}

/**
 * Setup event listeners for Copy, Share, and PDF buttons
 */
function setupActionListeners() {
  document.getElementById('btnCopyPanchang').addEventListener('click', () => {
    const text = generatePanchangText(window.currentPanchangData);
    navigator.clipboard.writeText(text).then(() => {
      alert("Panchang copied to clipboard!");
    });
  });

  document.getElementById('btnSharePanchang').addEventListener('click', () => {
    if(!window.currentPanchangData) return;
    const text = generatePanchangText(window.currentPanchangData);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  });

  // Future integration for PDF generation or Modal
  document.getElementById('btnViewFull').addEventListener('click', () => {
    alert("This will open a modal with extended data like Choghadiya, Brahma Muhurta, and Moon Signs!");
  });
}

/**
 * Formats the JSON data into a clean text string for sharing
 */
function generatePanchangText(data) {
  return `🕉 *Today's Panchang* - Trimurti Jyotishalay 🕉
📅 Date: ${data.date}

🌞 Sunrise: ${data.sunrise} | 🌇 Sunset: ${data.sunset}
🌙 Tithi: ${data.tithi}
⭐ Nakshatra: ${data.nakshatra}
📖 Yoga: ${data.yoga}
🪔 Karana: ${data.karana}

⚠️ *Important Timings*
🕒 Rahu Kaal: ${data.rahuKaal}
⏳ Yamaganda: ${data.yamaganda}

🙏 *Festival:* ${data.festival}
📿 *Recommended Puja:* ${data.recommendedPuja}

🟢 *Good For:* ${data.goodFor.join(", ")}
🔴 *Avoid:* ${data.avoid.join(", ")}

_Check daily muhurtas and book pujas at Trimurti Jyotishalay._`;
}
