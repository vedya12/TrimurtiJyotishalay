/**
 * Trimurti Jyotishalay - Centralized Contact Configuration
 * Replace empty strings with your actual business information.
 * In the future, this object can be fetched directly from Supabase / API.
 */
export const contactConfig = {
  phone: "+919876543210",          // Format: +91XXXXXXXXXX
  whatsapp: "+919876543210",       // Format: +91XXXXXXXXXX
  email: "contact@trimurtijyotish.com",
  address: {
    marathi: "त्रिमूर्ती ज्योतिषालय, पुणे, महाराष्ट्र",
    hindi: "त्रिदेव ज्योतिषालय, पुणे, महाराष्ट्र",
    english: "Trimurti Jyotishalay, Pune, Maharashtra"
  },
  
  // Paste your actual Google Maps Embed URL (iframe src) or share link here
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121059.04711155986!2d73.79292605!3d18.5245649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9dce3e32!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  mapsDirectLink: "https://maps.google.com/?q=Pune,Maharashtra",

  workingHours: [
    { dayKey: "mon_fri", defaultText: "सोमवार - शुक्रवार", hours: "09:00 AM - 07:00 PM" },
    { dayKey: "sat", defaultText: "शनिवार", hours: "09:00 AM - 05:00 PM" },
    { dayKey: "sun", defaultText: "रविवार", hours: "पूर्वनियोजित भेट (By Appointment Only)" }
  ],

  howToReach: {
    car: {
      marathi: "गुगल मॅप्सवर 'Trimurti Jyotishalay' शोधा आणि थेट लोकेशन फॉलो करा.",
      english: "Search 'Trimurti Jyotishalay' on Google Maps and follow navigation."
    },
    bus: {
      marathi: "जवळचे बस स्टॉप: [तुमचे बस स्थानक]. तेथून २ मिनिटांच्या अंतरावर.",
      english: "Nearest Bus Stop: [Your Bus Stop]. 2 minutes walk from there."
    },
    train: {
      marathi: "जवळचे रेल्वे स्टेशन: पुणे जंक्शन (अंदाजे १५ मिनिटे).",
      english: "Nearest Railway Station: Pune Junction (Approx. 15 mins)."
    }
  },

  socialMedia: {
    instagram: "", // e.g. "https://instagram.com/trimurtijyotishalay"
    facebook: "",  // e.g. "https://facebook.com/trimurtijyotishalay"
    youtube: ""    // e.g. "https://youtube.com/@trimurtijyotishalay"
  }
};