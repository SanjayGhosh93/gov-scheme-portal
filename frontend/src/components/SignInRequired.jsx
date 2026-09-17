import { useLanguage } from '../context/LanguageContext';

export default function SignInRequired({ targetTab = 'schemes', onSignIn, onBackHome, darkMode = true }) {
  const { t } = useLanguage();

  const tabDetails = {
    schemes: {
      title: 'Sign In to Access Government Schemes',
      subtitle: 'Unlock access to hundreds of central and state government schemes, subsidies, and welfare benefits.',
      icon: '📂'
    },
    eligibility: {
      title: 'Sign In to Check Your Eligibility',
      subtitle: 'Use our intelligent eligibility engine to calculate your benefits and matching schemes in seconds.',
      icon: '🎯'
    },
    favourites: {
      title: 'Sign In to View Saved Schemes',
      subtitle: 'Access your personalized list of saved welfare schemes across all your devices.',
      icon: '💖'
    },
    default: {
      title: 'Sign In Required',
      subtitle: 'Please sign in or create an account to access this section.',
      icon: '🔒'
    }
  };

  const current = tabDetails[targetTab] || tabDetails.default;

  const benefits = [
    { icon: '📋', text: 'Browse 100+ verified Central & State Schemes' },
    { icon: '🎯', text: 'Instant personalized eligibility check' },
    { icon: '📑', text: 'Complete application checklists & guidelines' },
    { icon: '💾', text: 'Save & track favourite schemes in your dashboard' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 w-full animate-fadeIn">
      <div className={`p-8 md:p-12 rounded-3xl border text-center shadow-2xl relative overflow-hidden ${
        darkMode ? 'glass-card border-gray-800 bg-[#121824]/90 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-xl'
      }`}>
        
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 bg-gradient-to-b from-orange-500/20 to-transparent blur-2xl pointer-events-none"></div>

        {/* Lock Icon Badge */}
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg border bg-gradient-to-tr from-orange-500/20 to-amber-500/10 border-orange-500/30 text-orange-400">
          <span>🔒</span>
        </div>

        <span className="text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-block mb-3">
          Citizen Sign In Required
        </span>

        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
          {current.title}
        </h2>

        <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
          {current.subtitle}
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-8 text-left">
          {benefits.map((b, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-2xl border flex items-center gap-3 text-xs ${
                darkMode ? 'bg-gray-900/60 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <span className="text-base">{b.icon}</span>
              <span className="font-semibold">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            type="button"
            onClick={onSignIn}
            className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔐</span>
            <span>{t('loginRegister') || 'Sign In / Register Now'}</span>
          </button>

          <button
            type="button"
            onClick={onBackHome}
            className={`w-full sm:w-auto px-6 py-3.5 border rounded-xl text-xs font-bold transition cursor-pointer ${
              darkMode ? 'border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
          >
            ← {t('home') || 'Back to Home'}
          </button>
        </div>

      </div>
    </div>
  );
}
