import React from 'react';

const categories = [
  { name: 'Education', count: '324 schemes', icon: '🎓', color: 'bg-purple-600/20 text-purple-400 border-purple-500/30' },
  { name: 'Health', count: '210 schemes', icon: '❤️', color: 'bg-rose-600/20 text-rose-400 border-rose-500/30' },
  { name: 'Agriculture', count: '412 schemes', icon: '🌱', color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' },
  { name: 'Women', count: '298 schemes', icon: '👥', color: 'bg-pink-600/20 text-pink-400 border-pink-500/30' },
  { name: 'Senior Citizens', count: '156 schemes', icon: '🛡️', color: 'bg-amber-600/20 text-amber-400 border-amber-500/30' },
  { name: 'Students', count: '389 schemes', icon: '💡', color: 'bg-sky-600/20 text-sky-400 border-sky-500/30' },
  { name: 'Employment', count: '276 schemes', icon: '💼', color: 'bg-blue-600/20 text-blue-400 border-blue-500/30' },
  { name: 'Housing', count: '143 schemes', icon: '🏢', color: 'bg-orange-600/20 text-orange-400 border-orange-500/30' },
];

export default function CategoryGrid({ onSelectCategory }) {
  return (
    <div className="max-w-7xl mx-auto px-6 my-16">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelectCategory(cat.name)}
            className="glass-card p-6 rounded-3xl border border-gray-800 hover:border-gray-700 transition cursor-pointer flex flex-col justify-between shadow-lg"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${cat.color} mb-6`}>
              {cat.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}