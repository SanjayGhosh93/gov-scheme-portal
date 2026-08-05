import React, { useState } from 'react';

export default function SchemeCard({ scheme, isFav, onToggleFavourite, darkMode }) {
  const [showModal, setShowModal] = useState(false);

  const handleApply = () => {
    const searchUrl = `https://www.google.com/search?q=apply+for+${encodeURIComponent(scheme.title)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <>
      <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all hover:scale-[1.01] ${
        darkMode ? 'bg-[#121824] border-gray-800 shadow-xl text-white' : 'bg-white border-gray-200 shadow-md text-gray-900'
      }`}>
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full font-semibold">
              {scheme.category}
            </span>
            
            {/* Working Favourite Heart Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavourite(scheme); // Pass the entire scheme object here
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition shadow-sm ${
                isFav 
                  ? 'bg-orange-500 text-white shadow-orange-500/30' 
                  : (darkMode ? 'bg-gray-800/80 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900')
              }`}
              title={isFav ? "Remove from Favourites" : "Add to Favourites"}
            >
              {isFav ? '❤️' : '🤍'}
            </button>
          </div>
          <h3 className="text-lg font-bold mb-2">{scheme.title}</h3>
          <p className="text-xs text-gray-400 mb-4 line-clamp-3 leading-relaxed">{scheme.description}</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-800/60 text-xs">
            <span className="text-green-400 font-bold">{scheme.amount || 'Benefits Available'}</span>
            <span className="text-gray-500">{scheme.state}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setShowModal(true)}
              className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                darkMode ? 'border-gray-700 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-100 text-gray-900'
              }`}
            >
              View Details
            </button>
            <button 
              onClick={handleApply}
              className="py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold transition shadow-md"
            >
              Apply Now →
            </button>
          </div>
        </div>
      </div>

      {/* Scheme Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-3xl border shadow-2xl relative ${
            darkMode ? 'bg-[#121824] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <span className="text-xs px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full font-semibold inline-block mb-3">
              {scheme.category} • {scheme.state}
            </span>
            <h3 className="text-2xl font-bold mb-3">{scheme.title}</h3>
            
            <div className="space-y-4 mb-6 text-sm text-gray-300">
              <div>
                <strong className="text-white block mb-1">Description:</strong>
                <p className="leading-relaxed text-gray-400">{scheme.description}</p>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-gray-900/60 border border-gray-800">
                <div>
                  <span className="text-xs text-gray-400 block">Financial Benefit</span>
                  <span className="text-green-400 font-bold text-base">{scheme.amount || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block">Beneficiaries</span>
                  <span className="text-white font-bold text-base">{scheme.users || 'Open'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className={`flex-1 py-3 rounded-xl text-xs font-semibold border ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}
              >
                Close
              </button>
              <button 
                onClick={() => { setShowModal(false); handleApply(); }}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-lg"
              >
                Proceed to Apply →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}