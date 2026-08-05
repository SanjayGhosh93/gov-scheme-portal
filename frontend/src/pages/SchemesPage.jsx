import React, { useState } from 'react';
import SchemeCard from '../components/SchemeCard';

const indianStates = [
  "All India",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export default function SchemesPage({ schemes, favourites, onToggleFavourite, selectedCategory, setSelectedCategory, selectedState, setSelectedState, darkMode }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Strict state filtering
  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = selectedCategory === 'All' || 
      scheme.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    
    const schemeState = scheme.state?.trim().toLowerCase() || 'all india';
    const currentSelectedState = selectedState.trim().toLowerCase();

    let matchesState = false;
    if (currentSelectedState === 'all india') {
      matchesState = true;
    } else {
      // Strict state match only
      matchesState = schemeState === currentSelectedState || schemeState.includes(currentSelectedState);
    }

    const matchesSearch = !searchQuery.trim() || 
      scheme.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      scheme.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesState && matchesSearch;
  });

  const categories = ['All', 'Education', 'Health', 'Agriculture', 'Women', 'Senior Citizens', 'Students', 'Employment'];

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedState('All India');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* LEFT SIDEBAR: FILTERS */}
      <div className={`p-6 rounded-3xl border h-fit space-y-6 shadow-xl ${
        darkMode ? 'bg-[#121824]/90 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base flex items-center gap-2">
            <span>🔍</span> Filters
          </h3>
          <button 
            onClick={clearFilters}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition"
          >
            Clear filters
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Search</label>
          <input 
            type="text" 
            placeholder="Scheme name, keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Category</label>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center space-x-3 text-xs cursor-pointer hover:text-orange-400 transition">
                <input 
                  type="radio" 
                  name="category"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                  className="accent-orange-500 w-4 h-4"
                />
                <span className={selectedCategory === cat ? 'font-bold text-orange-400' : 'text-gray-300'}>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">State</label>
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            {indianStates.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-gray-900/60 border-gray-800/80' : 'bg-gray-50 border-gray-200'}`}>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-3">Quick Stats</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xl font-extrabold block ${darkMode ? 'text-white' : 'text-gray-900">{filteredSchemes.length}</span>
              <span className="text-[10px] text-gray-400 uppercase">Results</span>
            </div>
            <div>
              <span className="text-xl font-extrabold block text-orange-400">{favourites.length}</span>
              <span className="text-[10px] text-gray-400 uppercase">Saved</span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="lg:col-span-3 space-y-6">
        
        <div className="flex justify-between items-center pb-2 border-b border-gray-800/60">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-extrabold text-white">
              {selectedState === 'All India' ? 'All Schemes' : `${selectedState} Schemes`}
            </h2>
            <span className="text-sm font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
              ({filteredSchemes.length})
            </span>
          </div>
          <span className="text-xs text-gray-400">Live MongoDB Sync</span>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className={`p-16 text-center rounded-3xl border shadow-xl ${
            darkMode ? 'bg-[#121824] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center text-2xl mx-auto mb-4 ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
            }`}>🔍</div>
            <h3 className="text-lg font-bold mb-2">No schemes found for {selectedState}</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              No matching schemes are currently saved in your database exclusively for this state.
            </p>
            <button 
              onClick={clearFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold text-xs transition shadow-lg"
            >
              Reset All Filters →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => {
              const isFav = favourites.some(f => (f._id || f) === (scheme._id || scheme.id));
              return (
                <SchemeCard 
                  key={scheme._id || scheme.id} 
                  scheme={scheme} 
                  isFav={isFav} 
                  onToggleFavourite={onToggleFavourite} 
                  darkMode={darkMode} 
                />
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}