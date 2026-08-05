import React from 'react';

export default function Footer({ setActiveTab, setSelectedCategory, darkMode }) {
  
  const handleCategoryClick = (category) => {
    if (setSelectedCategory) {
      setSelectedCategory(category);
    }
    setActiveTab('schemes');
  };

  return (
    <footer className={`border-t py-12 px-6 mt-20 transition-colors ${
      darkMode ? 'bg-[#080c14] border-gray-800/80 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
    }`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-orange-500 p-2 rounded-xl text-white font-bold text-lg shadow-md">🌐</div>
            <span className={`text-xl font-bold tracking-wide ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Scheme<span className="text-orange-500">Saathi</span>
            </span>
          </div>
          <p className="text-xs max-w-sm leading-relaxed">
            SchemeSaathi simplifies discovering government welfare benefits, scholarships, and financial assistance programs tailored specifically for you, synced directly with MongoDB Atlas.
          </p>
        </div>

        {/* Categories Linkable Section */}
        <div className="space-y-3">
          <h4 className={`font-bold text-sm tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>Categories</h4>
          <ul className="space-y-2 text-xs">
            {['Education', 'Health', 'Agriculture', 'Women', 'Senior Citizens'].map((cat) => (
              <li key={cat}>
                <button 
                  onClick={() => handleCategoryClick(cat)}
                  className="hover:text-orange-400 transition text-left"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links Linkable Section */}
        <div className="space-y-3">
          <h4 className={`font-bold text-sm tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveTab('eligibility')} className="hover:text-orange-400 transition text-left">
                Eligibility Checker
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('schemes')} className="hover:text-orange-400 transition text-left">
                AI Assistant
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('favourites')} className="hover:text-orange-400 transition text-left">
                Favourites
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('admin')} className="hover:text-orange-400 transition text-left">
                Admin Panel
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800/40 text-center text-[11px] text-gray-500">
        © {new Date().getFullYear()} SchemeSaathi. All rights reserved. Built for citizens.
      </div>
    </footer>
  );
}