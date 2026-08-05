import React, { useState, useEffect } from 'react';

export default function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Namaste! 🙏 I'm Saathi AI. Ask me about any government scheme." }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Listen for custom trigger events from other components
  useEffect(() => {
    const handleOpenChatEvent = (e) => {
      setIsOpen(true);
      if (e.detail && e.detail.query) {
        handleSend(e.detail.query);
      }
    };

    window.addEventListener('open-ai-chat', handleOpenChatEvent);
    return () => window.removeEventListener('open-ai-chat', handleOpenChatEvent);
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
      setIsListening(false);
      handleSend(speechToText);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInput('');

    try {
      // Connects directly to your backend AI route
      const response = await fetch('https://gov-scheme-portal.onrender.com/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      const data = await response.json();
      const aiReply = data.reply || "I am connected to your backend server. How can I help you with government schemes?";

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      speakText(aiReply);
    } catch (err) {
      const fallbackReply = "Server error or AI backend route not configured yet. Please check your Express server connection.";
      setMessages(prev => [...prev, { sender: 'ai', text: fallbackReply }]);
      speakText(fallbackReply);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="glass-card w-[370px] md:w-[400px] h-[540px] rounded-3xl border border-gray-800 shadow-2xl flex flex-col justify-between mb-4 overflow-hidden bg-[#111318]/95 backdrop-blur-xl animate-fade-in-up">
          
          {/* Header */}
          <div className="p-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">🤖</div>
              <div>
                <h4 className="font-bold text-white text-sm">Saathi AI</h4>
                <p className="text-[10px] text-emerald-400 font-medium">
                  {isSpeaking ? '🔊 Speaking...' : '● Backend Connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }} 
                className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:text-white flex items-center justify-center text-xs" 
                title="Mute Speech"
              >
                🔊
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-white text-gray-950 rounded-br-none font-medium shadow-md' 
                    : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center space-x-2">
            <input 
              type="text" 
              placeholder={isListening ? "Listening..." : "Ask about any scheme..."} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gray-700"
            />
            <button 
              onClick={handleVoiceInput}
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition ${isListening ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'}`}
              title="Voice Input"
            >
              🎤
            </button>
            <button 
              onClick={() => handleSend()} 
              className="w-10 h-10 rounded-2xl bg-white text-gray-950 flex items-center justify-center hover:bg-gray-100 transition shadow-lg"
            >
              ➤
            </button>
          </div>

        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 via-amber-600 to-emerald-500 p-0.5 shadow-2xl transform hover:scale-110 transition flex items-center justify-center group"
        >
          <div className="w-full h-full rounded-full bg-[#111318] flex items-center justify-center group-hover:bg-opacity-0 transition">
            <span className="text-xl">🤖</span>
          </div>
        </button>
      )}
    </div>
  );
}