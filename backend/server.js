import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes, { initDefaultAdmin } from './routes/authRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import Scheme from './models/Scheme.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);

// Helper to generate smart Saathi AI responses
const generateSaathiReply = (prompt, schemes = [], lang = 'en') => {
  const q = prompt ? prompt.toLowerCase().trim() : '';

  // 1. General Greetings & Help
  if (
    q === 'hi' || q === 'hello' || q === 'hey' || q === 'namaste' || 
    q.includes('who are you') || q.includes('kya kar sakte ho') || q.includes('help') || q.includes('sahayata')
  ) {
    if (lang === 'hi') {
      return `नमस्ते! 🙏 मैं हूँ **साथी AI (Saathi AI)** — आपका पर्सनल सरकारी योजना सहायक।\n\nमैं आपकी योग्यता के अनुसार सही योजनाएं खोजने, आवश्यक दस्तावेज़ बताने और आवेदन प्रक्रिया में मदद कर सकता हूँ।\n\nआप मुझसे पूछ सकते हैं:\n• *"मैं एक किसान हूँ, मुझे कौन सी योजना मिलेगी?"*\n• *"पश्चिम बंगाल के छात्रों के लिए स्कॉलरशिप"*` +
        `\n• *"आयुष्मान भारत कार्ड के लिए कैसे अप्लाई करें?"*\n• *"महिलाओं के लिए सरकारी योजनाएं"*`;
    } else if (lang === 'bn') {
      return `নমস্কার! 🙏 আমি **সাথী এআই (Saathi AI)** — আপনার সরকারি প্রকল্পের ডিজিটাল সহকারী।\n\nআমি আপনার যোগ্যতা অনুযায়ী সরকারি স্কিম খুঁজতে, প্রয়োজনীয় নথিপত্র জানতে এবং আবেদন করতে সাহায্য করতে পারি।\n\nআপনি জিজ্ঞাসা করতে পারেন:\n• *"ছাত্রদের জন্য কোন কোন স্কলারশিপ আছে?"*\n• *"কৃষকদের জন্য প্রকল্প"*` +
        `\n• *"কন্যাশ্রী বা স্বাস্থ্য সাথী প্রকল্পের সুবিধা কী?"*`;
    } else if (lang === 'ta') {
      return `வணக்கம்! 🙏 நான் **சாத்தி AI (Saathi AI)** — அரசு நலத்திட்ட வழிகாட்டி.\n\nஉங்களின் தகுதிக்கேற்ப திட்டங்களை பரிந்துரைக்கிறேன். கல்வி உதவித்தொகை, விவசாயிகள் திட்டம், மகளிர் உதவிகள் பற்றி கேட்கலாம்!`;
    } else if (lang === 'te') {
      return `నమస్కారం! 🙏 నేను **సాథీ AI (Saathi AI)** — ప్రభుత్వ పథకాల సహాయకుడు.\n\nరైతు పథకాలు, విద్యార్థుల స్కాలర్‌షిప్‌లు, మహిళా సంక్షేమ పథకాల గురించి నన్ను అడగండి!`;
    }
    return `Namaste! 🙏 I am **Saathi AI** — your intelligent government welfare schemes assistant.\n\nI can help you find eligible schemes, calculate benefits, check required documents, and guide you through the application process.\n\n**Try asking:**\n• *"I am a student looking for higher education scholarships"*\n• *"What schemes are available for farmers?"*\n• *"Women empowerment and financial assistance schemes in West Bengal"*\n• *"How to get health insurance coverage up to ₹5 Lakh?"*`;
  }

  // 2. Documents & Application Guide Queries
  if (q.includes('document') || q.includes('kagaz') || q.includes('certificate') || q.includes('patra') || q.includes('proyojoniyo') || q.includes('documents')) {
    if (lang === 'hi') {
      return `📄 **सरकारी योजनाओं के लिए सामान्यतः आवश्यक दस्तावेज़:**\n\n1. **पहचान प्रमाण:** आधार कार्ड (Aadhaar Card) / वोटर आईडी\n2. **निवास प्रमाण:** राशन कार्ड / बिजली बिल / मूल निवास प्रमाण पत्र (Domicile)\n3. **आय प्रमाण पत्र:** Income Certificate (सक्षम प्राधिकारी द्वारा जारी)\n4. **बैंक खाता:** बैंक पासबुक (आधार से लिंक एवं DBT सक्षम)\n5. **शैक्षणिक/जाति प्रमाण:** 10th/12th मार्कशीट या SC/ST/OBC Certificate (यदि लागू हो)\n6. **पासपोर्ट साइज फोटो एवं मोबाइल नंबर**\n\nकिसी विशिष्ट योजना के लिए नाम लिखकर पूछें!`;
    } else if (lang === 'bn') {
      return `📄 **সরকারি প্রকল্পের জন্য প্রয়োজনীয় সাধারণ নথিপত্র:**\n\n1. **পরিচয়পত্র:** আধার কার্ড (Aadhaar Card) / ভোটার আইডি\n2. **ঠিকানার প্রমাণ:** রেশন কার্ড / বসবাসের সার্টিফিকেট (Residential Certificate)\n3. **আয়ের প্রমাণপত্র:** ইনকাম সার্টিফিকেট (Income Certificate)\n4. **ব্যাংক অ্যাকাউন্ট:** ব্যাংক পাসবুক (আধার লিংক ও DBT চালু)\n5. **কাস্ট সার্টিফিকেট / শিক্ষাগত যোগ্যতা:** (প্রযোজ্য ক্ষেত্রে)\n6. **পাসপোর্ট সাইজ ফটো এবং আধার লিঙ্কড মোবাইল নম্বর**`;
    }
    return `📄 **Standard Documents Required for Government Schemes:**\n\n1. **Proof of Identity:** Aadhaar Card / Voter ID\n2. **Proof of Residence:** Domicile Certificate / Ration Card / Electricity Bill\n3. **Income Certificate:** Issued by competent authority (Tahsildar / BDO / Revenue Officer)\n4. **Bank Details:** Bank Passbook with Active Aadhaar-seeded DBT\n5. **Category/Caste Certificate:** SC / ST / OBC / EWS (where applicable)\n6. **Passport-sized Photographs & Active Mobile Number**\n\nAsk me about a specific scheme to get its exact document checklist!`;
  }

  // 3. How to Apply / Application Process Queries
  if (q.includes('how to apply') || q.includes('apply kaise kare') || q.includes('abedon') || q.includes('process') || q.includes('procedure') || q.includes('registration')) {
    return `📝 **Step-by-Step Guide to Apply for Government Schemes:**\n\n` +
      `1. **Eligibility Verification:** Ensure you meet the age, income, and domicile criteria.\n` +
      `2. **Keep Documents Ready:** Prepare Aadhaar, Income Certificate, Bank Details & Domicile proof.\n` +
      `3. **Online Portal or Local Center:**\n` +
      `   • Central Schemes: Visit official portals like NSP (scholarships.gov.in), PM-Kisan (pmkisan.gov.in), or PM-JAY.\n` +
      `   • State Schemes: Visit respective state portal (e.g. Duare Sarkar camps for WB, Seva Sindhu for Karnataka).\n` +
      `4. **Submit Application & Verification:** Fill the form, upload certificates, and note the Application Reference ID.\n` +
      `5. **Direct Benefit Transfer (DBT):** Once approved, subsidies/funds are credited directly to your Aadhaar-linked bank account.`;
  }

  // 4. Specific Category & Keyword Intelligence Search in MongoDB schemes
  let filtered = schemes.filter(s => {
    const title = s.title ? s.title.toLowerCase() : '';
    const desc = s.description ? s.description.toLowerCase() : '';
    const cat = s.category ? s.category.toLowerCase() : '';
    const st = s.state ? s.state.toLowerCase() : '';

    // Student / Scholarship queries
    if (q.includes('student') || q.includes('scholarship') || q.includes('college') || q.includes('school') || q.includes('chhatra') || q.includes('education') || q.includes('padhai')) {
      return cat.includes('education') || cat.includes('student') || title.includes('scholarship') || title.includes('kanyashree') || title.includes('pragati') || title.includes('credit card');
    }

    // Farmer / Agriculture queries
    if (q.includes('farmer') || q.includes('kisan') || q.includes('krishi') || q.includes('crop') || q.includes('agriculture') || q.includes('fasal') || q.includes('chasi')) {
      return cat.includes('agriculture') || title.includes('kisan') || title.includes('krishak') || title.includes('fasal') || title.includes('rythu') || title.includes('matsya');
    }

    // Women / Girl queries
    if (q.includes('woman') || q.includes('women') || q.includes('girl') || q.includes('mahila') || q.includes('nari') || q.includes('mother') || q.includes('daughter') || q.includes('beti')) {
      return cat.includes('women') || title.includes('mahila') || title.includes('beti') || title.includes('kanya') || title.includes('ujjwala') || title.includes('matru') || title.includes('rupashree') || title.includes('sukanya');
    }

    // Health / Hospital / Insurance queries
    if (q.includes('health') || q.includes('hospital') || q.includes('ayushman') || q.includes('medical') || q.includes('swasthya') || q.includes('illness') || q.includes('treatment') || q.includes('insurance')) {
      return cat.includes('health') || title.includes('ayushman') || title.includes('swasthya') || title.includes('aarogyasri') || title.includes('bima') || title.includes('indradhanush');
    }

    // Senior citizen / Pension queries
    if (q.includes('senior') || q.includes('elderly') || q.includes('pension') || q.includes('old age') || q.includes('vridha') || q.includes('retirement')) {
      return cat.includes('senior') || title.includes('pension') || title.includes('atal') || title.includes('nsap') || title.includes('bandhu') || title.includes('joy bangla');
    }

    // Employment / Loan / Business queries
    if (q.includes('job') || q.includes('employment') || q.includes('loan') || q.includes('business') || q.includes('startup') || q.includes('skill') || q.includes('rozgar') || q.includes('naukri') || q.includes('unemployed')) {
      return cat.includes('employment') || cat.includes('business') || title.includes('pmegp') || title.includes('svanidhi') || title.includes('startup') || title.includes('stand-up') || title.includes('kaushal') || title.includes('karma');
    }

    // Housing / Awas queries
    if (q.includes('house') || q.includes('housing') || q.includes('awas') || q.includes('ghar') || q.includes('makan') || q.includes('home') || q.includes('basha')) {
      return cat.includes('housing') || title.includes('awas') || title.includes('pmay') || title.includes('chaa sundari');
    }

    // Direct multi-keyword matching
    return title.includes(q) || desc.includes(q) || cat.includes(q) || (st && q.includes(st.toLowerCase()));
  });

  // State filtering if state mentioned in query
  const states = ['west bengal', 'bihar', 'delhi', 'maharashtra', 'uttar pradesh', 'tamil nadu', 'telangana', 'andhra pradesh', 'kerala', 'karnataka', 'punjab', 'rajasthan', 'gujarat', 'odisha', 'assam', 'chhattisgarh', 'haryana', 'jharkhand', 'madhya pradesh'];
  const matchedState = states.find(s => q.includes(s));
  if (matchedState && filtered.length > 0) {
    const stateFiltered = filtered.filter(s => s.state && (s.state.toLowerCase().includes(matchedState) || s.state.toLowerCase() === 'all india'));
    if (stateFiltered.length > 0) filtered = stateFiltered;
  }

  // Generate response from matched schemes
  if (filtered.length > 0) {
    const topSchemes = filtered.slice(0, 5);
    const header = lang === 'hi'
      ? `✨ मुझे आपकी खोज के लिए **${filtered.length} उपयुक्त सरकारी योजनाएं** मिली हैं:\n\n`
      : lang === 'bn'
      ? `✨ আপনার প্রশ্নের ভিত্তিতে **${filtered.length} টি সরকারি প্রকল্প** পাওয়া গেছে:\n\n`
      : `✨ I found **${filtered.length} relevant government schemes** matching your query:\n\n`;

    const body = topSchemes.map((s, idx) => 
      `**${idx + 1}. ${s.title}** (${s.category} • ${s.state || 'All India'})\n` +
      `💰 **Benefit:** ${s.amount || 'Financial Assistance'}\n` +
      `👥 **Beneficiaries:** ${s.users || 'Open to eligible citizens'}\n` +
      `📋 **Overview:** ${s.description}\n`
    ).join('\n');

    const footer = filtered.length > 5 
      ? `\n\n💡 *...and ${filtered.length - 5} more matching schemes in database! You can also check the Schemes tab or use Eligibility Checker for instant scoring.*`
      : `\n\n💡 *Tip: Click on any scheme on the portal to view full document requirements and apply.*`;

    return header + body + footer;
  }

  // Fallback with helpful suggestions
  if (lang === 'hi') {
    return `नमस्ते! 🙏 मुझे "${prompt}" के लिए कोई सटीक योजना नहीं मिली।\n\nआप निम्न श्रेणियों में से पूछ सकते हैं:\n• 🌾 **कृषि व किसान:** पीएम-किसान, फसल बीमा, केसीसी\n• 🎓 **शिक्षा व छात्र:** नेशनल स्कॉलरशिप, स्टूडेंट क्रेडिट कार्ड\n• 👩 **महिला कल्याण:** सुकन्या समृद्धि, उज्ज्वला, मातृ वंदना\n• 🏥 **स्वास्थ्य:** आयुष्मान भारत (₹5 लाख बीमा), स्वास्थ्य साथी\n• 💼 **रोजगार व व्यापार:** मुद्रा लोन, पीएम स्वनिधि, स्टार्टअप इंडिया`;
  }

  return `Namaste! 🙏 I searched your database for "${prompt}".\n\nTo find the most suitable benefits, try asking by your persona or goal:\n• 🎓 *"Scholarships for college students"*\n• 🌾 *"Financial support and crop insurance for farmers"*\n• 👩 *"Welfare and savings schemes for women & girl child"*\n• 🏥 *"Cashless health insurance up to ₹5 Lakh"*\n• 💼 *"Zero-collateral loans for youth & small businesses"*\n\nYou can also type **"show all schemes"** to view all options in your portal!`;
};

