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