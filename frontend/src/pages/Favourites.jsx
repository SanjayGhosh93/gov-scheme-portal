import SchemeCard from '../components/SchemeCard';
import { useLanguage } from '../context/LanguageContext';

export default function Favourites({ favourites, schemes = [], onToggleFavourite, setActiveTab, darkMode }) {
  const { t } = useLanguage();

  // Safely map favourites whether they are stored as full objects or IDs/strings
  const favouriteSchemes = favourites.map(fav => {
    if (typeof fav === 'string' || typeof fav === 'number') {
      return schemes.find(s => s._id === fav || s.id === fav);
    }
    return fav;
  }).filter(Boolean); 

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
      <div className="flex items-center space-x-3 mb-8">
        <h1 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>💖 {t('yourFavourites')}</h1>
        <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {favouriteSchemes.length} {t('savedSuffix')}
        </span>
      </div>

      {favouriteSchemes.length === 0 ? (
        <div className={`p-16 text-center rounded-3xl border max-w-lg mx-auto shadow-xl ${
          darkMode ? 'bg-[#121824] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center text-2xl mx-auto mb-4 ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'
          }`}>💔</div>
          <h3 className="text-lg font-bold mb-2">{t('noFavouritesTitle')}</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">{t('noFavouritesDesc')}</p>
          <button 
            type="button"
            onClick={() => setActiveTab('schemes')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold text-xs transition shadow-lg cursor-pointer"
          >
            {t('exploreSchemesBtn')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favouriteSchemes.map(scheme => (
            <SchemeCard 
              key={scheme._id || scheme.id} 
              scheme={scheme} 
              isFav={true}
              onToggleFavourite={onToggleFavourite}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}