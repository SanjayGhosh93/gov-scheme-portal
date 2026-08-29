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

const rawCategories = ['All Categories', 'Education', 'Health', 'Agriculture', 'Women', 'Senior Citizens', 'Students', 'Employment', 'Housing'];

export default function EligibilityChecker({ schemes = [], favourites = [], onToggleFavourite, darkMode }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedState, setSelectedState] = useState('All India');
  const [income, setIncome] = useState('');
  const [results, setResults] = useState(null);

  const handleCheckEligibility = (e) => {
    e.preventDefault();
    
    // Strict state filtering without fallback to All India
    const matched = schemes.filter(scheme => {
      const schemeCat = scheme.category?.trim().toLowerCase() || '';
      const chosenCat = selectedCategory.trim().toLowerCase();
      
      const matchesCategory = chosenCat === 'all categories' || schemeCat === chosenCat;
      
      const schemeState = scheme.state?.trim().toLowerCase() || 'all india';
      const chosenState = selectedState.trim().toLowerCase();

      const matchesState = chosenState === 'all india'
        ? (schemeState === 'all india' || schemeState === 'central' || schemeState === '' || schemeState.includes('all'))
        : (schemeState === chosenState || schemeState.includes(chosenState));

      return matchesCategory && matchesState;
    });

    setResults(matched);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full">
      
      {/* Form Box */}
      <div className={`p-8 md:p-12 rounded-3xl border shadow-2xl mb-12 ${
        darkMode ? 'bg-[#121824]/90 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 flex items-center gap-3">
            <span>🔍</span> {t('searchTitle')}
          </h1>
          <p className="text-xs text-gray-400">{t('searchSubtitle')}</p>
        </div>

        <form onSubmit={handleCheckEligibility} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">{t('selectCategory')}</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:border-orange-500 cursor-pointer ${
                  darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              >
                {rawCategories.map(cat => (
                  <option key={cat} value={cat}>{t(cat) || cat}</option>
                ))}
              </select>
            </div>

            {/* State Select Dropdown with All Indian States */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">{t('selectState')}</label>
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className={`w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:border-orange-500 cursor-pointer ${
                  darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              >
                {indianStates.map(st => (
                  <option key={st} value={st}>{st === 'All India' ? `All India (${t('allSchemes') || 'Central Schemes'})` : st}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Income Input */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">{t('annualIncome')}</label>
            <input 
              type="number" 
              placeholder={t('incomePlaceholder')} 
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className={`w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
                darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-lg tracking-wide uppercase cursor-pointer"
          >
            {t('checkEligibleSchemes')}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {results !== null && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('matchingFound')} ({results.length})</h3>
            <span className="text-xs text-gray-400">{t('categoryLabel')}: {t(selectedCategory) || selectedCategory} • {t('stateLabel')}: {selectedState}</span>
          </div>

          {results.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${darkMode ? 'bg-[#121824] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
              <p className="text-gray-400 text-sm">{t('noEligibilityResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((scheme) => {
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
      )}

    </div>
  );
}