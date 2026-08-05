import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    home: "Home",
    schemes: "Schemes",
    eligibility: "Eligibility",
    favourites: "Favourites",
    admin: "Admin",
    login: "Login",
    searchTitle: "Scheme Eligibility Checker",
    searchSubtitle: "Enter your details below to find government schemes you qualify for from your database."
  },
  hi: {
    home: "होम",
    schemes: "योजनाएं",
    eligibility: "पात्रता जांच",
    favourites: "पसंदीदा",
    admin: "एडमिन",
    login: "लॉग इन",
    searchTitle: "योजना पात्रता जांचकर्ता",
    searchSubtitle: "अपने डेटाबेस से सरकारी योजनाएं खोजने के लिए नीचे दिए गए विवरण दर्ज करें।"
  },
  bn: {
    home: "হোম",
    schemes: "প্রকল্পসমূহ",
    eligibility: "যোগ্যতা যাচাই",
    favourites: "পছন্দসই",
    admin: "অ্যাডমিন",
    login: "লগইন",
    searchTitle: "স্কিম যোগ্যতা পরীক্ষক",
    searchSubtitle: "আপনার ডাটাবেস থেকে আপনি যে সরকারি স্কিমগুলির জন্য যোগ্য তা খুঁজে পেতে নীচের বিবরণগুলি লিখুন।"
  },
  ta: {
    home: "முகப்பு",
    schemes: "திட்டங்கள்",
    eligibility: "தகுதி சரிபார்ப்பு",
    favourites: "பிடித்தவை",
    admin: "நிர்வாகி",
    login: "உள்நுழை",
    searchTitle: "திட்ட தகுதி சரிபார்ப்பாளர்",
    searchSubtitle: "உங்கள் தரவுத்தளத்திலிருந்து நீங்கள் தகுதியான அரசு திட்டங்களைக் கண்டறிய கீழே உள்ள விவரங்களை உள்ளிடவும்."
  },
  te: {
    home: "హోమ్",
    schemes: "పథకాలు",
    eligibility: "అర్హత తనిఖీ",
    favourites: "ఇష్టమైనవి",
    admin: "అడ్మిన్",
    login: "లాగిన్",
    searchTitle: "పథకం అర్హత తనిఖీ",
    searchSubtitle: "మీ డేటాబేస్ నుండి మీరు అర్హులైన ప్రభుత్వ పథకాలను కనుగొనడానికి దిగువ వివరాలను నమోదు చేయండి."
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('en');

  const t = (key) => {
    return translations[currentLang]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}