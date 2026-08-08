/**
 * Trimurti Jyotishalay - FAQ Page Script
 * Multilingual, Categorized, Searchable Accordion
 */

// ── 1. DEMO FAQ DATA STORE ──
const faqsData = [
  // BOOKING
  {
    id: 1,
    category: "booking",
    question: {
      mr: "पूजा कशी बुक करायची?",
      hi: "पूजा कैसे बुक करें?",
      en: "How can I book a puja?"
    },
    answer: {
      mr: "सेवा विभागातून आवश्यक पूजा निवडा, उपलब्ध तारीख आणि वेळ निवडून तुमची माहिती भरा व बुकिंग पूर्ण करा.",
      hi: "सेवा अनुभाग से अपनी इच्छित पूजा चुनें, उपलब्ध तिथि और समय चुनें, अपना विवरण भरें और बुकिंग पूरी करें।",
      en: "Select the desired puja from the Services section, choose an available date and time, enter your details, and complete the booking."
    }
  },
  {
    id: 2,
    category: "booking",
    question: {
      mr: "बुकिंगसाठी कोणती माहिती आवश्यक आहे?",
      hi: "बुकिंग के लिए क्या जानकारी आवश्यक है?",
      en: "What information is required for booking?"
    },
    answer: {
      mr: "तुमचे पूर्ण नाव, मोबाईल नंबर, पूजेचे ठिकाण (घरी / ऑनलाइन) आणि इच्छित तारीख आवश्यक आहे.",
      hi: "आपका पूरा नाम, मोबाइल नंबर, पूजा का स्थान (घर / ऑनलाइन) और पसंदीदा तारीख आवश्यक है।",
      en: "Your full name, mobile number, venue preference (home / online), and preferred date are required."
    }
  },
  {
    id: 3,
    category: "booking",
    question: {
      mr: "मी माझी बुकिंग तारीख बदलू शकतो का?",
      hi: "क्या मैं अपनी बुकिंग की तारीख बदल सकता हूँ?",
      en: "Can I reschedule my booking date?"
    },
    answer: {
      mr: "होय, पूजेच्या ४८ तास आधी तुम्ही संपर्क किंवा WhatsApp द्वारे विनंती करून तारीख बदलू शकता.",
      hi: "हाँ, पूजा से 48 घंटे पहले आप कॉल या WhatsApp के माध्यम से तारीख बदलने का अनुरोध कर सकते हैं।",
      en: "Yes, you can request a date change up to 48 hours prior to the scheduled puja via Call or WhatsApp."
    }
  },
  {
    id: 4,
    category: "booking",
    question: {
      mr: "बुकिंग रद्द करता येते का?",
      hi: "क्या बुकिंग रद्द की जा सकती है?",
      en: "Can a booking be cancelled?"
    },
    answer: {
      mr: "होय, बुकिंग रद्द करण्यासाठी आमच्या समर्थनाशी संपर्क साधा. नियमांनुसार रिफंड प्रक्रिया केली जाईल.",
      hi: "हाँ, बुकिंग रद्द करने के लिए हमारी सहायता टीम से संपर्क करें। नियमों के अनुसार रिफंड दिया जाएगा।",
      en: "Yes, contact our support team to cancel a booking. Refunds are processed as per our policy terms."
    }
  },

  // PUJA
  {
    id: 5,
    category: "puja",
    question: {
      mr: "पूजेसाठी लागणारे साहित्य कोण देईल?",
      hi: "पूजा की सामग्री कौन लाएगा?",
      en: "Who provides the required puja items?"
    },
    answer: {
      mr: "गुरुजी आवश्यक साहित्याची यादी देतात. हव्या असल्यास सर्व पूजा साहित्याची व्यवस्था गुरुजींमार्फतही केली जाऊ शकते.",
      hi: "गुरुजी आवश्यक सामग्री की सूची प्रदान करते हैं। यदि आप चाहें, तो पूरी सामग्री की व्यवस्था गुरुजी द्वारा भी की जा सकती है।",
      en: "Guruji provides a checklist of materials. Optionally, complete puja kits can also be arranged by Guruji."
    }
  },
  {
    id: 6,
    category: "puja",
    question: {
      mr: "पूजा माझ्या घरी होऊ शकते का?",
      hi: "क्या पूजा मेरे घर पर हो सकती है?",
      en: "Can the puja be performed at my home?"
    },
    answer: {
      mr: "होय, गुरुजी तुमच्या घरी येऊन शास्त्रोक्त पद्धतीने पूजा संपन्न करतात. बुकिंग करताना 'घरगुती पूजा' पर्याय निवडा.",
      hi: "हाँ, गुरुजी आपके घर आकर विधि-विधान से पूजा संपन्न करेंगे। बुकिंग करते समय 'घर पर पूजा' का विकल्प चुनें।",
      en: "Yes, Guruji can visit your home to perform rituals authentically. Select 'At Home' during booking."
    }
  },
  {
    id: 7,
    category: "puja",
    question: {
      mr: "पूजेसाठी किती वेळ लागतो?",
      hi: "पूजा में कितना समय लगता है?",
      en: "How long does a puja ceremony take?"
    },
    answer: {
      mr: "साधारणपणे पूजेनुसार १.५ ते ३ तास लागतात. महापूजा किंवा अनुष्ठानासाठी अधिक वेळ लागू शकतो.",
      hi: "सामान्यतः पूजा के अनुसार 1.5 से 3 घंटे का समय लगता है। विशेष अनुष्ठानों में अधिक समय लग सकता है।",
      en: "Generally, rituals take 1.5 to 3 hours depending on the type. Major pujas or havans may take longer."
    }
  },
  {
    id: 8,
    category: "puja",
    question: {
      mr: "विशेष मुहूर्त कसा निवडायचा?",
      hi: "विशेष शुभ मुहूर्त कैसे चुनें?",
      en: "How to choose a special auspicious time (Muhurat)?"
    },
    answer: {
      mr: "तुम्ही आमच्या पंचांग विभागातून किंवा थेट गुरुजींशी संपर्क साधून वैयक्तिक शुभ मुहूर्त ठरवू शकता.",
      hi: "आप हमारे पंचांग अनुभाग से या सीधे गुरुजी से परामर्श करके व्यक्तिगत शुभ मुहूर्त चुन सकते हैं।",
      en: "You can refer to our Panchang section or consult directly with Guruji to calculate a personalized Muhurat."
    }
  },

  // KUNDALI
  {
    id: 9,
    category: "kundali",
    question: {
      mr: "कुंडली तयार करण्यासाठी कोणती माहिती आवश्यक आहे?",
      hi: "कुंडली बनाने के लिए कौन सी जानकारी आवश्यक है?",
      en: "What details are required to make a Kundali?"
    },
    answer: {
      mr: "अचूक जन्म तारीख, अचूक जन्म वेळ आणि अचूक जन्म ठिकाण आवश्यक आहे.",
      hi: "सटीक जन्म तिथि, सटीक जन्म समय और सटीक जन्म स्थान की आवश्यकता होती है।",
      en: "Accurate Date of Birth, exact Time of Birth, and Place of Birth are required."
    }
  },
  {
    id: 10,
    category: "kundali",
    question: {
      mr: "कुंडली रिपोर्ट किती वेळात मिळेल?",
      hi: "कुंडली रिपोर्ट कितने समय में मिलेगी?",
      en: "How long does it take to receive the Kundali report?"
    },
    answer: {
      mr: "डिजिटल कुंडली रिपोर्ट २४ ते ४८ तासांच्या आत तुमच्या डॅशबोर्डवर उपलब्ध होते.",
      hi: "डिजिटल कुंडली रिपोर्ट 24 से 48 घंटे के भीतर आपके डैशबोर्ड पर उपलब्ध करा दी जाती है।",
      en: "Digital Kundali reports are uploaded to your dashboard within 24 to 48 hours."
    }
  },
  {
    id: 11,
    category: "kundali",
    question: {
      mr: "जन्मवेळ माहित नसल्यास काय करावे?",
      hi: "यदि जन्म का समय ज्ञात न हो तो क्या करें?",
      en: "What to do if the exact time of birth is unknown?"
    },
    answer: {
      mr: "गुरुजी प्रश्न कुंडली किंवा हस्तरेषा विश्लेषणाद्वारे मार्गदर्शन करू शकतात. यासाठी थेट संपर्क साधा.",
      hi: "गुरुजी प्रश्न कुंडली या हस्तरेखा विश्लेषण के माध्यम से मार्गदर्शन कर सकते हैं। इसके लिए सीधे संपर्क करें।",
      en: "Guruji can offer guidance through Prashna Kundali or Palmistry. Contact us for direct consultation."
    }
  },

  // PANCHANG
  {
    id: 12,
    category: "panchang",
    question: {
      mr: "आजचा पंचांग कुठे पाहता येईल?",
      hi: "आज का पंचांग कहाँ देख सकते हैं?",
      en: "Where can I view today's Panchang?"
    },
    answer: {
      mr: "वेबसाइटच्या मुख्य मेनूमधील 'पंचांग' पर्यायावर क्लिक करून तुम्ही दैनंदिन तिथी, नक्षत्र व राहुकाळ पाहू शकता.",
      hi: "वेबसाइट के मुख्य मेनू में 'पंचांग' पर क्लिक करके आप दैनिक तिथि, नक्षत्र और राहुकाल देख सकते हैं।",
      en: "Click on the 'Panchang' option in the main navigation menu to view daily Tithi, Nakshatra, and Rahukaal."
    }
  },
  {
    id: 13,
    category: "panchang",
    question: {
      mr: "राहुकाळ म्हणजे काय?",
      hi: "राहुकाल क्या है?",
      en: "What is Rahukaal?"
    },
    answer: {
      mr: "दिवसातील १.५ तासाचा काळ ज्यामध्ये कोणतेही नवीन शुभ कार्य सुरू करणे टाळले जाते, त्याला राहुकाळ म्हणतात.",
      hi: "दिन का 1.5 घंटे का वह समय जिसमें कोई भी नया या शुभ कार्य शुरू करने से बचा जाता है, उसे राहुकाल कहते हैं।",
      en: "A period of roughly 1.5 hours daily considered inauspicious for starting new significant activities."
    }
  },

  // PAYMENT
  {
    id: 14,
    category: "payment",
    question: {
      mr: "कोणते payment methods उपलब्ध आहेत?",
      hi: "कौन से पेमेंट तरीके उपलब्ध हैं?",
      en: "Which payment methods are accepted?"
    },
    answer: {
      mr: "आम्ही UPI (Google Pay, PhonePe, Paytm), डेबिट/क्रेडिट कार्ड आणि नेट बँकिंग स्वीकारतो.",
      hi: "हम UPI (Google Pay, PhonePe, Paytm), डेबिट/क्रेडिट कार्ड और नेट बैंकिंग स्वीकार करते हैं।",
      en: "We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking."
    }
  },
  {
    id: 15,
    category: "payment",
    question: {
      mr: "बुकिंगचे payment कसे करायचे?",
      hi: "बुकिंग का भुगतान कैसे करें?",
      en: "How to complete payment for a booking?"
    },
    answer: {
      mr: "बुकिंग फॉर्म भरल्यानंतर तुम्हाला सुरक्षित पेमेंट गेटवेवर पाठवले जाईल जिथे तुम्ही ऑनलाइन पेमेंट करू शकता.",
      hi: "बुकिंग फॉर्म भरने के बाद आपको सुरक्षित पेमेंट गेटवे पर निर्देशित किया जाएगा जहाँ आप भुगतान कर सकते हैं।",
      en: "After filling the booking form, you will be directed to a secure payment gateway to complete the transaction."
    }
  },

  // DOCUMENTS
  {
    id: 16,
    category: "documents",
    question: {
      mr: "माझे दस्तऐवज कुठे पाहता येतील?",
      hi: "मैं अपने दस्तावेज कहाँ देख सकता हूँ?",
      en: "Where can I access my documents?"
    },
    answer: {
      mr: "तुमच्या डॅशबोर्डमधील 'माझे दस्तऐवज' (Digital Locker) विभागात तुमचे सर्व रिपोर्ट सुरक्षित साठवलेले असतात.",
      hi: "आपके डैशबोर्ड में 'मेरे दस्तावेज' (Digital Locker) अनुभाग में आपके सभी रिपोर्ट सुरक्षित रूप से संग्रहीत रहते हैं।",
      en: "All your reports and digital certificates are securely stored in the 'My Documents' section of your Dashboard."
    }
  },
  {
    id: 17,
    category: "documents",
    question: {
      mr: "कुंडली PDF डाउनलोड करता येते का?",
      hi: "क्या कुंडली PDF डाउनलोड की जा सकती है?",
      en: "Can I download the Kundali as a PDF?"
    },
    answer: {
      mr: "होय, डॅशबोर्डवरून तुम्ही एका क्लिकवर तुमची कुंडली PDF फॉरमॅटमध्ये डाउनलोड करू शकता.",
      hi: "हाँ, डैशबोर्ड से आप एक क्लिक में अपनी कुंडली PDF प्रारूप में डाउनलोड कर सकते हैं।",
      en: "Yes, you can download your Kundali in PDF format with a single click from your Dashboard."
    }
  },

  // OTHER / GENERAL
  {
    id: 18,
    category: "other",
    question: {
      mr: "Online consultation आहे का?",
      hi: "क्या ऑनलाइन परामर्श उपलब्ध है?",
      en: "Is online consultation available?"
    },
    answer: {
      mr: "होय, तुम्ही WhatsApp व्हिडिओ कॉल किंवा फोनद्वारे गुरुजींशी ऑनलाईन मार्गदर्शन घेऊ शकता.",
      hi: "हाँ, आप WhatsApp वीडियो कॉल या फोन के माध्यम से गुरुजी से ऑनलाइन परामर्श ले सकते हैं।",
      en: "Yes, you can receive guidance online from Guruji via WhatsApp video call or phone call."
    }
  },
  {
    id: 19,
    category: "other",
    question: {
      mr: "त्रिमूर्ती ज्योतिषालयाची वेळ काय आहे?",
      hi: "त्रिमूर्ति ज्योतिषालय का समय क्या है?",
      en: "What are the operating hours of Trimurti Jyotishalay?"
    },
    answer: {
      mr: "सकाळी ९:०० ते रात्री ८:०० वाजेपर्यंत ज्योतिषालय उघडे असते. ऑनलाईन बुकिंग २४x७ उपलब्ध आहे.",
      hi: "सुबह 9:00 बजे से रात 8:00 बजे तक कार्यालय खुला रहता है। ऑनलाइन बुकिंग 24x7 उपलब्ध है।",
      en: "Our premises are open from 9:00 AM to 8:00 PM. Online bookings are available 24/7."
    }
  },
  {
    id: 20,
    category: "other",
    question: {
      mr: "माहितीची गोपनीयता राखली जाते का?",
      hi: "क्या जानकारी की गोपनीयता रखी जाती है?",
      en: "Is my personal data kept confidential?"
    },
    answer: {
      mr: "होय, तुमची सर्व वैयक्तिक माहिती आणि जन्म तपशील संपूर्णपणे गुप्त व सुरक्षित ठेवले जातात.",
      hi: "हाँ, आपकी सभी व्यक्तिगत जानकारी और जन्म विवरण पूरी तरह से गोपनीय और सुरक्षित रखे जाते हैं।",
      en: "Yes, all your personal details and birth data are kept 100% confidential and secure."
    }
  }
];

