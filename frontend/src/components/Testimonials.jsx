import React from 'react';

const testimonials = [
  {
    quote: "Got Kanyashree ₹25,000 directly in my bank. No bribe, no middleman. SchemeSaathi guided me perfectly!",
    name: "Priya Das, WB",
    scheme: "Kanyashree"
  },
  {
    quote: "PM-Kisan status check was so easy. Found I was eligible for 3 more schemes too.",
    name: "Ramesh Yadav, UP",
    scheme: "PM-Kisan"
  },
  {
    quote: "As a student, found 5 scholarships I never knew existed. Already received first installment.",
    name: "Anjali Menon, Kerala",
    scheme: "Scholarship"
  }
];

export default function Testimonials() {
  return (
    <div className="max-w-7xl mx-auto px-6 my-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div key={idx} className="glass-card p-6 rounded-3xl border border-gray-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 text-sm mb-4">★★★★★</div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">"{t.quote}"</p>
            </div>
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white text-xs">
                {t.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.name}</h4>
                <p className="text-xs text-gray-400">{t.scheme}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}