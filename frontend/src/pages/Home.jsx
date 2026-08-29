import { useLanguage } from '../context/LanguageContext';

export default function Home({ setActiveTab, onSelectCategory, darkMode }) {
  const { t } = useLanguage();

  const categories = [
    { 
      key: 'All', 
      name: t('All') || 'All', 
      rawName: 'All', 
      icon: '/pictures/all-application-svgrepo-com.svg',
      bgGlow: 'from-blue-500/20 to-indigo-500/10'
    },
    { 
      key: 'Agriculture', 
      name: t('Agriculture') || 'Agriculture', 
      rawName: 'Agriculture', 
      icon: '/pictures/agriculture-paddy-svgrepo-com.svg',
      bgGlow: 'from-emerald-500/20 to-green-500/10'
    },
    { 
      key: 'Education', 
      name: t('Education') || 'Education', 
      rawName: 'Education', 
      icon: '/pictures/education-cap-svgrepo-com.svg',
      bgGlow: 'from-amber-500/20 to-orange-500/10'
    },
    { 
      key: 'Health', 
      name: t('Health') || 'Health', 
      rawName: 'Health', 
      icon: '/pictures/health-svgrepo-com.svg',
      bgGlow: 'from-red-500/20 to-rose-500/10'
    },
    { 
      key: 'Women', 
      name: t('Women') || 'Women', 
      rawName: 'Women', 
      icon: '/pictures/women-who-have-dietary-restrictions-diet-svgrepo-com.svg',
      bgGlow: 'from-pink-500/20 to-fuchsia-500/10'
    },
    { 
      key: 'Housing', 
      name: t('Housing') || 'Housing', 
      rawName: 'Housing', 
      icon: '/pictures/home-svgrepo-com.svg',
      bgGlow: 'from-sky-500/20 to-cyan-500/10'
    },
    { 
      key: 'Employment', 
      name: t('Employment') || 'Employment', 
      rawName: 'Employment', 
      icon: '/pictures/employment-promotion-svgrepo-com.svg',
      bgGlow: 'from-purple-500/20 to-violet-500/10'
    },
    { 
      key: 'Senior Citizens', 
      name: t('Senior Citizens') || 'Senior Citizens', 
      rawName: 'Senior Citizens', 
      icon: '/pictures/pensioner-svgrepo-com.svg',
      bgGlow: 'from-teal-500/20 to-emerald-500/10'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <span className="px-3.5 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-xs md:text-sm font-bold inline-flex items-center gap-2 mb-4 shadow-sm">
            <img 
              src="/pictures/empower-empowerment-self-help-svgrepo-com.svg" 
              alt="Empowering Citizens" 
              className="w-4 h-4 object-contain" 
            />
            <span>{t('empoweringCitizens')}</span>
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {t('heroTitlePrefix')} <span className="text-orange-500">{t('heroTitleSuffix')}</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              type="button"
              onClick={() => setActiveTab('schemes')}
              className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              {t('exploreSchemes')}
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('eligibility')}
              className={`px-8 py-3.5 border font-bold rounded-xl transition-all cursor-pointer ${
                darkMode ? 'border-gray-700 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'
              }`}
            >
              {t('checkEligibility')}
            </button>
          </div>
        </div>

        {/* Interactive Widget Card */}
        <div className={`p-6 rounded-3xl border shadow-2xl ${
          darkMode ? 'bg-[#121824] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-green-400 font-semibold text-sm">{t('eligibleIn30s')}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">{t('aiPowered')}</span>
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
            type="button"
            onClick={() => setActiveTab('eligibility')}
            className="w-full py-3.5 bg-white text-gray-950 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {t('checkMyEligibilityBtn')}
          </button>
        </div>
      </div>

      {/* Categories Section with Proper Sized SVGs */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t('browseCategories')}</h2>
            <p className="text-xs text-gray-400 mt-1">Explore all major sector initiatives and welfare portals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.key}
              onClick={() => {
                onSelectCategory(cat.rawName);
                setActiveTab('schemes');
              }}
              className={`p-4 rounded-2xl border text-center cursor-pointer transition-all duration-300 hover:scale-105 group flex flex-col items-center justify-between min-h-[140px] ${
                darkMode 
                  ? 'bg-[#121824] border-gray-800 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10' 
                  : 'bg-white border-gray-200 hover:border-orange-500 hover:shadow-md'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 bg-gradient-to-tr ${cat.bgGlow} group-hover:scale-110 transition-transform duration-300 mb-3 border ${darkMode ? 'border-gray-800/80' : 'border-gray-100'}`}>
                <img 
                  src={cat.icon} 
                  alt={cat.name} 
                  className="w-full h-full object-contain transition-transform" 
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-bold leading-snug line-clamp-2">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}