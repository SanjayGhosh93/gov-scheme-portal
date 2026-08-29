import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../utils/apiConfig';

export default function FloatingAIChatbot({ schemes = [], darkMode = true }) {
  const { currentLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [localSchemes, setLocalSchemes] = useState(schemes || []);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: t('initialAiGreeting') || "Namaste! 🙏 I'm Saathi AI. Ask me about any government scheme, eligibility, benefits, or documents."
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Sync schemes from props or fetch from database if empty
  useEffect(() => {
    if (!Array.isArray(schemes) || schemes.length === 0) {
      fetch(`${API_BASE}/api/schemes`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setLocalSchemes(data);
          }
        })
        .catch(err => console.warn('Could not load schemes in AI assistant:', err));
    }
  }, [schemes]);

  // Quick suggestion prompt chips
  const promptSuggestions = [
    { label: '🌾 Farmer Schemes', query: 'Tell me about financial support, loans, and insurance for farmers' },
    { label: '🎓 Scholarships', query: 'What scholarships and credit cards are available for students?' },
    { label: '👩 Women Welfare', query: 'What welfare, marriage, and savings schemes are available for women?' },
    { label: '🏥 Health Insurance', query: 'How does Ayushman Bharat and cashless medical coverage work?' },
    { label: '💼 Business Loans', query: 'What zero-collateral loan schemes are available for startups and youth?' },
    { label: '📄 Required Documents', query: 'What standard documents are required to apply for government schemes?' }
  ];

  // Text-To-Speech Synthesis
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#•_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'bn' ? 'bn-IN' : currentLang === 'ta' ? 'ta-IN' : currentLang === 'te' ? 'te-IN' : 'en-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [currentLang]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Speech-To-Text Voice Input (Cross-Browser: Edge, Chrome, Safari, Firefox)
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported by your current browser settings. Please type your query in the input box!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langCode = currentLang === 'hi' ? 'hi-IN' : currentLang === 'bn' ? 'bn-IN' : currentLang === 'ta' ? 'ta-IN' : currentLang === 'te' ? 'te-IN' : 'en-IN';
      recognition.lang = langCode;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const speechToText = event.results[0][0].transcript;
          setInput(speechToText);
          setIsListening(false);
          handleSend(speechToText);
        }
      };
      recognition.onerror = (e) => {
        console.warn('Speech recognition status:', e.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.warn('Voice input initialization error:', err);
      setIsListening(false);
    }
  };

  // CORE INTELLIGENT SAATHI AI DATABASE SEARCH & REASONING ENGINE
  const querySchemeDatabase = useCallback((query) => {
    const rawQ = query ? query.toLowerCase().trim() : '';
    const activeList = Array.isArray(localSchemes) && localSchemes.length > 0 ? localSchemes : (Array.isArray(schemes) ? schemes : []);

    // 1. General Greetings & Help
    if (
      rawQ === 'hi' || rawQ === 'hello' || rawQ === 'namaste' || rawQ === 'hey' || 
      rawQ.includes('who are you') || rawQ.includes('kya kar sakte ho') || rawQ.includes('help')
    ) {
      if (currentLang === 'hi') {
        return `नमस्ते! 🙏 मैं हूँ **साथी AI (Saathi AI)**। मैं आपके पोर्टल के डाटाबेस से जुड़ी सभी योजनाओं की जानकारी दे सकता हूँ।\n\nआप मुझसे पूछ सकते हैं:\n• *"किसानों के लिए कौन सी योजनाएं हैं?"*\n• *"छात्रों के लिए स्कॉलरशिप"*` +
          `\n• *"महिलाओं के लिए कल्याणकारी योजनाएं"*` +
          `\n• *"आयुष्मान भारत और स्वास्थ्य बीमा"*`;
      }
      if (currentLang === 'bn') {
        return `নমস্কার! 🙏 আমি **সাথী এআই**। আমি আপনার ডাটাবেসে থাকা সমস্ত সরকারি স্কিম খুঁজে দিতে পারি।\n\nআপনি জিজ্ঞাসা করতে পারেন:\n• *"কৃষকদের জন্য প্রকল্প"*` +
          `\n• *"ছাত্রদের স্কলারশিপ ও স্টুডেন্ট ক্রেডিট কার্ড"*` +
          `\n• *"কন্যাশ্রী বা স্বাস্থ্য সাথী প্রকল্পের সুবিধা কী?"*`;
      }
      return `Namaste! 🙏 I am **Saathi AI** — your intelligent guide to Indian government welfare schemes.\n\nI can analyze your profile, search the live MongoDB database, calculate financial benefits, and check document requirements.\n\n**Try asking:**\n• *"Tell me about financial support, loans, and insurance for farmers"*\n• *"What scholarships are available for college students?"*\n• *"Women welfare and girl child empowerment schemes"*\n• *"How does cashless health insurance up to ₹5 Lakh work?"*`;
    }

    // 2. Documents Checklist
    if (rawQ.includes('document') || rawQ.includes('kagaz') || rawQ.includes('certificate') || rawQ.includes('nathi') || rawQ.includes('checklist')) {
      if (currentLang === 'hi') {
        return `📄 **सरकारी योजनाओं के लिए अनिवार्य दस्तावेज़ चेकलिस्ट:**\n\n` +
          `1. **आधार कार्ड** (मोबाइल नंबर व बैंक से लिंक)\n` +
          `2. **आय प्रमाण पत्र (Income Certificate)** — तहसीलदार / सक्षम अधिकारी द्वारा जारी\n` +
          `3. **मूल निवास प्रमाण (Domicile / Residential Proof)** — राशन कार्ड / बिजली बिल\n` +
          `4. **बैंक पासबुक** — डायरेक्ट बेनिफिट ट्रांसफर (DBT) सक्रिय\n` +
          `5. **जाति प्रमाण पत्र (Caste Certificate)** — SC / ST / OBC / EWS (यदि लागू हो)\n` +
          `6. **शैक्षणिक प्रमाण पत्र** — मार्कशीट (स्कॉलरशिप व ऋण योजनाओं हेतु)`;
      }
      return `📄 **Standard Document Checklist for Government Schemes:**\n\n` +
        `1. **Identity Proof:** Aadhaar Card (Linked with Mobile & Bank Account)\n` +
        `2. **Income Certificate:** Issued by competent Revenue / Tehsildar authority\n` +
        `3. **Residence / Domicile Proof:** Ration Card / Domicile Certificate / Utility Bill\n` +
        `4. **Bank Details:** Bank Passbook with Active Direct Benefit Transfer (DBT)\n` +
        `5. **Category Certificate:** SC / ST / OBC / EWS certificate (where applicable)\n` +
        `6. **Educational Records:** Marksheets & Admission Receipts (for scholarships/loans)`;
    }

    // 3. How to Apply
    if (rawQ.includes('how to apply') || rawQ.includes('apply kaise kare') || rawQ.includes('abedon') || rawQ.includes('process') || rawQ.includes('procedure')) {
      return `📝 **How to Apply for Schemes (Step-by-Step):**\n\n` +
        `1. **Check Eligibility:** Confirm your age, income, category, and state criteria.\n` +
        `2. **Prepare Documents:** Keep Aadhaar, Income Certificate, Bank Details & Residence proof ready.\n` +
        `3. **Visit Portal:**\n` +
        `   • Central Schemes: Official portals like National Scholarship Portal (NSP), PM-Kisan, or PM-JAY.\n` +
        `   • State Schemes: Respective State Portal (e.g. Duare Sarkar for WB, Seva Sindhu for Karnataka).\n` +
        `4. **Submit Application:** Fill required form fields, upload documents, and save your Application Reference Number.\n` +
        `5. **DBT Fund Credit:** Approved funds and subsidies are transferred directly to your Aadhaar-linked bank account!`;
    }

    // 4. Tokenized Multi-Keyword Matching across live MongoDB schemes
    const tokens = rawQ
      .replace(/[^\w\s]/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);

    const scoredSchemes = activeList.map(s => {
      let score = 0;
      const title = (s.title || '').toLowerCase();
      const desc = (s.description || '').toLowerCase();
      const cat = (s.category || '').toLowerCase();
      const st = (s.state || '').toLowerCase();

      // Category semantic boosts
      if (rawQ.includes('farmer') || rawQ.includes('kisan') || rawQ.includes('agriculture') || rawQ.includes('crop') || rawQ.includes('krishi')) {
        if (cat.includes('agriculture')) score += 15;
        if (title.includes('kisan') || title.includes('krishak') || title.includes('fasal') || title.includes('rythu') || title.includes('matsya')) score += 12;
      }

      if (rawQ.includes('student') || rawQ.includes('scholarship') || rawQ.includes('education') || rawQ.includes('college') || rawQ.includes('school')) {
        if (cat.includes('education') || cat.includes('student')) score += 15;
        if (title.includes('scholarship') || title.includes('credit card') || title.includes('pragati') || title.includes('vidya')) score += 12;
      }

      if (rawQ.includes('women') || rawQ.includes('woman') || rawQ.includes('girl') || rawQ.includes('mahila') || rawQ.includes('nari') || rawQ.includes('mother')) {
        if (cat.includes('women')) score += 15;
        if (title.includes('kanya') || title.includes('rupashree') || title.includes('sukanya') || title.includes('matru') || title.includes('ujjwala') || title.includes('beti')) score += 12;
      }

      if (rawQ.includes('health') || rawQ.includes('hospital') || rawQ.includes('medical') || rawQ.includes('insurance') || rawQ.includes('bima') || rawQ.includes('ayushman') || rawQ.includes('swasthya')) {
        if (cat.includes('health')) score += 15;
        if (title.includes('ayushman') || title.includes('swasthya') || title.includes('aarogyasri') || title.includes('bima') || title.includes('indradhanush')) score += 12;
      }

      if (rawQ.includes('pension') || rawQ.includes('senior') || rawQ.includes('elderly') || rawQ.includes('old age') || rawQ.includes('vridha')) {
        if (cat.includes('senior')) score += 15;
        if (title.includes('pension') || title.includes('atal') || title.includes('nsap') || title.includes('bandhu') || title.includes('joy bangla')) score += 12;
      }

      if (rawQ.includes('loan') || rawQ.includes('business') || rawQ.includes('startup') || rawQ.includes('employment') || rawQ.includes('job') || rawQ.includes('youth') || rawQ.includes('rozgar')) {
        if (cat.includes('employment') || cat.includes('business')) score += 15;
        if (title.includes('pmegp') || title.includes('svanidhi') || title.includes('startup') || title.includes('stand-up') || title.includes('kaushal') || title.includes('mudra')) score += 12;
      }

      if (rawQ.includes('housing') || rawQ.includes('house') || rawQ.includes('awas') || rawQ.includes('ghar') || rawQ.includes('home')) {
        if (cat.includes('housing')) score += 15;
        if (title.includes('awas') || title.includes('pmay')) score += 12;
      }

      // State boost if state mentioned
      if (st && rawQ.includes(st)) {
        score += 10;
      }

      // Token matches
      tokens.forEach(tok => {
        if (title.includes(tok)) score += 6;
        if (cat.includes(tok)) score += 4;
        if (desc.includes(tok)) score += 2;
      });

      return { scheme: s, score };
    });

    // Filter and sort by score
    const matched = scoredSchemes
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.scheme);

    if (matched.length > 0) {
      const top = matched.slice(0, 4);
      const header = currentLang === 'hi'
        ? `✨ मुझे आपके लिए **${matched.length} उपयुक्त सरकारी योजनाएं** मिली हैं:\n\n`
        : currentLang === 'bn'
        ? `✨ আপনার জন্য **${matched.length} টি সরকারি প্রকল্প** পাওয়া গেছে:\n\n`
        : `✨ I found **${matched.length} relevant government schemes** in your database matching your query:\n\n`;

      const listContent = top.map((s, idx) => 
        `**${idx + 1}. ${s.title}** (${s.category} • ${s.state || 'All India'})\n` +
        `💰 **Financial Benefit:** ${s.amount || 'Financial Assistance'}\n` +
        `👥 **Beneficiaries:** ${s.users || 'Eligible citizens'}\n` +
        `📋 **Overview:** ${s.description}\n`
      ).join('\n');

      const footer = matched.length > 4 
        ? `\n\n💡 *...and ${matched.length - 4} more matching schemes in your database! You can search them in the Schemes tab or use the Eligibility Checker.*`
        : `\n\n💡 *Tip: Check document requirements and apply directly through the portal.*`;

      return header + listContent + footer;
    }

    // Fallback if no matching schemes
    if (currentLang === 'hi') {
      return `नमस्ते! 🙏 मुझे "${query}" के लिए कोई सटीक योजना नहीं मिली।\n\nआप निम्न प्रमुख श्रेणियों के बारे में पूछ सकते हैं:\n• 🌾 **कृषि व किसान:** पीएम-किसान, फसल बीमा, केसीसी\n• 🎓 **शिक्षा व छात्र:** नेशनल स्कॉलरशिप, स्टूडेंट क्रेडिट कार्ड\n• 👩 **महिला कल्याण:** सुकन्या समृद्धि, उज्ज्वला, मातृ वंदना\n• 🏥 **स्वास्थ्य:** आयुष्मान भारत (₹5 लाख बीमा), स्वास्थ्य साथी\n• 💼 **रोजगार व ऋण:** पीएम स्वनिधि, मुद्रा लोन, स्टार्टअप इंडिया`;
    }

    return `Namaste! 🙏 I searched the database for "${query}".\n\nTo find the most suitable benefits, try asking about:\n• 🌾 *"Financial support, loans, and insurance for farmers"*\n• 🎓 *"Scholarships and education loans for students"*\n• 👩 *"Welfare and savings schemes for women & girl child"*\n• 🏥 *"Cashless health insurance up to ₹5 Lakh"*\n• 💼 *"Zero-collateral loans for youth & startups"*\n\nOr click on one of the quick suggestions above!`;
  }, [localSchemes, schemes, currentLang]);

  // Main Handle Send Message
  const handleSend = useCallback(async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (typeof textToSend !== 'string') setInput('');
    setIsTyping(true);

    // Provide immediate intelligent response from live schemes database
    setTimeout(async () => {
      let finalReply = '';

      // Check if query is best answered by our live scheme intelligence engine
      const dbResult = querySchemeDatabase(query);
      
      // If we found specific schemes in database or standard guide
      if (dbResult && !dbResult.includes('couldn\'t find a direct match') && !dbResult.includes('कोई सटीक योजना नहीं मिली')) {
        finalReply = dbResult;
      } else {
        // Otherwise attempt server endpoint
        try {
          const res = await fetch(`${API_BASE}/api/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: query, language: currentLang })
          });
          const text = await res.text();
          let data;
          try { data = JSON.parse(text); } catch { data = null; }
          if (res.ok && data && data.reply && !data.reply.includes('couldn\'t find a direct match')) {
            finalReply = data.reply;
          } else {
            finalReply = dbResult;
          }
        } catch {
          finalReply = dbResult;
        }
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'ai', text: finalReply }]);
      speakText(finalReply);
    }, 450);
  }, [input, querySchemeDatabase, currentLang, speakText]);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Listen for custom trigger events
  useEffect(() => {
    const handleOpenChatEvent = (e) => {
      setIsOpen(true);
      if (e.detail && e.detail.query) {
        handleSend(e.detail.query);
      }
    };

    window.addEventListener('open-ai-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-ai-chat', handleOpenChatEvent);
  }, [handleSend]);

  // Copy message to clipboard
  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Clear conversation
  const handleClearChat = () => {
    stopSpeaking();
    setMessages([
      {
        sender: 'ai',
        text: t('initialAiGreeting') || "Namaste! 🙏 I'm Saathi AI. Ask me about any government scheme, eligibility, benefits, or documents."
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className={`w-[360px] sm:w-[420px] h-[580px] rounded-3xl border shadow-2xl flex flex-col justify-between mb-4 overflow-hidden backdrop-blur-2xl transition-all animate-fadeIn ${
          darkMode ? 'bg-[#0f141e]/95 border-gray-800 text-white shadow-orange-500/5' : 'bg-white/95 border-gray-200 text-gray-900 shadow-xl'
        }`}>
          
          {/* Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            darkMode ? 'bg-[#151c2b] border-gray-800' : 'bg-orange-50/80 border-orange-100'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-500/20">
                  🤖
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#151c2b] rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm tracking-tight">{t('saathiAi')}</h4>
                  <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 font-bold rounded-md uppercase">
                    AI 2.0
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium">
                  {isSpeaking ? '🔊 Speaking...' : isTyping ? '⚡ Researching schemes...' : `● ${localSchemes.length} Schemes Connected`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Mute / Unmute Button */}
              <button 
                type="button"
                onClick={isSpeaking ? stopSpeaking : () => speakText(messages[messages.length - 1]?.text || '')} 
                className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs transition cursor-pointer ${
                  isSpeaking ? 'bg-orange-500 text-white border-orange-400 animate-pulse' : (darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white' : 'bg-white border-gray-300 text-gray-700')
                }`}
                title={isSpeaking ? "Stop Speaking" : "Listen to Last Response"}
              >
                {isSpeaking ? '🔇' : '🔊'}
              </button>

              {/* Clear Chat Button */}
              <button
                type="button"
                onClick={handleClearChat}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs transition cursor-pointer ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white hover:bg-red-500/20' : 'bg-white border-gray-300 text-gray-700 hover:bg-red-50'
                }`}
                title="Clear Conversation"
              >
                🗑️
              </button>

              {/* Close Window */}
              <button 
                type="button"
                onClick={() => { stopSpeaking(); setIsOpen(false); }} 
                className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs transition cursor-pointer ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white' : 'bg-white border-gray-300 text-gray-700'
                }`}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips Bar */}
          <div className={`px-3 py-2 border-b overflow-x-auto scrollbar-none flex items-center space-x-1.5 ${
            darkMode ? 'bg-gray-900/60 border-gray-800/80' : 'bg-gray-50 border-gray-200'
          }`}>
            {promptSuggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(item.query)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-800/80 border-gray-700 text-gray-300 hover:text-orange-400 hover:border-orange-500/50' 
                    : 'bg-white border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-300 shadow-sm'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm relative group ${
                  m.sender === 'user' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-none font-medium' 
                    : (darkMode ? 'bg-[#171f2e] border border-gray-800 text-gray-100 rounded-bl-none' : 'bg-gray-100 border border-gray-200 text-gray-900 rounded-bl-none')
                }`}>
                  {m.text}

                  {/* Copy Button for AI Messages */}
                  {m.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => handleCopy(m.text, idx)}
                      className="absolute -bottom-2 right-2 text-[9px] px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded border border-gray-700 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? '✓ Copied' : '📋 Copy'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator Animation */}
            {isTyping && (
              <div className="flex items-center space-x-2 p-3 bg-gray-900/80 border border-gray-800 rounded-2xl rounded-bl-none w-fit text-gray-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-300"></span>
                <span className="ml-1 text-[11px] font-medium text-gray-400">Saathi AI is researching schemes...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className={`p-3 border-t flex items-center space-x-2 ${
            darkMode ? 'bg-[#151c2b] border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <input 
              ref={chatInputRef}
              type="text" 
              placeholder={isListening ? '🎙️ Listening to your voice...' : t('askSchemePlaceholder') || "Ask anything about government schemes..."} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className={`flex-1 border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 transition ${
                darkMode ? 'bg-gray-950 border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />

            {/* Voice Input Button */}
            <button 
              type="button"
              onClick={handleVoiceInput}
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition cursor-pointer ${
                isListening 
                  ? 'bg-red-500 border-red-400 text-white animate-ping' 
                  : (darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white hover:border-orange-500/50' : 'bg-white border-gray-300 text-gray-700 hover:border-orange-400')
              }`}
              title="Voice Search"
            >
              🎤
            </button>

            {/* Send Button */}
            <button 
              type="button"
              onClick={() => handleSend()} 
              disabled={!input.trim()}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white flex items-center justify-center transition shadow-md shadow-orange-500/20 cursor-pointer font-bold"
              title="Send Message"
            >
              ➤
            </button>
          </div>

        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-500 p-0.5 shadow-2xl shadow-orange-500/30 transform hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0f141e] flex items-center justify-center group-hover:bg-opacity-0 transition">
              <span className="text-2xl animate-pulse">🤖</span>
            </div>
          </div>

          {/* Pulsing notification badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 text-[9px] font-bold text-white items-center justify-center">
              AI
            </span>
          </span>
        </button>
      )}
    </div>
  );
}