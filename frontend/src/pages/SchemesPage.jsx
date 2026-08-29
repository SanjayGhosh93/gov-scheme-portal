import { useState } from 'react';
import SchemeCard from '../components/SchemeCard';
import { useLanguage } from '../context/LanguageContext';

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

const categoryIcons = {
  'All': '/pictures/all-application-svgrepo-com.svg',
  'Agriculture': '/pictures/agriculture-paddy-svgrepo-com.svg',
  'Education': '/pictures/education-cap-svgrepo-com.svg',
  'Students': '/pictures/education-cap-svgrepo-com.svg',
  'Health': '/pictures/health-svgrepo-com.svg',
  'Women': '/pictures/women-who-have-dietary-restrictions-diet-svgrepo-com.svg',
  'Housing': '/pictures/home-svgrepo-com.svg',
  'Employment': '/pictures/employment-promotion-svgrepo-com.svg',
  'Senior Citizens': '/pictures/pensioner-svgrepo-com.svg'
};

export default function SchemesPage({ schemes, favourites, onToggleFavourite, selectedCategory, setSelectedCategory, selectedState, setSelectedState, darkMode }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Strict state filtering
  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = selectedCategory === 'All' || 
      scheme.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    
    const schemeState = scheme.state?.trim().toLowerCase() || 'all india';
    const currentSelectedState = selectedState.trim().toLowerCase();

    const matchesState = currentSelectedState === 'all india'
      ? true
      : (schemeState === currentSelectedState || schemeState.includes(currentSelectedState));

    const matchesSearch = !searchQuery.trim() || 
      scheme.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      scheme.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesState && matchesSearch;
  });

  const rawCategories = ['All', 'Education', 'Health', 'Agriculture', 'Women', 'Senior Citizens', 'Students', 'Employment', 'Housing'];

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
            <span>🔍</span> {t('filters')}
          </h3>
          <button 
            type="button"
            onClick={clearFilters}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition cursor-pointer"
          >
            {t('clearFilters')}
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">{t('search')}</label>
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
              darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">{t('category')}</label>
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
            {rawCategories.map((cat) => (
              <label 
                key={cat} 
                className={`flex items-center space-x-3 p-2 rounded-xl text-xs cursor-pointer transition ${
                  selectedCategory === cat 
                    ? 'bg-orange-500/10 text-orange-400 font-bold border border-orange-500/30' 
                    : (darkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100')
                }`}
              >
                <input 
                  type="radio" 
                  name="category"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                  className="accent-orange-500 w-3.5 h-3.5 cursor-pointer"
                />
                {categoryIcons[cat] && (
                  <img src={categoryIcons[cat]} alt="" className="w-4 h-4 object-contain opacity-90" />
                )}
                <span>
                  {t(cat) || cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">{t('state')}</label>
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-orange-500 cursor-pointer ${
              darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          >
            {indianStates.map(st => (
              <option key={st} value={st}>{st === 'All India' ? (t('allIndia') || st) : st}</option>
            ))}
          </select>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-gray-900/60 border-gray-800/80' : 'bg-gray-50 border-gray-200'}`}>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-3">{t('quickStats')}</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={`text-xl font-extrabold block ${darkMode ? 'text-white' : 'text-gray-900'}`}>{filteredSchemes.length}</span>
              <span className="text-[10px] text-gray-400 uppercase">{t('results')}</span>
            </div>
            <div>
              <span className="text-xl font-extrabold block text-orange-400">{favourites.length}</span>
              <span className="text-[10px] text-gray-400 uppercase">{t('saved')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="lg:col-span-3 space-y-6">
        
        <div className="flex justify-between items-center pb-2 border-b border-gray-800/60">
          <div className="flex items-center space-x-3">
            <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedState === 'All India' ? (t('allSchemes') || 'All Schemes') : `${selectedState} ${t('schemesSuffix') || 'Schemes'}`}
            </h2>
            <span className="text-sm font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
              ({filteredSchemes.length})
            </span>
          </div>
          <span className="text-xs text-gray-400">{t('liveMongoSync')}</span>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className={`p-16 text-center rounded-3xl border shadow-xl ${
            darkMode ? 'bg-[#121824] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center text-2xl mx-auto mb-4 ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
            }`}>🔍</div>
            <h3 className="text-lg font-bold mb-2">{t('noSchemesTitle')} {selectedState}</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              {t('noSchemesDesc')}
            </p>
            <button 
              type="button"
              onClick={clearFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold text-xs transition shadow-lg cursor-pointer"
            >
              {t('resetFilters')}
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