import React from 'react';

export default function Home({ schemes, favourites, onToggleFavourite, setActiveTab, selectedState, setSelectedState, onSelectCategory, darkMode }) {
  const categories = [
    { name: 'All', icon: '🌐' },
    { name: 'Agriculture', icon: '🌾' },
    { name: 'Education', icon: '🎓' },
    { name: 'Health', icon: '❤️' },
    { name: 'Women', icon: '👩' },
    { name: 'Housing', icon: '🏠' },
    { name: 'Employment', icon: '💼' },
    { name: 'Senior Citizens', icon: '🛡️' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold inline-block mb-4">
            🚀 Empowering Citizens
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Find Central & State Government Schemes in <span className="text-orange-500">Seconds</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            SchemeSaathi simplifies discovering government welfare benefits, scholarships, and financial assistance programs tailored specifically for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setActiveTab('schemes')}
              className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20"
            >
              Explore Schemes
            </button>
            <button 
              onClick={() => setActiveTab('eligibility')}
              className={`px-8 py-3.5 border font-bold rounded-xl transition-all ${
                darkMode ? 'border-gray-700 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'
              }`}
            >
              Check Eligibility
            </button>
          </div>
        </div>

        {/* Interactive Widget Card matching your image */}
        <div className={`p-6 rounded-3xl border shadow-2xl ${
          darkMode ? 'bg-[#121824] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-green-400 font-semibold text-sm">Eligible in 30 sec</span>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">AI Powered</span>
          </div>

          <div className="space-y-3 mb-6">
            <div className={`p-4 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#0b0f17] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <h4 className="font-bold text-sm">PM–Kisan Samman Nidhi</h4>
                <p className="text-xs text-gray-400">₹6,000/yr • 11Cr+</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</span>
            </div>

            <div className={`p-4 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#0b0f17] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <h4 className="font-bold text-sm">Ayushman Bharat – PMJAY</h4>
                <p className="text-xs text-gray-400">₹5 Lakh • 50Cr+</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</span>
            </div>

            <div className={`p-4 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#0b0f17] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <h4 className="font-bold text-sm">National Scholarship Portal</h4>
                <p className="text-xs text-gray-400">₹75k/yr • 2Cr+</p>
              </div>
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</span>
            </div>
          </div>

          {/* Working Button attached to setActiveTab */}
          <button 
            onClick={() => setActiveTab('eligibility')}
            className="w-full py-3.5 bg-white text-gray-950 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            Check My Eligibility →
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
                setActiveTab('schemes');
              }}
              className={`p-4 rounded-2xl border text-center cursor-pointer transition-all hover:scale-105 ${
                darkMode ? 'bg-[#121824] border-gray-800 hover:border-orange-500' : 'bg-white border-gray-200 hover:border-orange-500'
              }`}
            >
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <span className="text-sm font-semibold">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}