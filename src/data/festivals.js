/**
 * Trimurti Jyotishalay - Festival Dataset
 * Configured for direct migration to Supabase / Admin Dashboard
 */
export const FESTIVAL_DATA = [
  {
    id: "f1",
    date: "2026-08-15",
    category: "festival",
    icon: "🪔",
    name: {
      mr: "श्रीकृष्ण जन्माष्टमी",
      hi: "श्रीकृष्ण जन्माष्टमी",
      en: "Shri Krishna Janmashtami"
    },
    description: {
      mr: "भगवान श्रीकृष्णांचा जन्मोत्सव. या दिवशी अहोरात्र उपवास, रात्री १२ वाजता विशेष जन्मपूजा आणि दहीहंडी साजरी केली जाते.",
      hi: "भगवान श्रीकृष्ण का जन्मोत्सव। इस दिन व्रत, मध्यरात्रि पूजन और दही हांडी का भव्य आयोजन होता है।",
      en: "Celebration of the birth of Lord Krishna. Fasting, midnight puja, and Dahi Handi festivities are observed."
    },
    pujaTime: {
      mr: "रात्री ११:४० ते १२:२५ (निशिता काल)",
      hi: "रात्रि ११:४० से १२:२५ (निषिता काल)",
      en: "11:40 PM - 12:25 AM (Nishita Kaal)"
    },
    vratInfo: {
      mr: "अहोरात्र व्रत आणि रोहिणी नक्षत्रावर पारण.",
      hi: "अहोरात्र व्रत और रोहिणी नक्षत्र में पारण।",
      en: "Full-day fasting until Paran on Rohini Nakshatra."
    },
    relatedServiceId: "krishna-puja",
    relatedServiceName: {
      mr: "श्रीकृष्ण जन्मपूजा व महाअभिषेक",
      hi: "श्रीकृष्ण जन्मपूजन व महाअभिषेक",
      en: "Shri Krishna Puja & Abhishek"
    },
    active: true
  },
  {
    id: "f2",
    date: "2026-08-27",
    category: "festival",
    icon: "🌺",
    name: {
      mr: "गणेश चतुर्थी",
      hi: "गणेश चतुर्थी",
      en: "Ganesh Chaturthi"
    },
    description: {
      mr: "विघ्नहर्त्या श्री गणेशाचे आगमन. घरोघरी व सार्वजनिक मंडळांमध्ये श्रीमूर्तीची स्थापना व प्राणप्रतिष्ठा केली जाते.",
      hi: "भगवान श्री गणेश का जन्मोत्सव एवं आगमन। गणपति जी की मूर्ति स्थापना और विशेष पूजन किया जाता है।",
      en: "Arrival of Lord Ganesha. Idol installation and Shodashopachara puja are performed."
    },
    pujaTime: {
      mr: "सकाळी ११:१० ते दुपारी ०१:४० (मध्यान्ह काळ)",
      hi: "सुबह ११:१० से दोपहर ०१:४० (मध्याह्न काल)",
      en: "11:10 AM - 01:40 PM (Madhyahna Kaal)"
    },
    vratInfo: {
      mr: "गणेश स्थापना व्रत व संकष्टी संकल्प.",
      hi: "गणेश स्थापना व्रत एवं पूजन संकल्प।",
      en: "Ganesh Sthapana Vrat and Puja Sankalp."
    },
    relatedServiceId: "ganesh-puja",
    relatedServiceName: {
      mr: "गणेश प्राणप्रतिष्ठा व अथर्वशीर्ष आवर्तन",
      hi: "गणेश प्राणप्रतिष्ठा व अथर्वशीर्ष आवर्तन",
      en: "Ganesh Sthapana & Atharvashirsha Avartan"
    },
    active: true
  },
  {
    id: "f3",
    date: "2026-09-14",
    category: "vrat",
    icon: "🌕",
    name: {
      mr: "हरतालिका तृतीया",
      hi: "हरितालिका तीज",
      en: "Hartalika Teej"
    },
    description: {
      mr: "माता पार्वती आणि भगवान शिवाच्या पूजनाचा पवित्र दिवस. स्त्रिया सौभाग्यासाठी निराहार व्रत करतात.",
      hi: "माता पार्वती और भगवान शिव का विशेष पूजन दिवस। अखंड सौभाग्य हेतु निर्जला व्रत रखा जाता है।",
      en: "Sacred day of Lord Shiva and Goddess Parvati worship. Fasting observed for marital harmony."
    },
    pujaTime: {
      mr: "सकाळी ०६:१५ ते ०८:३०",
      hi: "सुबह ०६:१५ से ०८:३०",
      en: "06:15 AM - 08:30 AM"
    },
    vratInfo: {
      mr: "निर्जला व्रत व वाळूच्या शिवलिंगाची पूजा.",
      hi: "निर्जला व्रत एवं बालू के शिवलिंग का पूजन।",
      en: "Waterless fasting and sand Shivling worship."
    },
    relatedServiceId: "shiv-puja",
    relatedServiceName: {
      mr: "हरतालिका शिव-पार्वती विशेष पूजा",
      hi: "हरितालिका शिव-पार्वती विशेष पूजा",
      en: "Hartalika Shiva-Parvati Special Puja"
    },
    active: true
  },
  {
    id: "f4",
    date: "2026-09-25",
    category: "religious_day",
    icon: "🌾",
    name: {
      mr: "अनंत चतुर्दशी",
      hi: "अनंत चतुर्दशी",
      en: "Anant Chaturdashi"
    },
    description: {
      mr: "श्री अनंताची (भगवान विष्णू) पूजा आणि गणेश विसर्जन. १४ गाठींचा अनंत दोरा परिधान केला जातो.",
      hi: "भगवान अनंत (विष्णु) की पूजा और गणेश विसर्जन। १४ गांठों का अनंत सूत्र धारण किया जाता है।",
      en: "Worship of Lord Ananta (Vishnu) and Ganesha Visarjan. Sacred 14-knot thread is tied."
    },
    pujaTime: {
      mr: "सकाळी ०६:२० ते १२:२०",
      hi: "सुबह ०६:२० से १२:२०",
      en: "06:20 AM - 12:20 PM"
    },
    vratInfo: {
      mr: "अनंत व्रत आणि १४ वर्षांचा संकल्प.",
      hi: "अनंत व्रत और १४ वर्षों का संकल्प।",
      en: "Anant Vrat and 14-year resolution."
    },
    relatedServiceId: "anant-puja",
    relatedServiceName: {
      mr: "अनंत व्रत पूजा व धागा पूजन",
      hi: "अनंत व्रत पूजा व डोरा पूजन",
      en: "Anant Vrat Puja & Sacred Thread Ceremony"
    },
    active: true
  },
  {
    id: "f5",
    date: "2026-10-11",
    category: "festival",
    icon: "🚩",
    name: {
      mr: "घटस्थापना (नवरात्र प्रारंभ)",
      hi: "घटस्थापना (शारदीय नवरात्रि)",
      en: "Ghatasthapana (Navratri Begins)"
    },
    description: {
      mr: "देवी दुर्गेच्या नवरूपांच्या पूजनाचा प्रारंभ. धान्याचे शेत रोपणे आणि अखंड दीप प्रज्वलन.",
      hi: "दुर्गा पूजा एवं नवरात्रि का शुभारंभ। कलश स्थापना और अखंड दीप प्रज्वलन।",
      en: "Beginning of Sharad Navratri. Kalash Sthapana and 9 nights of Goddess Durga worship."
    },
    pujaTime: {
      mr: "सकाळी ०६:२५ ते १०:१५",
      hi: "सुबह ०६:२५ से १०:१५",
      en: "06:25 AM - 10:15 AM"
    },
    vratInfo: {
      mr: "नवरात्र उपवास व चंडी पाठाचा संकल्प.",
      hi: "नवरात्रि उपवास व चंडी पाठ संकल्प।",
      en: "Navratri fasting and Chandi Path ritual."
    },
    relatedServiceId: "navratri-puja",
    relatedServiceName: {
      mr: "घटस्थापना व नवचंडी पाठ",
      hi: "घटस्थापना व नवचंडी पाठ",
      en: "Ghatasthapana & Navchandi Path"
    },
    active: true
  },
  {
    id: "f6",
    date: "2026-10-20",
    category: "special_puja",
    icon: "🏹",
    name: {
      mr: "विजयादशमी (दसरा)",
      hi: "विजयादशमी (दशहरा)",
      en: "Vijayadashami (Dussehra)"
    },
    description: {
      mr: "साडेतीन मुहूर्तांपैकी एक. शत्रूंवर विजयाचा सण, आपट्याची पाने वाटणे आणि नवीन कार्याचा प्रारंभ.",
      hi: "अधर्म पर धर्म की विजय का पर्व। शमी पूजन, शस्त्र पूजन एवं शुभ कार्य का शुभारंभ।",
      en: "Triumph of good over evil. Auspicious day for starting new ventures and Shastra Puja."
    },
    pujaTime: {
      mr: "दुपारी ०२:०५ ते ०२:५० (अपराह्न काल)",
      hi: "दोपहर ०२:०५ से ०२:५० (अपराह्न काल)",
      en: "02:05 PM - 02:50 PM (Aparahna Kaal)"
    },
    vratInfo: {
      mr: "सीमोल्लंघन, शस्त्र पूजा व विजया संकल्प.",
      hi: "सीमोल्लंघन, शस्त्र पूजन एवं विजया संकल्प।",
      en: "Simollanghan and Shastra Puja rituals."
    },
    relatedServiceId: "vastu-puja",
    relatedServiceName: {
      mr: "दसरा शुभ मुहूर्त नवीन वास्तू / कार्य पूजा",
      hi: "दशहरा शुभ मुहूर्त नवीन वास्तु / कार्य पूजा",
      en: "Dussehra Auspicious New Project / Vastu Puja"
    },
    active: true
  },
  {
    id: "f7",
    date: "2026-11-08",
    category: "festival",
    icon: "🪔",
    name: {
      mr: "लक्ष्मीपूजन (दिवाळी)",
      hi: "लक्ष्मी पूजन (दीपावली)",
      en: "Laxmi Pujan (Diwali)"
    },
    description: {
      mr: "आदिशक्ती श्री महालक्ष्मी, कुबेर आणि सरस्वतीचे पूजन. घरोघरी दीपमाळा आणि समृद्धीसाठी प्रार्थना.",
      hi: "माता लक्ष्मी एवं कुबेर देव का महापूजन। सुख, समृद्धि एवं ऐश्वर्य प्राप्ति का पावन पर्व।",
      en: "Grand worship of Goddess Laxmi and Kuber for wealth, peace, and prosperity."
    },
    pujaTime: {
      mr: "संध्याकाळी ०६:१५ ते रात्री ०८:२० (प्रदोष काल)",
      hi: "शाम ०६:१५ से रात्रि ०८:२० (प्रदोष काल)",
      en: "06:15 PM - 08:20 PM (Pradosh Kaal)"
    },
    vratInfo: {
      mr: "लक्ष्मीपूजन संकल्प आणि चौघडिया मुहूर्त पूजन.",
      hi: "लक्ष्मी पूजन संकल्प एवं शुभ चौघड़िया मुहूर्त।",
      en: "Laxmi Pujan resolution in Choghadiya Muhurta."
    },
    relatedServiceId: "laxmi-puja",
    relatedServiceName: {
      mr: "दिवाळी लक्ष्मी-कुबेर महापूजा व चोपडा पूजन",
      hi: "दीपावली लक्ष्मी-कुबेर महापूजा व बही पूजन",
      en: "Diwali Laxmi-Kuber Mahapuja & Chopda Pujan"
    },
    active: true
  },
  {
    id: "f8",
    date: "2026-03-08",
    category: "festival",
    icon: "🔱",
    name: {
      mr: "महाशिवरात्री",
      hi: "महाशिवरात्रि",
      en: "Mahashivratri"
    },
    description: {
      mr: "भगवान महादेवांच्या आराधनेचा मुख्य उत्सव. चार प्रहर पूजा, लघुरुद्र व रात्रीचे जागरण.",
      hi: "भगवान भोलेनाथ की विशेष आराधना का महापर्व। चार प्रहर पूजन, रुद्राभिषेक एवं जागरण।",
      en: "Great night of Lord Shiva. Four Prahar pujas, Rudrabhishekam, and night vigil."
    },
    pujaTime: {
      mr: "चारही प्रहर (रात्री ०६:३० ते सकाळी ०६:३०)",
      hi: "चारों प्रहर (रात्रि ०६:३० से प्रातः ०६:३०)",
      en: "All 4 Prahars (06:30 PM - 06:30 AM)"
    },
    vratInfo: {
      mr: "अहोरात्र उपवास व फलाहार.",
      hi: "अहोरात्र उपवास एवं फलाहार।",
      en: "Full night fasting and fruit diet."
    },
    relatedServiceId: "rudrabhisheka",
    relatedServiceName: {
      mr: "महाशिवरात्री विशेष लघुरुद्र व रुद्राभिषेक",
      hi: "महाशिवरात्रि विशेष लघुरुद्र व रुद्राभिषेक",
      en: "Mahashivratri Rudrabhishekam & Laghurudra"
    },
    active: true
  },
  {
    id: "f9",
    date: "2026-03-26",
    category: "jayanti",
    icon: "🏹",
    name: {
      mr: "श्री राम नवमी",
      hi: "श्री राम नवमी",
      en: "Shri Ram Navami"
    },
    description: {
      mr: "प्रभू श्रीरामचंद्रांचा जन्मोत्सव. दुपारी १२ वाजता जन्मोत्सव, रामरक्षा पठण व महाप्रसाद.",
      hi: "मर्यादा पुरुषोत्तम भगवान श्री राम का जन्मोत्सव। दोपहर १२ बजे जन्मोत्सव एवं श्री रामरक्षा पाठ।",
      en: "Birth anniversary of Lord Shri Ram. Noon birth rituals, Ram Raksha recitation, and Prasad."
    },
    pujaTime: {
      mr: "सकाळी ११:१० ते दुपारी ०१:३० (जन्मकाळ दुपारी १२:००)",
      hi: "सुबह ११:१० से दोपहर ०१:३० (जन्म काल दोपहर १२:००)",
      en: "11:10 AM - 01:30 PM (Birth time 12:00 PM)"
    },
    vratInfo: {
      mr: "श्रीराम नवमी उपवास व रामनामाचा जप.",
      hi: "श्री राम नवमी व्रत एवं राम नाम जप।",
      en: "Ram Navami fast and chanting of Ram Naam."
    },
    relatedServiceId: "ram-puja",
    relatedServiceName: {
      mr: "श्रीराम जन्मोत्सव व सुंदरकांड पाठ",
      hi: "श्रीराम जन्मोत्सव व सुंदरकांड पाठ",
      en: "Shri Ram Janmotsav & Sunderkand Path"
    },
    active: true
  },
  {
    id: "f10",
    date: "2026-04-02",
    category: "jayanti",
    icon: "🚩",
    name: {
      mr: "हनुमान जयंती",
      hi: "हनुमान जयंती",
      en: "Hanuman Jayanti"
    },
    description: {
      mr: "संकटमोचन श्री हनुमानजींचा प्रकट दिन. सूर्योदयावेळी जन्मोत्सव, मारुती स्तोत्र आणि सिंदूर लेपन.",
      hi: "महावीर श्री हनुमान जी का प्रकटोत्सव। सूर्योदय काल पूजन, हनुमान चालीसा व सिंदूर अर्पण।",
      en: "Birth celebration of Lord Hanuman. Sunrise prayers, Hanuman Chalisa, and Sindoor offering."
    },
    pujaTime: {
      mr: "पहाटे ०६:०५ ते सकाळी ०९:००",
      hi: "प्रातः ०६:०५ से सुबह ०९:००",
      en: "06:05 AM - 09:00 AM"
    },
    vratInfo: {
      mr: "ब्रह्मचर्य पालन, सुंदरकांड पठण व उपवास.",
      hi: "ब्रह्मचर्य पालन, सुंदरकांड पाठ व उपवास।",
      en: "Fasting, celibacy, and Sunderkand recitation."
    },
    relatedServiceId: "hanuman-puja",
    relatedServiceName: {
      mr: "श्री हनुमान मारुती याग व सिंदूर पूजा",
      hi: "श्री हनुमान याग व सिंदूर पूजा",
      en: "Shri Hanuman Yagna & Sindoor Pujan"
    },
    active: true
  }
];

