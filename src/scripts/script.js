/**
 * Trimurti Jyotishalay — Production Script
 * Features: Language switcher, Hamburger menu, Form validation,
 *           WhatsApp form delivery, Scroll-to-top, Scroll reveal, Active nav
 */

/* ── CHANGE THIS to the real WhatsApp number (with country code, no + or spaces) ── */
const WHATSAPP_NUMBER = '919999999999';

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. LANGUAGE SWITCHER
     ===================================================== */
  const langBtns = document.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem('tj_lang') || 'mr';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tj_lang', lang);

    // Update every element that has a data-{lang} attribute
    document.querySelectorAll('[data-mr]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text) {
        // For inputs / selects keep placeholder separate
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update select option text
    document.querySelectorAll('select option[data-mr]').forEach(opt => {
      const text = opt.getAttribute('data-' + lang);
      if (text) opt.textContent = text;
    });

    // Mark active lang button
    langBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    // Update html lang attribute
    const htmlLangMap = { mr: 'mr', hi: 'hi', en: 'en' };
    document.documentElement.lang = htmlLangMap[lang] || 'mr';
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  // Apply stored or default language on load
  applyLanguage(currentLang);


  /* =====================================================
     2. HAMBURGER MENU
     ===================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });


  /* =====================================================
     3. ACTIVE NAV LINK ON SCROLL
     ===================================================== */
  const sections = document.querySelectorAll('section[id], div[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  function setActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });
    allNavLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });


  /* =====================================================
     4. NAVBAR SHADOW ON SCROLL
     ===================================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(200,134,10,.22)'
      : '0 2px 12px rgba(200,134,10,.15)';
  }, { passive: true });

  /* =====================================================
     5. SCROLL-TO-TOP BUTTON
     ===================================================== */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* =====================================================
     6. SCROLL REVEAL ANIMATION
     ===================================================== */
  const revealEls = document.querySelectorAll(
    '.svc-card, .about-grid, .appt-form-wrap, .about-badge, .contact-item, .loc-banner'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* =====================================================
     7. TOAST NOTIFICATION HELPER
     ===================================================== */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.style.background = type === 'error' ? '#c0392b' : '#1a7a3c';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* =====================================================
     8. APPOINTMENT FORM — VALIDATION + WHATSAPP DELIVERY
     When submitted, a pre-filled WhatsApp message opens on
     the panditji's phone. No backend / server needed.
     ===================================================== */
  const form = document.getElementById('appointmentForm');

  /* Human-readable service labels for the WhatsApp message */
  const serviceLabels = {
    kundali:  { mr: 'कुंडली विश्लेषण',  hi: 'कुंडली विश्लेषण',  en: 'Kundali Analysis' },
    marriage: { mr: 'विवाह जुळवणी',     hi: 'विवाह मिलान',      en: 'Kundali Matching' },
    muhurta:  { mr: 'मुहूर्त सल्ला',    hi: 'मुहूर्त परामर्श',  en: 'Muhurta Advice' },
    vastu:    { mr: 'वास्तु सल्ला',     hi: 'वास्तु परामर्श',   en: 'Vastu Advice' },
    puja:     { mr: 'पूजाविधी',         hi: 'पूजा विधि',        en: 'Puja Ritual' },
    bhagwat:  { mr: 'भागवत कथा',        hi: 'भागवत कथा',        en: 'Bhagavat Katha' },
    other:    { mr: 'इतर',              hi: 'अन्य',             en: 'Other' }
  };

  const messages = {
    mr: {
      nameRequired:    'कृपया आपले पूर्ण नाव प्रविष्ट करा.',
      phoneRequired:   'कृपया वैध मोबाईल नंबर प्रविष्ट करा.',
      serviceRequired: 'कृपया सेवेचा प्रकार निवडा.',
      sending:         '⏳ WhatsApp उघडत आहे...',
      success:         '✅ अपॉइंटमेंट विनंती WhatsApp वर पाठवली गेली!'
    },
    hi: {
      nameRequired:    'कृपया अपना पूरा नाम दर्ज करें।',
      phoneRequired:   'कृपया वैध मोबाइल नंबर दर्ज करें।',
      serviceRequired: 'कृपया सेवा का प्रकार चुनें।',
      sending:         '⏳ WhatsApp खुल रहा है...',
      success:         '✅ अपॉइंटमेंट अनुरोध WhatsApp पर भेजा गया!'
    },
    en: {
      nameRequired:    'Please enter your full name.',
      phoneRequired:   'Please enter a valid mobile number.',
      serviceRequired: 'Please select a service type.',
      sending:         '⏳ Opening WhatsApp...',
      success:         '✅ Appointment request sent via WhatsApp!'
    }
  };

  function getMsg(key) {
    return (messages[currentLang] || messages.mr)[key];
  }

  function buildWhatsAppMessage(name, phone, serviceKey, date, message) {
    const lang = currentLang;
    const svcLabel = serviceKey
      ? ((serviceLabels[serviceKey] || {})[lang] || serviceKey)
      : '—';
    const dateStr = date
      ? new Date(date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
      : '—';

    const lines = {
      mr: [
        '🕉 *त्रिमूर्ती ज्योतिषालय — अपॉइंटमेंट विनंती*',
        '─────────────────────',
        `👤 *नाव:* ${name}`,
        `📞 *मोबाईल:* ${phone}`,
        `🛎 *सेवा:* ${svcLabel}`,
        `📅 *तारीख:* ${dateStr}`,
        message ? `💬 *संदेश:* ${message}` : '',
        '─────────────────────',
        '_Sent via trimurtijyotishalay.com_'
      ],
      hi: [
        '🕉 *त्रिमूर्ती ज्योतिषालय — अपॉइंटमेंट अनुरोध*',
        '─────────────────────',
        `👤 *नाम:* ${name}`,
        `📞 *मोबाइल:* ${phone}`,
        `🛎 *सेवा:* ${svcLabel}`,
        `📅 *तारीख:* ${dateStr}`,
        message ? `💬 *संदेश:* ${message}` : '',
        '─────────────────────',
        '_Sent via trimurtijyotishalay.com_'
      ],
      en: [
        '🕉 *Trimurti Jyotishalay — Appointment Request*',
        '─────────────────────',
        `👤 *Name:* ${name}`,
        `📞 *Mobile:* ${phone}`,
        `🛎 *Service:* ${svcLabel}`,
        `📅 *Date:* ${dateStr}`,
        message ? `💬 *Message:* ${message}` : '',
        '─────────────────────',
        '_Sent via trimurtijyotishalay.com_'
      ]
    };

    return (lines[lang] || lines.mr).filter(Boolean).join('\n');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameEl    = form.querySelector('#fname');
    const phoneEl   = form.querySelector('#fphone');
    const serviceEl = form.querySelector('#fservice');
    const dateEl    = form.querySelector('#fdate');
    const msgEl     = form.querySelector('#fmessage');

    // Reset errors
    [nameEl, phoneEl, serviceEl].forEach(f => f.classList.remove('error'));

    // Validate name
    if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
      nameEl.classList.add('error');
      showToast(getMsg('nameRequired'), 'error');
      nameEl.focus();
      valid = false;
    }

    // Validate phone (Indian mobile: starts 6-9, 10 digits)
    if (valid) {
      const phoneVal = phoneEl.value.trim().replace(/\s|-/g, '');
      if (!/^[6-9]\d{9}$/.test(phoneVal)) {
        phoneEl.classList.add('error');
        showToast(getMsg('phoneRequired'), 'error');
        phoneEl.focus();
        valid = false;
      }
    }

    // Validate service
    if (valid && !serviceEl.value) {
      serviceEl.classList.add('error');
      showToast(getMsg('serviceRequired'), 'error');
      serviceEl.focus();
      valid = false;
    }

    if (!valid) return;

    // ── Build WhatsApp URL and open it ──
    showToast(getMsg('sending'), 'success');

    const waText = buildWhatsAppMessage(
      nameEl.value.trim(),
      phoneEl.value.trim(),
      serviceEl.value,
      dateEl.value,
      msgEl.value.trim()
    );

    const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    // Short delay so the toast is visible before browser navigates
    setTimeout(() => {
      window.open(waURL, '_blank', 'noopener,noreferrer');
      showToast(getMsg('success'), 'success');
      form.reset();
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  });

  // Clear error styling live as user types
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input',  () => field.classList.remove('error'));
    field.addEventListener('change', () => field.classList.remove('error'));
  });

}); // end DOMContentLoaded