// ── 2. UI TRANSLATION DICTIONARY ──
const uiTranslations = {
  mr: {
    hero_title: "वारंवार विचारले जाणारे प्रश्न",
    hero_tagline: "तुमच्या सामान्य प्रश्नांची उत्तरे",
    search_placeholder: "तुमचा प्रश्न शोधा...",
    cats: {
      all: "सर्व",
      puja: "पूजा",
      booking: "बुकिंग",
      kundali: "कुंडली",
      panchang: "पंचांग",
      payment: "पेमेंट",
      documents: "दस्तऐवज",
      other: "इतर"
    },
    helpful: "हे उत्तर उपयुक्त ठरले का?",
    yes: "👍 होय",
    no: "👎 नाही",
    thanks: "धन्यवाद! 🙏",
    empty_title: "तुमच्या शोधाशी संबंधित प्रश्न सापडला नाही.",
    empty_sub: "कृपया वेगळा शब्द वापरून पहा किंवा आमच्याशी संपर्क साधा.",
    empty_btn: "संपर्क करा",
    cta_title: "तुमच्या प्रश्नाचे उत्तर मिळाले नाही?",
    cta_sub: "आमच्याशी थेट संपर्क करा.",
    cta_contact: "संपर्क करा",
    cta_whatsapp: "WhatsApp करा"
  },
  hi: {
    hero_title: "अक्सर पूछे जाने वाले प्रश्न",
    hero_tagline: "आपके सामान्य प्रश्नों के उत्तर",
    search_placeholder: "अपना प्रश्न खोजें...",
    cats: {
      all: "सभी",
      puja: "पूजा",
      booking: "बुकिंग",
      kundali: "कुंडली",
      panchang: "पंचांग",
      payment: "भुगतान",
      documents: "दस्तावेज़",
      other: "अन्य"
    },
    helpful: "क्या यह उत्तर उपयोगी था?",
    yes: "👍 हाँ",
    no: "👎 नहीं",
    thanks: "धन्यवाद! 🙏",
    empty_title: "आपकी खोज से संबंधित कोई प्रश्न नहीं मिला।",
    empty_sub: "कृपया कोई अन्य शब्द आज़माएं या हमसे संपर्क करें।",
    empty_btn: "संपर्क करें",
    cta_title: "क्या आपके प्रश्न का उत्तर नहीं मिला?",
    cta_sub: "हमसे सीधे संपर्क करें।",
    cta_contact: "संपर्क करें",
    cta_whatsapp: "WhatsApp करें"
  },
  en: {
    hero_title: "Frequently Asked Questions",
    hero_tagline: "Find answers to common questions about our services.",
    search_placeholder: "Search your question...",
    cats: {
      all: "All",
      puja: "Puja",
      booking: "Booking",
      kundali: "Kundali",
      panchang: "Panchang",
      payment: "Payment",
      documents: "Documents",
      other: "Other"
    },
    helpful: "Was this answer helpful?",
    yes: "👍 Yes",
    no: "👎 No",
    thanks: "Thank you! 🙏",
    empty_title: "No questions found matching your search.",
    empty_sub: "Please try a different keyword or reach out to us.",
    empty_btn: "Contact Us",
    cta_title: "Didn't find what you were looking for?",
    cta_sub: "Get in touch with us directly.",
    cta_contact: "Contact Us",
    cta_whatsapp: "WhatsApp Us"
  }
};