// Database-Driven Smart AI Chatbot Route
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, language = 'en' } = req.body;
    
    // Fetch all schemes dynamically from MongoDB Atlas
    let schemes = [];
    try {
      schemes = await Scheme.find({});
    } catch (dbErr) {
      console.warn('MongoDB scheme lookup warning:', dbErr.message);
    }
    
    const reply = generateSaathiReply(prompt, schemes, language);
    res.json({ reply });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.json({ reply: "Namaste! 🙏 I am Saathi AI. Your portal is ready to assist you. Ask about scholarships, farmer benefits, women welfare, or health insurance!" });
  }
});

// Health check endpoint for uptime monitors
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Keep-alive self-ping for Render Free Tier (every 14 minutes)
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://gov-scheme-portal.onrender.com';
setInterval(() => {
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    fetch(`${RENDER_URL}/api/health`)
      .then(res => res.json())
      .then(() => console.log('[KEEP-ALIVE] Pinged self successfully to prevent sleep'))
      .catch(err => console.warn('[KEEP-ALIVE] Ping notice:', err.message));
  }
}, 14 * 60 * 1000);

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log('MongoDB Atlas Connected Successfully');
      await initDefaultAdmin();
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error('MongoDB Atlas connection warning:', err.message);
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
} else {
  console.warn('MONGO_URI is not set in environment variables. Running server without active database connection.');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}