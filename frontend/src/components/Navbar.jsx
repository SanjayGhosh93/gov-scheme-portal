import React, { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' }
];

export default function Navbar({ activeTab, setActiveTab, onOpenAuth, user, setUser, darkMode, setDarkMode, currentLang, setCurrentLang }) {
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
    setCurrentLang(code);
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Fixed Logout Handler with stopPropagation to ensure immediate response
  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={`w-full flex items-center justify-between px-4 md:px-6 py-4 border-b sticky top-0 z-50 transition-colors duration-300 ${
      darkMode ? 'bg-[#0b0f17]/90 border-gray-800/80 backdrop-blur-md' : 'bg-white/90 border-gray-200 backdrop-blur-md shadow-sm'
    }`}>
      {/* Brand Logo */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick('home')}>
        <div className="bg-orange-500 p-2 rounded-xl text-white font-bold text-lg shadow-md">🌐</div>
        <span className={`text-lg md:text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
            className={`px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-medium transition-all capitalize cursor-pointer ${
              activeTab === tab 
                ? (darkMode ? 'bg-white text-gray-950 shadow-md font-semibold' : 'bg-gray-900 text-white shadow-md font-semibold')
                : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Right Action Group */}
      <div className="hidden md:flex items-center space-x-3">
        {/* Day / Night Theme Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition shadow-sm cursor-pointer ${
            darkMode ? 'bg-gray-900 border-gray-700 text-amber-400 hover:bg-gray-800' : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
          }`}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>

        {/* Language Dropdown */}
        <div className="relative" ref={langDropdownRef}>
          <button 
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={`flex items-center space-x-2 text-xs border px-3.5 py-2 rounded-full transition shadow-sm cursor-pointer ${
              darkMode ? 'bg-gray-900 border-gray-700 text-gray-300 hover:text-white' : 'bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900'
            }`}
          >
            <span>🌐</span>
            <span className="font-medium">{activeLangObj.native}</span>
            <span className="text-[10px] ml-0.5">▼</span>
          </button>

          {isLangOpen && (
            <div className={`absolute right-0 mt-2 w-44 border rounded-2xl shadow-2xl overflow-hidden z-50 py-1 ${
              darkMode ? 'bg-[#111827] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLangSelect(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium transition cursor-pointer ${
                    currentLang === lang.code 
                      ? 'bg-orange-500 text-white font-semibold' 
                      : (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  {lang.native} ({lang.name})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Button */}
        <button 
          onClick={() => setActiveTab('admin')} 
          className={`flex items-center space-x-1.5 text-xs border px-3.5 py-2 rounded-full font-medium transition shadow-sm cursor-pointer ${
            activeTab === 'admin' 
              ? 'bg-orange-600 text-white border-orange-600 font-semibold' 
              : (darkMode ? 'bg-gray-900 border-gray-700 text-gray-300 hover:text-white' : 'bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900')
          }`}
        >
          <span>⚙️</span>
          <span>Admin</span>
        </button>

        {/* User Profile Button with Dropdown Logout */}
        {user ? (
          <div className="relative" ref={userDropdownRef}>
            <button 
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-gray-950 hover:bg-gray-100 transition shadow-md cursor-pointer flex items-center space-x-2"
            >
              <span>👤</span>
              <span>{user.fullName}</span>
              <span className="text-[10px] text-gray-500 ml-1">▼</span>
            </button>

            {isUserMenuOpen && (
              <div className={`absolute right-0 mt-2 w-48 border rounded-2xl shadow-2xl overflow-hidden z-50 py-2 ${
                darkMode ? 'bg-[#121824] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className="px-4 py-2 border-b border-gray-800 text-xs">
                  <p className="font-bold">{user.fullName}</p>
                  <p className="text-gray-400 text-[10px] truncate">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition cursor-pointer flex items-center space-x-2"
                >
                  <span>🚪</span>
                  <span>Logout</span>
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
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="flex md:hidden items-center space-x-2">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm cursor-pointer ${
            darkMode ? 'bg-gray-900 border-gray-700 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'
          }`}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>

        <button 
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
                onClick={() => handleNavClick(tab)}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold capitalize text-center cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-orange-500 text-white' 
                    : (darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700')
                }`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('admin')}
              className={`py-2.5 px-4 rounded-xl text-xs font-semibold text-center col-span-2 cursor-pointer ${
                activeTab === 'admin' ? 'bg-orange-600 text-white' : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
              }`}
            >
              ⚙️ Admin Panel
            </button>
          </div>

          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
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
                <div className="text-center text-xs text-gray-300 font-medium py-1">Signed in as {user.fullName}</div>
                <button 
                  type="button"
                  onClick={(e) => { setIsMobileMenuOpen(false); handleLogout(e); }}
                  className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full py-3 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}