/* ============================================================
   BHAJAN SANGRAH — Divine Chants integration
   All media served from GitHub raw CDN (no local files needed)
   ============================================================ */
(function () {
  const CDN = 'https://raw.githubusercontent.com/vedya12/Divine-Chants/main/';

  /* ── Deity data ── */
  const deities = [
    {
      id: 'ganesh',
      name: 'श्रीगणेश',
      img: 'p1ganesh.webp',
      bhajans: [
        { title: 'श्री गणपती अथर्वशीर्ष', audio: 'atharva.mp3' },
        { title: 'श्री गणेश पंचरत्नम', audio: 'panch.mp3' }
      ]
    },
    {
      id: 'datta',
      name: 'श्रीदत्त',
      img: 'p2shri datta.jpg',
      bhajans: [
        { title: 'श्री दत्त माला मंत्र', audio: 'dattaMala.mp3' }
      ]
    },
    {
      id: 'devi',
      name: 'देवी',
      img: 'p3devi.jpg',
      bhajans: [
        { title: 'श्री अंबे तू है जगदंबे', audio: null },
        { title: 'श्री देवी कृपाकटाक्ष', audio: null },
        { title: 'श्री देवी अथर्वशीर्षम्', audio: null },
        { title: 'श्री या देवी सर्वभूतेषु', audio: null },
        { title: 'अग्नि भद्रकाली', audio: null },
        { title: 'नवदुर्गा', audio: null },
        { title: 'ज्या सुखा', audio: 'jyaSukha.mp3' },
        { title: 'जगद्वंद्या', audio: 'jagadvandya.mp3' }
      ]
    },
    {
      id: 'ram',
      name: 'श्रीराम',
      img: 'p4ram.jpg',
      bhajans: [
        { title: 'राम अवतार', audio: 'ramAvatar.mp3' },
        { title: 'हरिपाठ', audio: null },
        { title: 'रक्षा', audio: 'raksha.mp3' }
      ]
    },
    {
      id: 'vishnu',
      name: 'श्रीविष्णु',
      img: 'p5vishnu.jpg',
      bhajans: [
        { title: 'विष्णु सहस्रनाम', audio: 'vishnu.mp3' },
        { title: 'श्रीसूक्तम्', audio: null },
        { title: 'पुरुषसूक्तम्', audio: null },
        { title: 'श्री हरि स्तोत्रम्', audio: null }
      ]
    },
    {
      id: 'shani',
      name: 'शनिदेव',
      img: 'p6shani.jpg',
      bhajans: [
        { title: 'शनी चाळीसा', audio: 'shani.mp3' }
      ]
    },
    {
      id: 'shiv',
      name: 'श्रीशिव',
      img: 'p7shivji.jpg',
      bhajans: [
        { title: 'श्री शिवस्तुति', audio: null },
        { title: 'श्री शिव महिम्ना स्तोत्रम्', audio: 'mahimna.mp3' },
        { title: 'शिव मानस पूजा', audio: 'manasPuja.mp3' },
        { title: 'बिल्वाष्टकम्', audio: 'bilwa8.mp3' },
        { title: 'लिङ्गाष्टकम्', audio: 'linga8.mp3' },
        { title: 'शिवताण्डवस्तोत्रम्', audio: 'tandav.mp3' },
        { title: 'श्रीरुद्राष्टकम्', audio: 'rudra8.mp3' },
        { title: 'नटराज स्तुति', audio: 'natraj.mp3' },
        { title: 'ॐ जय शिव ओंकारा', audio: null }
      ]
    },
    {
      id: 'hanuman',
      name: 'श्रीहनुमान',
      img: 'p8hanuman.jpg',
      bhajans: [
        { title: 'हनुमान चाळीसा', audio: 'hanuman.mp3' },
        { title: 'हनुमान आरती', audio: null },
        { title: 'श्री मारुती स्तोत्र', audio: null },
        { title: 'बजरंग बाण', audio: null }
      ]
    },
    {
      id: 'kuber',
      name: 'श्रीकुबेर',
      img: 'p9kuber.jpg',
      bhajans: [
        { title: 'श्री कुबेर स्तोत्रम्', audio: 'kuber.mp3' }
      ]
    },
    {
      id: 'nrusimha',
      name: 'श्री नृसिंह सरस्वती',
      img: 'p10karanja.jpg',
      bhajans: [
        { title: 'श्री नृसिंह प्रार्थना', audio: 'nruPrarthana.mp3' }
      ]
    },
    {
      id: 'gajanan',
      name: 'श्री गजानन महाराज',
      img: 'p11shegaon.jpg',
      bhajans: [
        { title: 'गजानन महाराज चाळीसा (शेगांव)', audio: 'shegaon52.mp3' }
      ]
    },
    {
      id: 'krishna',
      name: 'श्रीकृष्ण',
      img: 'p12krishna.jpg',
      bhajans: [
        { title: 'नघो वाजवू', audio: 'nkoVajvu.mp3' },
        { title: 'मन लागो', audio: null },
        { title: 'भक्तों को', audio: null },
        { title: 'जय भागवंता', audio: 'jayBhagawanta.mp3' },
        { title: 'गोविंद प्रणाली', audio: 'godPranali.mp3' }
      ]
    },
    {
      id: 'vitthal',
      name: 'श्री विठ्ठल रुखमाई',
      img: 'p14vitthal.jpg',
      bhajans: [
        { title: 'हरिपाठ', audio: null },
        { title: 'पसायदान', audio: null },
        { title: 'निघालो', audio: 'nighalo.mp3' },
        { title: 'माझे माहेर', audio: 'mazeMaher.mp3' },
        { title: 'भागवत आरती', audio: 'bhagwatAarti.mp3' }
      ]
    },
    {
      id: 'mauli',
      name: 'संत ज्ञानेश्वर माऊली',
      img: 'p15mauli.jpg',
      bhajans: [
        { title: 'पसायदान', audio: null },
        { title: 'माझे माहेर पंढरी', audio: 'mazeMaher.mp3' }
      ]
    },
    {
      id: 'tukdoji',
      name: 'राष्ट्रसंत तुकडोजी महाराज',
      img: 'p16mozri.jpg',
      bhajans: [
        { title: 'ग्राम-गीत / भजन', audio: null },
        { title: 'मानस भासे', audio: 'manaBhase.mp3' },
        { title: 'मनाला स्थिर', audio: 'manalaSthir.mp3' }
      ]
    },
    {
      id: 'akkalkot',
      name: 'श्री स्वामी समर्थ',
      img: 'p17akkalkot.jpg',
      bhajans: [
        { title: 'स्वामी समर्थ स्तोत्र', audio: null }
      ]
    },
    {
      id: 'sai',
      name: 'श्री साईनाथ महाराज',
      img: 'p18shirdi.jpg',
      bhajans: [
        { title: 'साई भजन', audio: null }
      ]
    }
  ];

  const grid = document.getElementById('deityGrid');
  if (!grid) return;

  let activePanel = null;
  let activeCard  = null;

  /* ── Build deity cards ── */
  deities.forEach((deity) => {
    const card = document.createElement('div');
    card.className = 'deity-card reveal';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', deity.name);
    card.innerHTML = `
      <img src="${CDN}${encodeURIComponent(deity.img)}" alt="${deity.name}" loading="lazy"/>
      <div class="deity-name">${deity.name}</div>
    `;

    function open() {
      // Close existing
      if (activePanel) {
        activePanel.classList.remove('open');
        if (activeCard) activeCard.classList.remove('active');
        if (activeCard === card) {
          activePanel = null;
          activeCard  = null;
          return;
        }
      }
      // Build panel
      const panel = buildPanel(deity);
      grid.parentNode.insertBefore(panel, grid.nextSibling);

      // Remove any previous panel
      document.querySelectorAll('.bhajan-panel').forEach(p => {
        if (p !== panel) p.remove();
      });

      panel.classList.add('open');
      card.classList.add('active');
      activePanel = panel;
      activeCard  = card;
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    grid.appendChild(card);
  });

  /* ── Build bhajan panel ── */
  function buildPanel(deity) {
    const panel = document.createElement('div');
    panel.className = 'bhajan-panel';

    const header = `
      <div class="bhajan-panel-header">
        <img src="${CDN}${encodeURIComponent(deity.img)}" alt="${deity.name}" loading="lazy"/>
        <h3>${deity.name}</h3>
        <button class="bhajan-panel-close" aria-label="बंद करा">✕</button>
      </div>`;

    const items = deity.bhajans.map(b => {
      const audioEl = b.audio
        ? `<audio class="bhajan-audio" controls preload="none">
             <source src="${CDN}${b.audio}" type="audio/mpeg"/>
           </audio>`
        : `<p style="font-size:.8rem;color:#a08060;font-style:italic;">ऑडिओ लवकरच येईल</p>`;
      return `
        <div class="bhajan-item">
          <div class="bhajan-item-title">${b.title}</div>
          ${audioEl}
        </div>`;
    }).join('');

    panel.innerHTML = header + `<div class="bhajan-list">${items}</div>`;

    panel.querySelector('.bhajan-panel-close').addEventListener('click', () => {
      panel.classList.remove('open');
      panel.remove();
      if (activeCard) activeCard.classList.remove('active');
      activePanel = null;
      activeCard  = null;
    });

    return panel;
  }

  /* ── Trigger scroll reveal for deity cards ── */
  const deityObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        deityObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.deity-card').forEach(c => deityObserver.observe(c));
})();

