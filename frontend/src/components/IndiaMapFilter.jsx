
const states = [
  'J&K', 'Himachal', 'Punjab', 'Uttarakhand',
  'Haryana', 'Delhi', 'UP', 'Bihar',
  'Rajasthan', 'MP', 'Chhattisgarh', 'Jharkhand',
  'Gujarat', 'Maharashtra', 'Odisha', 'West Bengal',
  'Goa', 'Karnataka', 'Telangana', 'AP',
  'Kerala', 'Tamil Nadu'
];

export default function IndiaMapFilter({ selectedState, setSelectedState }) {
  const triggerAIChat = (queryText) => {
    const event = new CustomEvent('open-ai-chat', { detail: { query: queryText } });
    window.dispatchEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 my-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Interactive State Grid */}
      <div className="glass-card p-8 rounded-3xl border border-gray-800 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">📍</span>
            <h3 className="text-xl font-bold text-white">Interactive India Map</h3>
          </div>
          <span className="text-xs bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full text-gray-300">Click a state → Filter</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition ${
                selectedState === st 
                  ? 'bg-orange-500 border-orange-600 text-white shadow-lg' 
                  : 'bg-gray-900/80 border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
          {['All India', 'Maharashtra', 'West Bengal', 'Tamil Nadu', 'Karnataka', 'Gujarat'].map(st => (
            <button 
              key={st}
              onClick={() => setSelectedState(st)}
              className={`text-xs px-3 py-1 rounded-full border ${selectedState === st ? 'bg-white text-gray-950 font-bold border-white' : 'bg-gray-900 text-gray-400 border-gray-800'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ask Saathi AI Box - Now Fully Connected */}
      <div className="glass-card p-8 rounded-3xl border border-gray-800 shadow-xl flex flex-col justify-between bg-gradient-to-br from-[#1a1c23] via-[#111318] to-[#0d1b12]">
        <div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg mb-4 border border-emerald-500/30">🤖</div>
          <h3 className="text-xl font-bold text-white mb-2">Ask Saathi AI anything</h3>
          <p className="text-xs text-gray-400 mb-6">Your 24/7 guide. Ask in English, Hindi, Bengali, Tamil. Voice input + text-to-speech supported.</p>
          
          <div className="space-y-2.5 mb-6">
            {[
              'What is PM-Kisan?',
              'I am a student. Which schemes help me?',
              'Explain in Hindi',
              'Compare PM-Kisan and PM Fasal Bima'
            ].map((q, idx) => (
              <div 
                key={idx} 
                onClick={() => triggerAIChat(q)}
                className="bg-gray-900/80 border border-gray-800 p-3 rounded-xl text-xs text-gray-300 hover:text-white hover:border-gray-700 cursor-pointer transition flex items-center space-x-2 shadow-sm"
              >
                <span>💬</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => triggerAIChat("Hello! Tell me about available government schemes.")}
          className="w-full bg-white text-gray-950 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 hover:bg-gray-100 transition shadow-lg transform hover:scale-[1.01]"
        >
          <span>💬</span>
          <span>Open AI Assistant</span>
        </button>
      </div>
    </div>
  );
}