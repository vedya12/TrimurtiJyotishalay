import { contactConfig } from './contact-config.js';

// Multilingual Error & Success Messages
const i18nMessages = {
  mr: {
    err_name: "कृपया आपले नाव प्रविष्ट करा.",
    err_phone: "कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा.",
    err_email: "कृपया वैध ई-मेल पत्ता प्रविष्ट करा.",
    err_service: "कृपया आवश्यक सेवा निवडा.",
    err_msg: "कृपया आपला संदेश लिहा.",
    success_title: "🙏 धन्यवाद!",
    success_msg: "तुमचा संदेश यशस्वीरित्या नोंदवला गेला आहे. आमची टीम लवकरच तुमच्याशी संपर्क साधेल.",
    maps_placeholder: "गुगल मॅप लिंक कॉन्फिगर केलेली नाही."
  },
  hi: {
    err_name: "कृपया अपना नाम दर्ज करें।",
    err_phone: "कृपया मान्य 10-अंकों का मोबाइल नंबर दर्ज करें।",
    err_email: "कृपया मान्य ईमेल पता दर्ज करें।",
    err_service: "कृपया आवश्यक सेवा का चयन करें।",
    err_msg: "कृपया अपना संदेश लिखें।",
    success_title: "🙏 धन्यवाद!",
    success_msg: "आपका संदेश सफलतापूर्वक प्राप्त हो गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।",
    maps_placeholder: "गूगल मैप्स लिंक कॉन्फ़िगर नहीं किया गया है।"
  },
  en: {
    err_name: "Please enter your name.",
    err_phone: "Please enter a valid 10-digit phone number.",
    err_email: "Please enter a valid email address.",
    err_service: "Please select a service.",
    err_msg: "Please write your message.",
    success_title: "🙏 Thank You!",
    success_msg: "Your message has been submitted successfully. Our team will get back to you shortly.",
    maps_placeholder: "Google Maps URL not configured."
  }
};

let currentLang = 'mr';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  populateContactData();
  setupValidationAndEvents();
});

function initLanguage() {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    currentLang = langSelect.value || 'mr';
    langSelect.addEventListener('change', (e) => {
      currentLang = e.target.value;
      updateDynamicReachTexts();
    });
  }
}

/**
 * 1. Populate UI fields using the centralized contactConfig
 */
function populateContactData() {
  // Direct Phone links
  const phoneClean = contactConfig.phone.replace(/\s+/g, '');
  if (phoneClean) {
    document.getElementById('displayPhone').textContent = contactConfig.phone;
    document.getElementById('btnPhoneCall').href = `tel:${phoneClean}`;
    document.getElementById('urgentCallBtn').href = `tel:${phoneClean}`;
  }

  // Direct WhatsApp links
  const waClean = contactConfig.whatsapp.replace(/[^0-9]/g, '');
  if (waClean) {
    const waUrl = `https://wa.me/${waClean}?text=${encodeURIComponent("नमस्कार 🙏 मला चौकशी करायची आहे.")}`;
    document.getElementById('btnWhatsappChat').href = waUrl;
    document.getElementById('urgentWaBtn').href = waUrl;
  }

  // Email
  if (contactConfig.email) {
    document.getElementById('displayEmail').textContent = contactConfig.email;
    document.getElementById('btnSendEmail').href = `mailto:${contactConfig.email}`;
  }

  // Address & Directions
  const addrText = contactConfig.address[currentLang] || contactConfig.address.marathi || contactConfig.address.english;
  document.getElementById('displayAddress').textContent = addrText;

  if (contactConfig.mapsDirectLink) {
    document.getElementById('btnGetDirections').href = contactConfig.mapsDirectLink;
  }

  // Working Hours
  const hoursContainer = document.getElementById('workingHoursList');
  if (hoursContainer && contactConfig.workingHours) {
    hoursContainer.innerHTML = contactConfig.workingHours.map(item => `
      <li>
        <span class="hours-day">${item.defaultText}</span>
        <span class="hours-time">${item.hours}</span>
      </li>
    `).join('');
  }

  // Embed Map or Placeholder
  const mapWrapper = document.getElementById('mapWrapper');
  if (mapWrapper) {
    if (contactConfig.mapsEmbedUrl) {
      mapWrapper.innerHTML = `
        <iframe 
          src="${contactConfig.mapsEmbedUrl}" 
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          title="Trimurti Jyotishalay Location Map">
        </iframe>
      `;
    } else {
      mapWrapper.innerHTML = `
        <div class="map-placeholder-box">
          <p>📍 ${i18nMessages[currentLang].maps_placeholder}</p>
          ${contactConfig.mapsDirectLink ? `<a href="${contactConfig.mapsDirectLink}" target="_blank" class="btn btn-outline" style="margin-top:0.8rem;">Google Maps वर दिशा पहा</a>` : ''}
        </div>
      `;
    }
  }

  // Reach Info
  updateDynamicReachTexts();

  // Footer Social Media (Only if real URLs exist)
  const socialContainer = document.getElementById('socialLinksContainer');
  const socialIconsList = document.getElementById('socialIconsList');
  const socials = contactConfig.socialMedia;
  
  if (socialContainer && socialIconsList && (socials.instagram || socials.facebook || socials.youtube)) {
    socialContainer.style.display = 'flex';
    let iconsHtml = '';
    if (socials.instagram) iconsHtml += `<a href="${socials.instagram}" target="_blank" rel="noopener">📸 Instagram</a> `;
    if (socials.facebook) iconsHtml += `<a href="${socials.facebook}" target="_blank" rel="noopener">📘 Facebook</a> `;
    if (socials.youtube) iconsHtml += `<a href="${socials.youtube}" target="_blank" rel="noopener">▶ YouTube</a>`;
    socialIconsList.innerHTML = iconsHtml;
  }
}

