/**
 * Life Event Planner - Data Repository
 * Trimurti Jyotishalay
 */

window.LifeEventsData = {
  events: {
    "housewarming": {
      id: "housewarming",
      icon: "🏠",
      title: "New House & Housewarming",
      titleMr: "नवीन घर व वास्तुशांती",
      subtitle: "Complete Vedic guide for moving into your new home, from fixing Muhurta to final blessings.",
      heroBadge: "गृहप्रवेश व वास्तुशांती विशेष",
      
      recommendedPujas: [
        {
          id: "vastu-shanti",
          name: "Vastu Shanti Puja",
          nameMr: "वास्तुशांती पूजा",
          rating: "5.0",
          reviews: 128,
          duration: "3 - 4 Hours",
          price: 3500,
          description: "Removes Vastu defects, purifies home energy, and invites prosperity before shifting.",
          popular: true
        },
        {
          id: "ganapati-homam",
          name: "Ganapati Puja & Havanam",
          nameMr: "गणपती पूजन व हवन",
          rating: "4.9",
          reviews: 94,
          duration: "2 Hours",
          price: 2100,
          description: "Removes all obstacles and brings auspiciousness to the new premises.",
          popular: false
        },
        {
          id: "satyanarayan",
          name: "Satyanarayan Puja",
          nameMr: "श्री सत्यनारायण महापूजा",
          rating: "4.8",
          reviews: 210,
          duration: "2.5 Hours",
          price: 1800,
          description: "Traditional thanksgiving ceremony for family harmony and health.",
          popular: false
        }
      ],

      checklist: [
        { id: "chk_1", task: "Select auspicious date and time (Muhurta) with Guruji", timeframe: "30 Days Before" },
        { id: "chk_2", task: "Book Guruji and confirm team requirements", timeframe: "21 Days Before" },
        { id: "chk_3", task: "Prepare property documents and home floor plan", timeframe: "15 Days Before" },
        { id: "chk_4", task: "Order Puja Samagri & fresh flowers", timeframe: "7 Days Before" },
        { id: "chk_5", task: "Clean main entrance (Toran area) and altar (Pooja Ghar)", timeframe: "2 Days Before" },
        { id: "chk_6", task: "Arrange brass Kalash, coconut, and fresh milk for boiling ceremony", timeframe: "1 Day Before" },
        { id: "chk_7", task: "Welcome Guruji and conduct Pratham Pravesh", timeframe: "Event Day" }
      ],

      documents: [
        { name: "Property Index II / Ownership Document", requirement: "For Vastu Sankalp alignment" },
        { name: "House Floor Layout / Blue Map", requirement: "To identify Eight Directions (Ashta Dikpalas)" },
        { name: "Yajman (Owner) Birth Details", requirement: "For personalized Muhurta verification" }
      ],

      samagri: [
        { name: "Coconut (श्रीफळ)", qty: "5 Pcs", purpose: "Kalash Sthapana & Vastu Bali", icon: "🥥" },
        { name: "Mango Leaves (आंब्याची पाने)", qty: "21 Pcs", purpose: "Toran & Kalash Decoration", icon: "🌿" },
        { name: "Fresh Flowers (झेंडू व सुवासिक फुले)", qty: "2.5 kg", purpose: "Mandap & Altar Decoration", icon: "🌺" },
        { name: "Desi Cow Ghee (शुद्ध गायीचे तूप)", qty: "1 kg", purpose: "Havan & Deepa Prajvalan", icon: "🪔" },
        { name: "Navadhanya (नवधान्य प्रकार)", qty: "1 Pack", purpose: "Navagraha & Vastu Sthapana", icon: "🌾" }
      ],

      timeline: [
        { phase: "30 Days Before", title: "Muhurta & Booking", desc: "Consult Guruji with birth details to finalize date and exact entrance time." },
        { phase: "15 Days Before", title: "Invitations & Vendor Booking", desc: "Send invitations to family and arrange catering/flower decorators." },
        { phase: "7 Days Before", title: "Samagri Verification", desc: "Review checklist with Guruji and order essential items." },
        { phase: "1 Day Before", title: "Site Preparation", desc: "Deep clean the house, set up altar facing East/North-East." },
        { phase: "Event Day", title: "Puja Execution", desc: "Perform Milk Boiling ritual followed by Vastu Shanti and Havan." }
      ],

      budget: [
        { id: "b_1", item: "Guruji Dakshina & Assistant Priest", defaultCost: 3500 },
        { id: "b_2", item: "Puja Samagri Kit", defaultCost: 1800 },
        { id: "b_3", item: "Fresh Flowers & Entrance Decoration", defaultCost: 1200 },
        { id: "b_4", item: "Prasad & Catering Estimate", defaultCost: 5000 }
      ],

      faqs: [
        {
          q: "Can we perform Vastu Shanti in a rented apartment?",
          a: "Yes. In a rented home, a simplified Vastu Shanti or Ganapati Homam purifies the energy and removes negative vibrations from previous occupants."
        },
        {
          q: "In which direction should the main Puja Altar face?",
          a: "The ideal location for the Puja Altar is the Ishanya Kona (North-East direction). The devotee should face East while performing rituals."
        },
        {
          q: "What is the significance of milk boiling during housewarming?",
          a: "Boiling milk until it overflows symbolizes abundance, health, and endless prosperity entering the new household."
        }
      ],

      videos: [
        { title: "Essential Steps for New House Entry Ritual", duration: "4:15", thumbnailBg: "#8b1a1a" },
        { title: "Vastu Direction Guide for Home Altar Setup", duration: "6:30", thumbnailBg: "#c8860a" }
      ]
    },

    "marriage": {
      id: "marriage",
      icon: "💍",
      title: "Marriage & Wedding Ceremonies",
      titleMr: "शुभ विवाह व लग्नविधी",
      subtitle: "Step-by-step guidance for Vedic wedding rituals, Seemant Pujan, Vivah Havan, and Saptapadi.",
      heroBadge: "वैदिक विवाह संस्कार",
      
      recommendedPujas: [
        {
          id: "vivah-sanskar",
          name: "Complete Vedic Vivah Sanskar",
          nameMr: "संपूर्ण वैदिक विवाह विधी",
          rating: "5.0",
          reviews: 86,
          duration: "Full Day",
          price: 11000,
          description: "End-to-end management of Kanyadaan, Mangalashtaka, Panigrahan, and Saptapadi.",
          popular: true
        },
        {
          id: "graha-mukhastpan",
          name: "Grahakshanti & Haldi Pujan",
          nameMr: "ग्रहशांती व हळद पूजन",
          rating: "4.9",
          reviews: 52,
          duration: "3 Hours",
          price: 3100,
          description: "Pre-wedding ritual to appease Nine Planets and pray for a smooth marriage ceremony.",
          popular: false
        }
      ],

      checklist: [
        { id: "m_chk_1", task: "Perform Kundali Milan and secure auspicious Lagna Muhurta", timeframe: "60 Days Before" },
        { id: "m_chk_2", task: "Finalize Guruji panel for Bride & Groom families", timeframe: "45 Days Before" },
        { id: "m_chk_3", task: "Prepare Vivah Samagri (Antarpat, Mangalsutra, Laundi)", timeframe: "15 Days Before" },
        { id: "m_chk_4", task: "Conduct Grahakshanti and Kuldevi Pujan at home", timeframe: "1 Day Before" },
        { id: "m_chk_5", task: "Execute Saptapadi & Kanyadaan as per Vedic norms", timeframe: "Event Day" }
      ],

      documents: [
        { name: "Bride & Groom Birth Details (Horoscope)", requirement: "For Lagna Patrika generation" },
        { name: "Family Gotra & Lineage Information", requirement: "For Sankalp & Pravara recitation" }
      ],

      samagri: [
        { name: "Antarpat Silk Cloth (अंतरपाट)", qty: "1 Pc", purpose: "Mangalashtaka ceremony", icon: "🧣" },
        { name: "Laja / Puffed Rice (लाह्या)", qty: "1 kg", purpose: "Laja Homam & Saptapadi", icon: "🌾" },
        { name: "Yajnopavita / Sacred Thread", qty: "2 Sets", purpose: "Groom Samskara", icon: "🧵" }
      ],

      timeline: [
        { phase: "60 Days Before", title: "Lagna Muhurta", desc: "Select precise wedding moment and print Lagna Patrika." },
        { phase: "2 Days Before", title: "Grahakshanti", desc: "Perform home purification and planetary offerings." },
        { phase: "Event Day", title: "Vivah Sanskar", desc: "Main wedding rituals ending with Saptapadi and Blessings." }
      ],

      budget: [
        { id: "mb_1", item: "Guruji Dakshina (Main Priest + 2 Assistants)", defaultCost: 11000 },
        { id: "mb_2", item: "Vedic Vivah Samagri Kit", defaultCost: 3500 },
        { id: "mb_3", item: "Havan Kund & Mandap Ritual Setup", defaultCost: 2500 }
      ],

      faqs: [
        {
          q: "Why is Saptapadi considered the most important part of Vivah?",
          a: "The Seven Steps represent vows for food, strength, wealth, happiness, progeny, seasons, and lifelong friendship. Once the 7th step is completed, the marriage is legally and spiritually binding."
        }
      ],

      videos: [
        { title: "Understanding the 7 Vows of Saptapadi", duration: "8:10", thumbnailBg: "#8b1a1a" }
      ]
    }
  }
};