export const FESTIVAL_DICTIONARY = {
  mr: {
    heroTitle: "🪔 सण आणि उत्सव",
    heroSub: "आगामी धार्मिक सण आणि विशेष दिवसांचे दिनदर्शिका कॅलेंडर",
    todayHighlight: "🌟 आजचा विशेष दिवस",
    noFestivalToday: "आज कोणताही प्रमुख सण नाही.",
    nextFestival: "पुढील सण",
    upcomingTitle: "आगामी सण (पुढील ३० दिवस)",
    searchPlaceholder: "🔍 सण किंवा उत्सव शोधा...",
    all: "सर्व",
    festival: "हिंदू सण",
    vrat: "व्रत",
    jayanti: "जयंती",
    religious_day: "धार्मिक दिवस",
    special_puja: "विशेष पूजा",
    moreDetails: "अधिक माहिती →",
    bookPuja: "पूजा बुक करा",
    viewPanchang: "पंचांग पहा",
    close: "बंद करा",
    currentMonth: "आजचा महिना",
    noFestivalsFound: "या महिन्यात किंवा फिल्टरनुसार कोणताही सण आढळला नाही.",
    pujaTimeLabel: "पूजा वेळ / मुहूर्त",
    vratInfoLabel: "व्रत व नियम",
    countdownDays: "दिवस",
    countdownHours: "तास",
    countdownMins: "मिनिटे",
    countdownTitle: "⏳ पुढील सणासाठी वेळ:"
  },
  hi: {
    heroTitle: "🪔 त्योहार और पर्व",
    heroSub: "आगामी धार्मिक त्योहारों और विशेष दिनों का कैलेंडर",
    todayHighlight: "🌟 आज का विशेष दिन",
    noFestivalToday: "आज कोई प्रमुख त्योहार नहीं है।",
    nextFestival: "अगला त्योहार",
    upcomingTitle: "आगामी त्योहार (अगले ३० दिन)",
    searchPlaceholder: "🔍 त्योहार या पर्व खोजें...",
    all: "सभी",
    festival: "हिंदू त्योहार",
    vrat: "व्रत",
    jayanti: "जयंती",
    religious_day: "धार्मिक दिन",
    special_puja: "विशेष पूजा",
    moreDetails: "अधिक जानकारी →",
    bookPuja: "पूजा बुक करें",
    viewPanchang: "पंचांग देखें",
    close: "बंद करें",
    currentMonth: "वर्तमान माह",
    noFestivalsFound: "इस महीने या फ़िल्टर के अनुसार कोई त्योहार नहीं मिला।",
    pujaTimeLabel: "पूजा समय / मुहूर्त",
    vratInfoLabel: "व्रत एवं नियम",
    countdownDays: "दिन",
    countdownHours: "घंटे",
    countdownMins: "मिनट",
    countdownTitle: "⏳ अगले त्योहार के लिए समय:"
  },
  en: {
    heroTitle: "🪔 Festivals & Celebrations",
    heroSub: "Upcoming religious festivals, fasts, and sacred occasions",
    todayHighlight: "🌟 Today's Special Occasion",
    noFestivalToday: "There is no major festival today.",
    nextFestival: "Next Festival",
    upcomingTitle: "Upcoming Festivals (Next 30 Days)",
    searchPlaceholder: "🔍 Search festivals or fasts...",
    all: "All",
    festival: "Hindu Festivals",
    vrat: "Vrat / Fasting",
    jayanti: "Jayanti",
    religious_day: "Religious Days",
    special_puja: "Special Puja",
    moreDetails: "More Details →",
    bookPuja: "Book Puja",
    viewPanchang: "View Panchang",
    close: "Close",
    currentMonth: "Current Month",
    noFestivalsFound: "No festivals found for the selected month or filter.",
    pujaTimeLabel: "Puja Timing / Muhurta",
    vratInfoLabel: "Fasting & Ritual Details",
    countdownDays: "Days",
    countdownHours: "Hours",
    countdownMins: "Mins",
    countdownTitle: "⏳ Countdown to Next Festival:"
  }
};