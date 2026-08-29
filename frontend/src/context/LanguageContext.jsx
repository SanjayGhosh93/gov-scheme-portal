/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Nav
    home: "Home",
    schemes: "Schemes",
    eligibility: "Eligibility",
    favourites: "Favourites",
    admin: "Admin",
    login: "Login",
    logout: "Logout",
    signedInAs: "Signed in as",
    adminPanel: "Admin Panel",
    loginRegister: "Login / Register",

    // Home / Hero
    empoweringCitizens: "Empowering Citizens",
    heroTitlePrefix: "Find Central & State Government Schemes in",
    heroTitleSuffix: "Seconds",
    heroSubtitle: "SchemeSaathi simplifies discovering government welfare benefits, scholarships, and financial assistance programs tailored specifically for you.",
    exploreSchemes: "Explore Schemes",
    checkEligibility: "Check Eligibility",
    eligibleIn30s: "Eligible in 30 sec",
    aiPowered: "AI Powered",
    checkMyEligibilityBtn: "Check My Eligibility →",
    browseCategories: "Browse by Categories",

    // Categories
    All: "All",
    "All Categories": "All Categories",
    Agriculture: "Agriculture",
    Education: "Education",
    Health: "Health",
    Women: "Women",
    Housing: "Housing",
    Employment: "Employment",
    "Senior Citizens": "Senior Citizens",
    Students: "Students",

    // Schemes Page & Filters
    filters: "Filters",
    clearFilters: "Clear filters",
    search: "Search",
    searchPlaceholder: "Scheme name, keyword...",
    category: "Category",
    state: "State",
    quickStats: "Quick Stats",
    results: "Results",
    saved: "Saved",
    allSchemes: "All Schemes",
    schemesSuffix: "Schemes",
    liveMongoSync: "Live MongoDB Sync",
    noSchemesTitle: "No schemes found for",
    noSchemesDesc: "No matching schemes are currently saved in your database exclusively for this state.",
    resetFilters: "Reset All Filters →",

    // Eligibility Checker
    searchTitle: "Scheme Eligibility Checker",
    searchSubtitle: "Enter your details below to find government schemes you qualify for from your database.",
    selectCategory: "Select Category",
    selectState: "Select State",
    annualIncome: "Annual Family Income (₹)",
    incomePlaceholder: "e.g. 250000",
    checkEligibleSchemes: "Check Eligible Schemes",
    matchingFound: "Matching Schemes Found",
    categoryLabel: "Category",
    stateLabel: "State",
    noEligibilityResults: "No schemes found specifically for your criteria. Try adjusting your filters or adding state schemes via the Admin Panel.",

    // Favourites
    yourFavourites: "Your Favourites",
    savedSuffix: "saved",
    noFavouritesTitle: "No favourite schemes yet",
    noFavouritesDesc: "Explore the schemes directory and tap the heart icon on any scheme to save it here for quick access.",
    exploreSchemesBtn: "Explore Schemes →",

    // Scheme Card & Modal
    viewDetails: "View Details",
    applyNow: "Apply Now →",
    proceedToApply: "Proceed to Apply →",
    close: "Close",
    financialBenefit: "Financial Benefit",
    beneficiaries: "Beneficiaries",
    description: "Description",
    benefitsAvailable: "Benefits Available",
    open: "Open",
    notSpecified: "Not Specified",
    removeFromFavourites: "Remove from Favourites",
    addToFavourites: "Add to Favourites",

    // Footer
    footerBrandDesc: "SchemeSaathi simplifies discovering government welfare benefits, scholarships, and financial assistance programs tailored specifically for you, synced directly with MongoDB Atlas.",
    footerCategories: "Categories",
    footerQuickLinks: "Quick Links",
    aiAssistant: "AI Assistant",
    allRightsReserved: "All rights reserved. Built for citizens.",

    // Chatbot
    saathiAi: "Saathi AI",
    speaking: "🔊 Speaking...",
    backendConnected: "● Backend Connected",
    muteSpeech: "Mute Speech",
    askSchemePlaceholder: "Ask about any scheme...",
    listening: "Listening...",
    initialAiGreeting: "Namaste! 🙏 I'm Saathi AI. Ask me about any government scheme."
  },
  hi: {
    // Nav
    home: "होम",
    schemes: "योजनाएं",
    eligibility: "पात्रता जांच",
    favourites: "पसंदीदा",
    admin: "एडमिन",
    login: "लॉग इन",
    logout: "लॉग आउट",
    signedInAs: "के रूप में साइन इन हैं",
    adminPanel: "एडमिन पैनल",
    loginRegister: "लॉग इन / रजिस्टर",

    // Home / Hero
    empoweringCitizens: "नागरिकों का सशक्तिकरण",
    heroTitlePrefix: "केंद्र और राज्य सरकार की योजनाएं खोजें कुछ ही",
    heroTitleSuffix: "सेकंड में",
    heroSubtitle: "स्कीमसाथी आपके लिए विशेष रूप से तैयार सरकारी कल्याणकारी लाभों, छात्रवृत्तियों और वित्तीय सहायता कार्यक्रमों की खोज को आसान बनाता है।",
    exploreSchemes: "योजनाएं देखें",
    checkEligibility: "पात्रता जांचें",
    eligibleIn30s: "30 सेकंड में पात्रता",
    aiPowered: "AI आधारित",
    checkMyEligibilityBtn: "मेरी पात्रता जांचें →",
    browseCategories: "श्रेणी अनुसार देखें",

    // Categories
    All: "सभी",
    "All Categories": "सभी श्रेणियां",
    Agriculture: "कृषि",
    Education: "शिक्षा",
    Health: "स्वास्थ्य",
    Women: "महिला",
    Housing: "आवास",
    Employment: "रोजगार",
    "Senior Citizens": "वरिष्ठ नागरिक",
    Students: "छात्र",

    // Schemes Page & Filters
    filters: "फ़िल्टर",
    clearFilters: "फ़िल्टर हटाएं",
    search: "खोजें",
    searchPlaceholder: "योजना का नाम, कीवर्ड...",
    category: "श्रेणी",
    state: "राज्य",
    quickStats: "त्वरित आंकड़े",
    results: "परिणाम",
    saved: "सहेजे गए",
    allSchemes: "सभी योजनाएं",
    schemesSuffix: "योजनाएं",
    liveMongoSync: "लाइव मोंगोडीबी सिंक",
    noSchemesTitle: "के लिए कोई योजना नहीं मिली",
    noSchemesDesc: "इस राज्य के लिए डेटाबेस में कोई विशिष्ट योजना नहीं मिली।",
    resetFilters: "सभी फ़िल्टर रीसेट करें →",

    // Eligibility Checker
    searchTitle: "योजना पात्रता जांचकर्ता",
    searchSubtitle: "अपने डेटाबेस से सरकारी योजनाएं खोजने के लिए नीचे दिए गए विवरण दर्ज करें।",
    selectCategory: "श्रेणी चुनें",
    selectState: "राज्य चुनें",
    annualIncome: "वार्षिक पारिवारिक आय (₹)",
    incomePlaceholder: "उदा. 250000",
    checkEligibleSchemes: "पात्र योजनाएं जांचें",
    matchingFound: "उपलब्ध योजनाएं",
    categoryLabel: "श्रेणी",
    stateLabel: "राज्य",
    noEligibilityResults: "आपके मानदंडों के लिए कोई योजना नहीं मिली। कृपया फ़िल्टर बदलें या एडमिन पैनल से योजनाएं जोड़ें।",

    // Favourites
    yourFavourites: "आपकी पसंदीदा योजनाएं",
    savedSuffix: "सहेजे गए",
    noFavouritesTitle: "अभी कोई पसंदीदा योजना नहीं है",
    noFavouritesDesc: "योजना निर्देशिका देखें और त्वरित पहुंच के लिए किसी भी योजना पर दिल के आइकन पर टैप करें।",
    exploreSchemesBtn: "योजनाएं देखें →",

    // Scheme Card & Modal
    viewDetails: "विवरण देखें",
    applyNow: "आवेदन करें →",
    proceedToApply: "आवेदन के लिए आगे बढ़ें →",
    close: "बंद करें",
    financialBenefit: "वित्तीय लाभ",
    beneficiaries: "लाभार्थी",
    description: "विवरण",
    benefitsAvailable: "लाभ उपलब्ध",
    open: "खुला है",
    notSpecified: "उल्लेखित नहीं",
    removeFromFavourites: "पसंदीदा से हटाएं",
    addToFavourites: "पसंदीदा में जोड़ें",

    // Footer
    footerBrandDesc: "स्कीमसाथी आपके लिए सरकारी कल्याणकारी योजनाओं और छात्रवृत्तियों को खोजना सरल बनाता है।",
    footerCategories: "श्रेणियां",
    footerQuickLinks: "त्वरित लिंक",
    aiAssistant: "AI सहायक",
    allRightsReserved: "सर्वाधिकार सुरक्षित। नागरिकों के लिए निर्मित।",

    // Chatbot
    saathiAi: "साथी AI",
    speaking: "🔊 बोल रहा है...",
    backendConnected: "● बैकएंड जुड़ा हुआ है",
    muteSpeech: "आवाज बंद करें",
    askSchemePlaceholder: "किसी भी योजना के बारे में पूछें...",
    listening: "सुन रहा हूँ...",
    initialAiGreeting: "नमस्ते! 🙏 मैं साथी AI हूँ। मुझसे किसी भी सरकारी योजना के बारे में पूछें।"
  },
  bn: {
    // Nav
    home: "হোম",
    schemes: "প্রকল্পসমূহ",
    eligibility: "যোগ্যতা যাচাই",
    favourites: "পছন্দসই",
    admin: "অ্যাডমিন",
    login: "লগইন",
    logout: "লগআউট",
    signedInAs: "হিসাবে সাইন ইন করেছেন",
    adminPanel: "অ্যাডমিন প্যানেল",
    loginRegister: "লগইন / রেজিস্টার",

    // Home / Hero
    empoweringCitizens: "নাগরিকদের ক্ষমতায়ন",
    heroTitlePrefix: "কেন্দ্রীয় ও রাজ্য সরকারি প্রকল্প খুঁজুন মাত্র কয়েক",
    heroTitleSuffix: "সেকেন্ডে",
    heroSubtitle: "স্কিমসাথী আপনার জন্য বিশেষভাবে তৈরি সরকারি কল্যাণমূলক সুবিধা, বৃত্তি এবং আর্থিক সহায়তা প্রোগ্রাম খুঁজে পাওয়া সহজ করে।",
    exploreSchemes: "প্রকল্প অন্বেষণ করুন",
    checkEligibility: "যোগ্যতা পরীক্ষা করুন",
    eligibleIn30s: "৩০ সেকেন্ডে যোগ্যতা",
    aiPowered: "AI চালিত",
    checkMyEligibilityBtn: "আমার যোগ্যতা পরীক্ষা করুন →",
    browseCategories: "বিভাগ অনুসারে ব্রাউজ করুন",

    // Categories
    All: "সব",
    "All Categories": "সব বিভাগ",
    Agriculture: "কৃষি",
    Education: "শিক্ষা",
    Health: "স্বাস্থ্য",
    Women: "মহিলা",
    Housing: "আবাসন",
    Employment: "কর্মসংস্থান",
    "Senior Citizens": "প্রবীণ নাগরিক",
    Students: "ছাত্রছাত্রী",

    // Schemes Page & Filters
    filters: "ফিল্টার",
    clearFilters: "ফিল্টার মুছুন",
    search: "অনুসন্ধান",
    searchPlaceholder: "প্রকল্পের নাম, কীওয়ার্ড...",
    category: "বিভাগ",
    state: "রাজ্য",
    quickStats: "সংক্ষিপ্ত পরিসংখ্যান",
    results: "ফলাফল",
    saved: "সংরক্ষিত",
    allSchemes: "সব প্রকল্প",
    schemesSuffix: "প্রকল্পসমূহ",
    liveMongoSync: "লাইভ মঙ্গোডিবি সিঙ্ক",
    noSchemesTitle: "এর জন্য কোনো প্রকল্প পাওয়া যায়নি",
    noSchemesDesc: "এই রাজ্যের জন্য ডাটাবেসে কোনো নির্দিষ্ট প্রকল্প সংরক্ষিত নেই।",
    resetFilters: "সব ফিল্টার রিসেট করুন →",

    // Eligibility Checker
    searchTitle: "স্কিম যোগ্যতা পরীক্ষক",
    searchSubtitle: "আপনার ডাটাবেস থেকে আপনি যে সরকারি স্কিমগুলির জন্য যোগ্য তা খুঁজে পেতে নীচের বিবরণগুলি লিখুন।",
    selectCategory: "বিভাগ নির্বাচন করুন",
    selectState: "রাজ্য নির্বাচন করুন",
    annualIncome: "বার্ষিক পারিবারিক আয় (₹)",
    incomePlaceholder: "যেমন ২৫০০০০",
    checkEligibleSchemes: "যোগ্য প্রকল্পগুলি দেখুন",
    matchingFound: "উপযুক্ত প্রকল্প পাওয়া গেছে",
    categoryLabel: "বিভাগ",
    stateLabel: "রাজ্য",
    noEligibilityResults: "আপনার মানদণ্ডের সাথে মানানসই কোনো স্কিম পাওয়া যায়নি। ফিল্টার সামঞ্জস্য করুন।",

    // Favourites
    yourFavourites: "আপনার পছন্দের প্রকল্পগুলি",
    savedSuffix: "সংরক্ষিত",
    noFavouritesTitle: "এখনও কোনো পছন্দের প্রকল্প নেই",
    noFavouritesDesc: "প্রকল্প ডিরেক্টরি ব্রাউজ করুন এবং দ্রুত অ্যাক্সেসের জন্য যেকোনো স্কিমে হার্ট আইকনে ট্যাপ করুন।",
    exploreSchemesBtn: "প্রকল্পসমূহ দেখুন →",

    // Scheme Card & Modal
    viewDetails: "বিস্তারিত দেখুন",
    applyNow: "আবেদন করুন →",
    proceedToApply: "আবেদনে এগিয়ে যান →",
    close: "বন্ধ করুন",
    financialBenefit: "আর্থিক সুবিধা",
    beneficiaries: "সুবিধাভোগী",
    description: "বিবরণ",
    benefitsAvailable: "সুবিধা উপলব্ধ",
    open: "উন্মুক্ত",
    notSpecified: "নির্দিষ্ট নয়",
    removeFromFavourites: "পছন্দসই থেকে সরান",
    addToFavourites: "পছন্দসইতে যোগ করুন",

    // Footer
    footerBrandDesc: "স্কিমসাথী আপনার জন্য সরকারি কল্যাণমূলক সুবিধা এবং স্কলারশিপ প্রোগ্রাম আবিষ্কার সহজ করে তোলে।",
    footerCategories: "বিভাগসমূহ",
    footerQuickLinks: "দ্রুত লিঙ্ক",
    aiAssistant: "AI সহকারী",
    allRightsReserved: "সর্বস্বত্ব সংরক্ষিত। নাগরিকদের জন্য নির্মিত।",

    // Chatbot
    saathiAi: "সাথী AI",
    speaking: "🔊 কথা বলছে...",
    backendConnected: "● ব্যাকএন্ড সংযুক্ত",
    muteSpeech: "শব্দ বন্ধ করুন",
    askSchemePlaceholder: "যেকোনো প্রকল্প সম্পর্কে জিজ্ঞাসা করুন...",
    listening: "শুনছি...",
    initialAiGreeting: "নমস্কার! 🙏 আমি সাথী AI। যেকোনো সরকারি প্রকল্প সম্পর্কে আমাকে জিজ্ঞাসা করুন।"
  },
  ta: {
    // Nav
    home: "முகப்பு",
    schemes: "திட்டங்கள்",
    eligibility: "தகுதி சரிபார்ப்பு",
    favourites: "பிடித்தவை",
    admin: "நிர்வாகி",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    signedInAs: "உள்நுழைந்துள்ள கணக்கு",
    adminPanel: "நிர்வாக குழு",
    loginRegister: "உள்நுழை / பதிவு செய்",

    // Home / Hero
    empoweringCitizens: "குடிமக்கள் அதிகாரமளித்தல்",
    heroTitlePrefix: "மத்திய & மாநில அரசு நலத்திட்டங்களை சில",
    heroTitleSuffix: "வினாடிகளில் கண்டறியுங்கள்",
    heroSubtitle: "ஸ்கீம்சாத்தி உங்களுக்காக பிரத்யேகமாக வடிவமைக்கப்பட்ட அரசு நலத்திட்டங்கள், உதவித்தொகைகள் மற்றும் நிதி உதவி திட்டங்களை கண்டறிய உதவுகிறது.",
    exploreSchemes: "திட்டங்களை காண்க",
    checkEligibility: "தகுதியை சரிபார்க்கவும்",
    eligibleIn30s: "30 வினாடிகளில் தகுதி",
    aiPowered: "AI இயக்கப்படுகிறது",
    checkMyEligibilityBtn: "எனது தகுதியை சரிபார்க்கவும் →",
    browseCategories: "பிரிவுகள் மூலம் உலாவவும்",

    // Categories
    All: "அனைத்தும்",
    "All Categories": "அனைத்து பிரிவுகள்",
    Agriculture: "விவசாயம்",
    Education: "கல்வி",
    Health: "சுகாதாரம்",
    Women: "பெண்கள்",
    Housing: "வீட்டுவசதி",
    Employment: "வேலைவாய்ப்பு",
    "Senior Citizens": "மூத்த குடிமக்கள்",
    Students: "மாணவர்கள்",

    // Schemes Page & Filters
    filters: "வடிகட்டிகள்",
    clearFilters: "வடிகட்டிகளை அழி",
    search: "தேடுக",
    searchPlaceholder: "திட்டத்தின் பெயர், முக்கிய சொல்...",
    category: "பிரிவு",
    state: "மாநிலம்",
    quickStats: "விரைவு புள்ளிவிவரங்கள்",
    results: "முடிவுகள்",
    saved: "சேமிக்கப்பட்டவை",
    allSchemes: "அனைத்து திட்டங்கள்",
    schemesSuffix: "திட்டங்கள்",
    liveMongoSync: "நேரடி தரவுத்தள இணைப்பு",
    noSchemesTitle: "திட்டங்கள் எதுவும் கிடைக்கவில்லை",
    noSchemesDesc: "இந்த மாநிலத்திற்கு தற்போது எந்த திட்டங்களும் தரவுத்தளத்தில் சேமிக்கப்படவில்லை.",
    resetFilters: "அனைத்து வடிகட்டிகளையும் மீட்டமைக்கவும் →",

    // Eligibility Checker
    searchTitle: "திட்ட தகுதி சரிபார்ப்பாளர்",
    searchSubtitle: "உங்கள் தரவுத்தளத்திலிருந்து நீங்கள் தகுதியான அரசு திட்டங்களைக் கண்டறிய கீழே உள்ள விவரங்களை உள்ளிடவும்.",
    selectCategory: "பிரிவைத் தேர்ந்தெடுக்கவும்",
    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    annualIncome: "ஆண்டு குடும்ப வருமானம் (₹)",
    incomePlaceholder: "எ.கா. 250000",
    checkEligibleSchemes: "தகுதியான திட்டங்களைச் சரிபார்க்கவும்",
    matchingFound: "பொருந்தும் திட்டங்கள் கண்டறியப்பட்டன",
    categoryLabel: "பிரிவு",
    stateLabel: "மாநிலம்",
    noEligibilityResults: "உங்கள் நிபந்தனைகளுக்கு ஏற்ப திட்டங்கள் எதுவும் கிடைக்கவில்லை.",

    // Favourites
    yourFavourites: "உங்களுக்கு பிடித்தவை",
    savedSuffix: "சேமிக்கப்பட்டது",
    noFavouritesTitle: "விருப்பமான திட்டங்கள் எதுவும் இல்லை",
    noFavouritesDesc: "திட்டங்களை ஆராய்ந்து விரைவான அணுகலுக்கு இதய ஐகானை அழுத்தவும்.",
    exploreSchemesBtn: "திட்டங்களை ஆராய்க →",

    // Scheme Card & Modal
    viewDetails: "விவரங்களை காண்க",
    applyNow: "விண்ணப்பிக்கவும் →",
    proceedToApply: "விண்ணப்பிக்க தொடரவும் →",
    close: "மூடு",
    financialBenefit: "நிதி நன்மை",
    beneficiaries: "பயனாளிகள்",
    description: "விளக்கம்",
    benefitsAvailable: "நன்மைகள் கிடைக்கின்றன",
    open: "திறந்த",
    notSpecified: "குறிப்பிடப்படவில்லை",
    removeFromFavourites: "பிடித்தவற்றிலிருந்து நீக்கு",
    addToFavourites: "பிடித்தவற்றில் சேர்",

    // Footer
    footerBrandDesc: "ஸ்கீம்சாத்தி அரசு நலத்திட்டங்கள் மற்றும் உதவித்தொகைகளை எளிதாக கண்டறிய உதவுகிறது.",
    footerCategories: "பிரிவுகள்",
    footerQuickLinks: "விரைவு இணைப்புகள்",
    aiAssistant: "AI உதவியாளர்",
    allRightsReserved: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. குடிமக்களுக்காக உருவாக்கப்பட்டது.",

    // Chatbot
    saathiAi: "சாத்தி AI",
    speaking: "🔊 பேசுகிறது...",
    backendConnected: "● பின்தளம் இணைக்கப்பட்டுள்ளது",
    muteSpeech: "ஒலியை முடக்கு",
    askSchemePlaceholder: "எந்தவொரு திட்டத்தைப் பற்றியும் கேளுங்கள்...",
    listening: "கேட்கிறது...",
    initialAiGreeting: "வணக்கம்! 🙏 நான் சாத்தி AI. எந்தவொரு அரசு திட்டத்தைப் பற்றியும் என்னிடம் கேளுங்கள்."
  },
  te: {
    // Nav
    home: "హోమ్",
    schemes: "పథకాలు",
    eligibility: "అర్హత తనిఖీ",
    favourites: "ఇష్టమైనవి",
    admin: "అడ్మిన్",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    signedInAs: "లాగిన్ అయిన వారు",
    adminPanel: "అడ్మిన్ ప్యానెల్",
    loginRegister: "లాగిన్ / రిజిస్టర్",

    // Home / Hero
    empoweringCitizens: "పౌరుల సాధికారత",
    heroTitlePrefix: "కేంద్ర & రాష్ట్ర ప్రభుత్వ పథకాలను కొన్ని",
    heroTitleSuffix: "సెకన్లలో కనుగొనండి",
    heroSubtitle: "స్కీమ్‌సాథీ మీ కోసం ప్రత్యేకంగా రూపొందించిన ప్రభుత్వ సంక్షేమ పథకాలు, స్కాలర్‌షిప్‌లు మరియు ఆర్థిక సహాయాన్ని కనుగొనడం సులభం చేస్తుంది.",
    exploreSchemes: "పథకాలను అన్వేషించండి",
    checkEligibility: "అర్హతను తనిఖీ చేయండి",
    eligibleIn30s: "30 సెకన్లలో అర్హత",
    aiPowered: "AI ఆధారితం",
    checkMyEligibilityBtn: "నా అర్హతను తనిఖీ చేయండి →",
    browseCategories: "వర్గాల వారీగా బ్రౌజ్ చేయండి",

    // Categories
    All: "అన్నీ",
    "All Categories": "అన్ని వర్గాలు",
    Agriculture: "వ్యవసాయం",
    Education: "విద్య",
    Health: "ఆరోగ్యం",
    Women: "మహిళలు",
    Housing: "గృహనిర్మాణం",
    Employment: "ఉపాధి",
    "Senior Citizens": "సీనియర్ సిటిజన్లు",
    Students: "విద్యార్థులు",

    // Schemes Page & Filters
    filters: "ఫిల్టర్లు",
    clearFilters: "ఫిల్టర్లను తొలగించు",
    search: "శోధించండి",
    searchPlaceholder: "పథకం పేరు, కీవర్డ్...",
    category: "వర్గం",
    state: "రాష్ట్రం",
    quickStats: "త్వరిత గణాంకాలు",
    results: "ఫలితాలు",
    saved: "సేవ్ చేయబడినవి",
    allSchemes: "అన్ని పథకాలు",
    schemesSuffix: "పథకాలు",
    liveMongoSync: "లైవ్ డేటాబేస్ సింక్",
    noSchemesTitle: "పథకాలు ఏవీ కనుగొనబడలేదు",
    noSchemesDesc: "ఈ రాష్ట్రం కోసం డేటాబేస్‌లో పథకాలు ఏవీ లేవు.",
    resetFilters: "అన్ని ఫిల్టర్లను రీసెట్ చేయండి →",

    // Eligibility Checker
    searchTitle: "పథకం అర్హత తనిఖీ",
    searchSubtitle: "మీ డేటాబేస్ నుండి మీరు అర్హులైన ప్రభుత్వ పథకాలను కనుగొనడానికి దిగువ వివరాలను నమోదు చేయండి.",
    selectCategory: "వర్గాన్ని ఎంచుకోండి",
    selectState: "రాష్ట్రాన్ని ఎంచుకోండి",
    annualIncome: "వార్షిక కుటుంబ ఆదాయం (₹)",
    incomePlaceholder: "ఉదా. 250000",
    checkEligibleSchemes: "అర్హత ఉన్న పథకాలను తనిఖీ చేయండి",
    matchingFound: "సరిపోలే పథకాలు కనుగొనబడ్డాయి",
    categoryLabel: "వర్గం",
    stateLabel: "రాష్ట్రం",
    noEligibilityResults: "మీ అర్హతలకు తగిన పథకాలు ఏవీ కనుగొనబడలేదు.",

    // Favourites
    yourFavourites: "మీకు ఇష్టమైనవి",
    savedSuffix: "సేవ్ చేయబడింది",
    noFavouritesTitle: "ఇంకా ఇష్టమైన పథకాలు లేవు",
    noFavouritesDesc: "పథకాల డైరెక్టరీని అన్వేషించి, శీఘ్ర ప్రాప్యత కోసం హార్ట్ చిహ్నాన్ని నొక్కండి.",
    exploreSchemesBtn: "పథకాలను అన్వేషించండి →",

    // Scheme Card & Modal
    viewDetails: "వివరాలను చూడండి",
    applyNow: "దరఖాస్తు చేసుకోండి →",
    proceedToApply: "దరఖాస్తుకు వెళ్లండి →",
    close: "మూసివేయి",
    financialBenefit: "ఆర్థిక ప్రయోజనం",
    beneficiaries: "లబ్ధిదారులు",
    description: "వివరణ",
    benefitsAvailable: "ప్రయోజనాలు అందుబాటులో ఉన్నాయి",
    open: "అందుబాటులో ఉంది",
    notSpecified: "పేర్కొనబడలేదు",
    removeFromFavourites: "ఇష్టమైన వాటి నుండి తీసివేయి",
    addToFavourites: "ఇష్టమైన వాటికి జోడించు",

    // Footer
    footerBrandDesc: "స్కీమ్‌సాథీ ప్రభుత్వ సంక్షేమ ప్రయోజనాలు మరియు స్కాలర్‌షిప్‌లను సులభంగా కనుగొనడంలో మీకు సహాయపడుతుంది.",
    footerCategories: "వర్గాలు",
    footerQuickLinks: "త్వరిత లింకులు",
    aiAssistant: "AI అసిస్టెంట్",
    allRightsReserved: "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. పౌరుల కోసం రూపొందించబడింది.",

    // Chatbot
    saathiAi: "సాథీ AI",
    speaking: "🔊 మాట్లాడుతోంది...",
    backendConnected: "● బ్యాకెండ్ కనెక్ట్ చేయబడింది",
    muteSpeech: "శబ్దం ఆపివేయి",
    askSchemePlaceholder: "ఏదైనా పథకం గురించి అడగండి...",
    listening: "వింటోంది...",
    initialAiGreeting: "నమస్కారం! 🙏 నేను సాథీ AI. ఏదైనా ప్రభుత్వ పథకం గురించి నన్ను అడగండి."
  }
};

export const triggerGoogleTranslate = (langCode) => {
  try {
    const cookieVal = langCode === 'en' ? '' : `/en/${langCode}`;
    if (langCode === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
    } else {
      document.cookie = `googtrans=${cookieVal}; path=/;`;
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname};`;
    }

    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  } catch (err) {
    console.warn('Google translate error:', err);
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLangState] = useState(() => {
    try {
      return localStorage.getItem('schemesaathi_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setCurrentLang = (code) => {
    setCurrentLangState(code);
    try {
      localStorage.setItem('schemesaathi_lang', code);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
    triggerGoogleTranslate(code);
  };

  useEffect(() => {
    if (currentLang && currentLang !== 'en') {
      const timer = setTimeout(() => {
        triggerGoogleTranslate(currentLang);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentLang]);

  const t = (key) => {
    if (!key) return '';
    return translations[currentLang]?.[key] ?? translations['en']?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      currentLang: 'en',
      setCurrentLang: () => {},
      t: (key) => key,
      translations
    };
  }
  return context;
}