// ── 3. STATE MANAGEMENT ──
let currentLang = localStorage.getItem('selectedLanguage') || 'mr';
let currentCategory = 'all';
let currentSearchQuery = '';

// Track feedback locally (can sync to Supabase later)
const feedbackState = {}; 

// ── 4. DOM ELEMENTS ──
const faqListEl = document.getElementById('faqList');
const faqEmptyStateEl = document.getElementById('faqEmptyState');
const searchInputEl = document.getElementById('faqSearchInput');
const searchClearBtnEl = document.getElementById('faqSearchClearBtn');
const categoryBarEl = document.getElementById('faqCategoryBar');
const langBtns = document.querySelectorAll('.lang-btn');

// ── 5. CORE RENDER FUNCTION ──
function renderFAQs() {
  const t = uiTranslations[currentLang] || uiTranslations['mr'];

  // Filter Data by Category and Search Term
  const filtered = faqsData.filter(item => {
    const matchesCat = (currentCategory === 'all') || (item.category === currentCategory);
    
    const qText = (item.question[currentLang] || item.question['mr']).toLowerCase();
    const aText = (item.answer[currentLang] || item.answer['mr']).toLowerCase();
    const query = currentSearchQuery.toLowerCase().trim();

    const matchesSearch = !query || qText.includes(query) || aText.includes(query);

    return matchesCat && matchesSearch;
  });

  // Handle Empty State
  if (filtered.length === 0) {
    faqListEl.innerHTML = '';
    faqEmptyStateEl.style.display = 'block';
    return;
  }

  faqEmptyStateEl.style.display = 'none';

  // Render FAQ Cards
  faqListEl.innerHTML = filtered.map(item => {
    const q = item.question[currentLang] || item.question['mr'];
    const a = item.answer[currentLang] || item.answer['mr'];
    const isFeedbackGiven = feedbackState[item.id];

    return `
      <article class="faq-item" data-id="${item.id}" id="faq-item-${item.id}">
        <button 
          type="button"
          class="faq-header" 
          aria-expanded="false" 
          aria-controls="faq-body-${item.id}"
          onclick="toggleAccordion(${item.id})"
        >
          <span class="faq-question-text">${q}</span>
          <span class="faq-icon-toggle" aria-hidden="true">＋</span>
        </button>

        <div class="faq-body" id="faq-body-${item.id}" role="region">
          <div class="faq-answer-content">
            <p>${a}</p>

            <div class="faq-feedback-wrapper">
              <span class="feedback-label">${t.helpful}</span>
              ${
                isFeedbackGiven 
                ? `<span class="feedback-thanks">${t.thanks}</span>`
                : `
                  <div class="feedback-btns">
                    <button class="feedback-btn" onclick="handleFeedback(${item.id}, true)">${t.yes}</button>
                    <button class="feedback-btn" onclick="handleFeedback(${item.id}, false)">${t.no}</button>
                  </div>
                `
              }
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ── 6. ACCORDION TOGGLE LOGIC ──
window.toggleAccordion = function(id) {
  const itemEl = document.getElementById(`faq-item-${id}`);
  const headerBtn = itemEl.querySelector('.faq-header');
  const bodyEl = document.getElementById(`faq-body-${id}`);
  const iconEl = itemEl.querySelector('.faq-icon-toggle');

  const isOpen = itemEl.classList.contains('open');

  if (isOpen) {
    itemEl.classList.remove('open');
    headerBtn.setAttribute('aria-expanded', 'false');
    bodyEl.style.maxHeight = null;
    iconEl.textContent = '＋';
  } else {
    itemEl.classList.add('open');
    headerBtn.setAttribute('aria-expanded', 'true');
    bodyEl.style.maxHeight = bodyEl.scrollHeight + 'px';
    iconEl.textContent = '−';
  }
};

// ── 7. FEEDBACK HANDLER ──
window.handleFeedback = function(faqId, isHelpful) {
  // Store feedback locally
  feedbackState[faqId] = { isHelpful, timestamp: new Date().toISOString() };
  
  /*
    FUTURE SUPABASE INTEGRATION:
    await supabase.from('faq_analytics').insert({ faq_id: faqId, helpful: isHelpful });
  */

  renderFAQs();
};

// ── 8. UI STATIC TRANSLATIONS UPDATE ──
function updateStaticTranslations() {
  const t = uiTranslations[currentLang] || uiTranslations['mr'];

  // Hero
  document.getElementById('heroTitle').textContent = t.hero_title;
  document.getElementById('heroTagline').textContent = t.hero_tagline;

  // Search input
  searchInputEl.placeholder = t.search_placeholder;

  // Category buttons
  Object.keys(t.cats).forEach(catKey => {
    const btn = document.getElementById(`cat-${catKey}`);
    if (btn) btn.textContent = t.cats[catKey];
  });

  // Empty State
  document.getElementById('emptyTitle').textContent = t.empty_title;
  document.getElementById('emptySub').textContent = t.empty_sub;
  document.getElementById('emptyContactBtn').textContent = t.empty_btn;

  // CTA Card
  document.getElementById('ctaTitle').textContent = t.cta_title;
  document.getElementById('ctaSub').textContent = t.cta_sub;
  document.getElementById('ctaContactText').textContent = t.cta_contact;
  document.getElementById('ctaWhatsappText').textContent = t.cta_whatsapp;

  // Sync Language Switcher Buttons UI
  langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
  });
}

// ── 9. EVENT LISTENERS & INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {

  // Language Switcher Event Listeners
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.getAttribute('data-lang');
      localStorage.setItem('selectedLanguage', currentLang);
      updateStaticTranslations();
      renderFAQs();
    });
  });

  // Category Bar Filter
  categoryBarEl.addEventListener('click', (e) => {
    const target = e.target.closest('.filter-btn');
    if (!target) return;

    categoryBarEl.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });

    target.classList.add('active');
    target.setAttribute('aria-selected', 'true');

    currentCategory = target.getAttribute('data-category');
    renderFAQs();
  });

  // Search Input Real-Time Filter
  searchInputEl.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    searchClearBtnEl.style.display = currentSearchQuery ? 'block' : 'none';
    renderFAQs();
  });

  // Clear Search
  searchClearBtnEl.addEventListener('click', () => {
    searchInputEl.value = '';
    currentSearchQuery = '';
    searchClearBtnEl.style.display = 'none';
    searchInputEl.focus();
    renderFAQs();
  });

  // Initial Boot
  updateStaticTranslations();
  renderFAQs();
});