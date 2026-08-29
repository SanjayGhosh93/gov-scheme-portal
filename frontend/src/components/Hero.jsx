
export function Hero() {
  return (
    <div className="relative mx-6 my-8 p-10 lg:p-14 rounded-3xl bg-gradient-to-br from-[#1a1c23] via-[#111318] to-[#0d1b12] border border-gray-800 overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between animate-fade-in-up">
      
      {/* Background Glow Effect */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl z-10">
        <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full text-emerald-400 text-xs font-medium mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>1500+ Live Schemes • Trusted by Govt of India</span>
        </div>
        
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Find Government Schemes <span className="text-orange-500">Made</span> <span className="text-emerald-400">For YOU</span>
        </h1>
        
        <p className="text-gray-400 text-base mb-8 leading-relaxed">
          Discover, check eligibility and apply for central & state government schemes in 60 seconds. Your personal AI guide to ₹2 Lakh Crores worth benefits.
        </p>

        <div className="flex items-center bg-gray-900/90 border border-gray-700/80 p-2 rounded-2xl max-w-lg shadow-inner focus-within:border-orange-500/80 transition-all">
          <input 
            type="text" 
            placeholder="Search Government Schemes" 
            className="bg-transparent border-none outline-none text-white px-4 w-full text-sm placeholder-gray-500"
          />
          <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg hover:opacity-90 transition transform hover:scale-[1.02]">
            <span>Search</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12 border-t border-gray-800/80 pt-6">
          <div className="transform transition hover:-translate-y-1 duration-300">
            <h3 className="text-2xl font-bold text-white">1500+</h3>
            <p className="text-xs text-gray-400 tracking-wider">SCHEMES</p>
          </div>
          <div className="transform transition hover:-translate-y-1 duration-300">
            <h3 className="text-2xl font-bold text-white">45M+</h3>
            <p className="text-xs text-gray-400 tracking-wider">BENEFICIARIES</p>
          </div>
          <div className="transform transition hover:-translate-y-1 duration-300">
            <h3 className="text-2xl font-bold text-white">28</h3>
            <p className="text-xs text-gray-400 tracking-wider">STATES COVERED</p>
          </div>
        </div>
      </div>

      {/* Right AI Card Preview with Floating Effect */}
      <div className="mt-10 lg:mt-0 w-full lg:w-[420px] glass-card p-6 rounded-3xl border border-gray-800 relative shadow-2xl animate-fade-in-up animate-delay-100 transform hover:scale-[1.01] transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Eligible in 30 sec</span>
          </div>
          <span className="bg-gray-800 text-gray-300 text-[10px] px-2.5 py-1 rounded-full border border-gray-700">AI Powered</span>
        </div>

        <div className="space-y-3">
          {[
            { title: 'PM–Kisan Samman Nidhi', sub: '₹6,000/yr • 11Cr+' },
            { title: 'Ayushman Bharat – PMJAY', sub: '₹5 Lakh • 50Cr+' },
            { title: 'National Scholarship Portal', sub: '₹75k/yr • 2Cr+' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-900/80 border border-gray-800/80 p-3.5 rounded-xl flex items-center justify-between hover:border-gray-700 transition">
              <div>
                <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 bg-white text-gray-950 py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-gray-100 transition shadow-lg transform hover:scale-[1.02]">
          <span>Check My Eligibility</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
}