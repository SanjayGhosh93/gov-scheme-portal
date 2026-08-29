import { useLanguage } from '../context/LanguageContext';

export default function Footer({ setActiveTab, setSelectedCategory, darkMode }) {
  const { t } = useLanguage();
  
  const handleCategoryClick = (category) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
    setActiveTab('schemes');
  };

  const categories = ['Education', 'Health', 'Agriculture', 'Women', 'Senior Citizens'];

  return (
    <footer className={`border-t py-12 px-6 mt-20 transition-colors ${
      darkMode ? 'bg-[#080c14] border-gray-800/80 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
    }`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <img 
              src="/pictures/scheme_saathi_logo.png" 
              alt="SchemeSaathi Logo" 
              className="h-10 w-auto object-contain rounded-xl shadow-md transform group-hover:scale-105 transition-transform" 
            />
            <span className={`text-xl md:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Scheme<span className="text-orange-500">Saathi</span>
            </span>
          </div>
          <p className="text-xs max-w-sm leading-relaxed">
            {t('footerBrandDesc')}
          </p>
        </div>

        {/* Categories Linkable Section */}
        <div className="space-y-3">
          <h4 className={`font-bold text-sm tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('footerCategories')}</h4>
          <ul className="space-y-2 text-xs">
            {categories.map((cat) => (
              <li key={cat}>
                <button 
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className="hover:text-orange-400 transition text-left cursor-pointer"
                >
                  {t(cat) || cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links Linkable Section */}
        <div className="space-y-3">
          <h4 className={`font-bold text-sm tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('footerQuickLinks')}</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button type="button" onClick={() => setActiveTab('eligibility')} className="hover:text-orange-400 transition text-left cursor-pointer">
                {t('eligibility')}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab('schemes')} className="hover:text-orange-400 transition text-left cursor-pointer">
                {t('aiAssistant')}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab('favourites')} className="hover:text-orange-400 transition text-left cursor-pointer">
                {t('favourites')}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActiveTab('admin')} className="hover:text-orange-400 transition text-left cursor-pointer">
                {t('adminPanel')}
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800/40 text-center text-[11px] text-gray-500">
        © {new Date().getFullYear()} SchemeSaathi. {t('allRightsReserved')}
      </div>
    </footer>
  );
}