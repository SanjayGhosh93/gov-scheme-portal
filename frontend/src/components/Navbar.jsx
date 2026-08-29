import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' }
];

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAuth, 
  user, 
  setUser, 
  darkMode, 
  setDarkMode, 
  currentLang: propCurrentLang, 
  setCurrentLang: propSetCurrentLang 
}) {
  const { currentLang: ctxLang, setCurrentLang: ctxSetCurrentLang, t } = useLanguage();
  const currentLang = propCurrentLang || ctxLang || 'en';
  const setCurrentLang = propSetCurrentLang || ctxSetCurrentLang;

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const langDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLangObj = languages.find(l => l.code === currentLang) || languages[0];
  const tabs = ['home', 'schemes', 'eligibility', 'favourites'];

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLangSelect = (code) => {
    if (typeof setCurrentLang === 'function') {
      setCurrentLang(code);
    }
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setUser) setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={`w-full flex items-center justify-between px-4 md:px-8 py-3.5 border-b sticky top-0 z-50 transition-colors duration-300 ${
      darkMode ? 'bg-[#0b0f17]/90 border-gray-800/80 backdrop-blur-md' : 'bg-white/90 border-gray-200 backdrop-blur-md shadow-sm'
    }`}>
      {/* Brand Logo with scheme_saathi_logo.png */}
      <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('home')}>
        <img 
          src="/pictures/scheme_saathi_logo.png" 
          alt="SchemeSaathi Logo" 
          className="h-10 w-auto object-contain rounded-xl shadow-md transform group-hover:scale-105 transition-transform" 
        />
        <span className={`text-xl md:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Scheme<span className="text-orange-500">Saathi</span>
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <div className={`hidden md:flex items-center space-x-1 p-1.5 rounded-full border ${
        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-100 border-gray-200'
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleNavClick(tab)}
            className={`px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all capitalize cursor-pointer ${
              activeTab === tab 
                ? (darkMode ? 'bg-white text-gray-950 shadow-md font-bold' : 'bg-gray-900 text-white shadow-md font-bold')
                : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            }`}
          >
            {t(tab) || (tab.charAt(0).toUpperCase() + tab.slice(1))}
          </button>
        ))}
      </div>

      {/* Right Action Group */}
      <div className="hidden md:flex items-center space-x-3">
        
        {/* Theme Toggle Button using sun/moon SVGs */}
        <button 
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition shadow-sm cursor-pointer p-2 ${
            darkMode ? 'bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-amber-400/50' : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
          }`}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <img 
            src={darkMode ? "/pictures/moon-alt-svgrepo-com.svg" : "/pictures/sun-svgrepo-com.svg"} 
            alt="Theme" 
            className="w-5 h-5 object-contain" 
          />
        </button>

        {/* Language Dropdown Selector using translate SVG */}
        <div className="relative" ref={langDropdownRef}>
          <button 
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={`flex items-center space-x-2 text-xs border px-3.5 py-2 rounded-full transition shadow-sm cursor-pointer ${
              darkMode ? 'bg-gray-900 border-gray-700 text-gray-300 hover:text-white' : 'bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900'
            }`}
          >
            <img 
              src="/pictures/translate-language-svgrepo-com.svg" 
              alt="Language" 
              className="w-4 h-4 object-contain" 
            />
            <span className="font-semibold">{activeLangObj.native}</span>
            <span className="text-[10px] ml-0.5 opacity-70">▼</span>
          </button>

          {isLangOpen && (
            <div className={`absolute right-0 mt-2 w-48 border rounded-2xl shadow-2xl overflow-hidden z-50 py-1.5 ${
              darkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLangSelect(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                    currentLang === lang.code 
                      ? 'bg-orange-500 text-white font-semibold' 
                      : (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <span>{lang.native}</span>
                  <span className={`text-[11px] ${currentLang === lang.code ? 'text-white/80' : 'text-gray-400'}`}>({lang.name})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Button using admin-svgrepo-com.svg */}
        <button 
          type="button"
          onClick={() => setActiveTab('admin')} 
          className={`flex items-center space-x-2 text-xs border px-3.5 py-2 rounded-full font-semibold transition shadow-sm cursor-pointer ${
            activeTab === 'admin' 
              ? 'bg-orange-600 text-white border-orange-600 font-bold' 
              : user?.role === 'admin'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/40 hover:bg-orange-500/20'
                : (darkMode ? 'bg-gray-900 border-gray-700 text-gray-300 hover:text-white' : 'bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900')
          }`}
        >
          <img 
            src="/pictures/admin-svgrepo-com.svg" 
            alt="Admin" 
            className="w-4 h-4 object-contain" 
          />
          <span>{t('admin')}</span>
          {user?.role === 'admin' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
          )}
        </button>

        {/* User Profile Button with Dropdown Logout */}
        {user ? (
          <div className="relative" ref={userDropdownRef}>
            <button 
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition shadow-md cursor-pointer flex items-center space-x-2 ${
                user.role === 'admin'
                  ? (darkMode ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50 text-white' : 'bg-orange-100 border border-orange-300 text-orange-950')
                  : (darkMode ? 'bg-white text-gray-950 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800')
              }`}
            >
              <span>{user.role === 'admin' ? '🛡️' : '👤'}</span>
              <span>{user.fullName}</span>
              <span className="text-[10px] text-gray-400 ml-1">▼</span>
            </button>

            {isUserMenuOpen && (
              <div className={`absolute right-0 mt-2 w-52 border rounded-2xl shadow-2xl overflow-hidden z-50 py-2 ${
                darkMode ? 'bg-[#121824] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className="px-4 py-2.5 border-b border-gray-800 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold truncate">{user.fullName}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      user.role === 'admin' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[10px] truncate mt-0.5">{user.email}</p>
                </div>
                
                {/* Logout Option with logout SVG */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition cursor-pointer flex items-center space-x-2.5"
                >
                  <img src="/pictures/logout-2-svgrepo-com.svg" alt="Logout" className="w-4 h-4 object-contain opacity-80" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            type="button"
            onClick={onOpenAuth} 
            className={`px-5 py-2 rounded-full text-sm font-semibold transition shadow-md cursor-pointer ${
              darkMode ? 'bg-white text-gray-950 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {t('login')}
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="flex md:hidden items-center space-x-2">
        <button 
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`w-9 h-9 rounded-full border flex items-center justify-center p-2 cursor-pointer ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <img 
            src={darkMode ? "/pictures/moon-alt-svgrepo-com.svg" : "/pictures/sun-svgrepo-com.svg"} 
            alt="Theme" 
            className="w-4 h-4 object-contain" 
          />
        </button>

        <button 
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2 rounded-xl border text-base cursor-pointer ${
            darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
          }`}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className={`absolute top-full left-0 w-full border-b shadow-2xl p-6 space-y-4 md:hidden z-50 animate-fadeIn ${
          darkMode ? 'bg-[#0b0f17] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleNavClick(tab)}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold capitalize text-center cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-orange-500 text-white' 
                    : (darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700')
                }`}
              >
                {t(tab) || (tab.charAt(0).toUpperCase() + tab.slice(1))}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`py-2.5 px-4 rounded-xl text-xs font-semibold text-center col-span-2 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'admin' ? 'bg-orange-600 text-white' : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
              }`}
            >
              <img src="/pictures/admin-svgrepo-com.svg" alt="Admin" className="w-4 h-4 object-contain" />
              <span>{t('adminPanel')}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
              <img src="/pictures/translate-language-svgrepo-com.svg" alt="" className="w-4 h-4 object-contain" />
              <span>Select Language</span>
            </div>
            <select
              value={currentLang}
              onChange={(e) => handleLangSelect(e.target.value)}
              className={`w-full p-3 rounded-xl border text-xs cursor-pointer ${
                darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.native} ({l.name})</option>
              ))}
            </select>

            {user ? (
              <div className="flex flex-col gap-2">
                <div className="text-center text-xs text-gray-300 font-medium py-1">
                  {t('signedInAs')} {user.fullName}
                </div>
                <button 
                  type="button"
                  onClick={(e) => { setIsMobileMenuOpen(false); handleLogout(e); }}
                  className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
                >
                  <img src="/pictures/logout-2-svgrepo-com.svg" alt="Logout" className="w-4 h-4 object-contain opacity-80" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full py-3 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                {t('loginRegister')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}