function updateDynamicReachTexts() {
  const reach = contactConfig.howToReach;
  const langKey = currentLang === 'en' ? 'english' : 'marathi';

  document.getElementById('reachCarText').textContent = reach.car[langKey] || reach.car.marathi;
  document.getElementById('reachBusText').textContent = reach.bus[langKey] || reach.bus.marathi;
  document.getElementById('reachTrainText').textContent = reach.train[langKey] || reach.train.marathi;
}

/**
 * 2. Form Validation & Submission Handling
 */
function setupValidationAndEvents() {
  const form = document.getElementById('contactForm');
  const btnWa = document.getElementById('btnSubmitWhatsapp');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        handleSuccessfulSubmission();
      }
    });
  }

  // Send via WhatsApp Button handler
  if (btnWa) {
    btnWa.addEventListener('click', () => {
      if (validateForm()) {
        triggerWhatsappSubmission();
      }
    });
  }
}

function validateForm() {
  let isValid = true;
  const msg = i18nMessages[currentLang] || i18nMessages.mr;

  // Clear errors
  clearErrors();

  const nameVal = document.getElementById('fullName').value.trim();
  const phoneVal = document.getElementById('phoneNum').value.trim();
  const emailVal = document.getElementById('emailAddr').value.trim();
  const serviceVal = document.getElementById('serviceSelect').value;
  const messageVal = document.getElementById('messageBody').value.trim();

  // Name Validation
  if (!nameVal) {
    showFieldError('fullName', 'errFullName', msg.err_name);
    isValid = false;
  }

  // Phone Validation (basic 10 digit check)
  const phoneRegex = /^[0-9]{10}$/;
  const cleanPhone = phoneVal.replace(/[^0-9]/g, '');
  if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
    showFieldError('phoneNum', 'errPhoneNum', msg.err_phone);
    isValid = false;
  }

  // Email Validation (optional field, validate only if filled)
  if (emailVal) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showFieldError('emailAddr', 'errEmailAddr', msg.err_email);
      isValid = false;
    }
  }

  // Service Validation
  if (!serviceVal) {
    showFieldError('serviceSelect', 'errServiceSelect', msg.err_service);
    isValid = false;
  }

  // Message Validation
  if (!messageVal) {
    showFieldError('messageBody', 'errMessageBody', msg.err_msg);
    isValid = false;
  }

  return isValid;
}

function showFieldError(inputId, errorId, messageText) {
  const inputEl = document.getElementById(inputId);
  const errEl = document.getElementById(errorId);
  if (inputEl) inputEl.classList.add('input-invalid');
  if (errEl) errEl.textContent = messageText;
}

function clearErrors() {
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('input-invalid'));
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

/**
 * 3. Handle Local Frontend Demo Submission Success
 */
function handleSuccessfulSubmission() {
  const alertBox = document.getElementById('formAlert');
  const msg = i18nMessages[currentLang] || i18nMessages.mr;

  alertBox.className = 'form-alert success';
  alertBox.style.display = 'block';
  alertBox.innerHTML = `<strong>${msg.success_title}</strong><br/>${msg.success_msg}`;

  document.getElementById('contactForm').reset();
  alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 4. Generate WhatsApp Message & Open External Link
 */
function triggerWhatsappSubmission() {
  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phoneNum').value.trim();
  const service = document.getElementById('serviceSelect').value;
  const message = document.getElementById('messageBody').value.trim();

  const formattedMessage = `नमस्कार 🙏\n\n*नवीन चौकशी (Website Contact Form)*\n\n👤 *नाव:* ${name}\n📞 *फोन:* ${phone}\n🔮 *सेवा:* ${service}\n\n💬 *संदेश:*\n${message}`;

  const waClean = contactConfig.whatsapp.replace(/[^0-9]/g, '');
  const finalWaUrl = `https://wa.me/${waClean}?text=${encodeURIComponent(formattedMessage)}`;

  window.open(finalWaUrl, '_blank', 'noopener,noreferrer');
  handleSuccessfulSubmission();
}


// Auto-fill form if user is logged in
function checkAndAutoFillUser() {
  const session = JSON.parse(localStorage.getItem('user_session'));
  if (session && session.isLoggedIn) {
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNum');
    const emailInput = document.getElementById('emailAddr');

    if (nameInput && session.name) {
      nameInput.value = session.name;
    }
    if (phoneInput && session.phone) {
      phoneInput.value = session.phone;
    }
    if (emailInput && session.email) {
      emailInput.value = session.email;
    }
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', checkAndAutoFillUser);