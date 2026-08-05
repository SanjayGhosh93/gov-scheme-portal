import React, { useState, useEffect } from 'react';

const indianStates = [
  "All India",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export default function AdminPanel({ schemes, setSchemes, darkMode }) {
  const [adminTab, setAdminTab] = useState('analytics');

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Education');
  const [newPageState, setNewPageState] = useState('All India');
  const [newDesc, setNewDesc] = useState('');

  // Real backend users state
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://gov-scheme-portal.onrender.com/api/auth/users')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUsers(data); })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleAddSchemeSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const schemeData = {
      title: newTitle,
      category: newCategory,
      state: newPageState,
      description: newDesc,
      amount: '50,000/yr',
      users: '1M+',
      documentsCount: 3
    };

    try {
      const response = await fetch('https://gov-scheme-portal.onrender.com/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schemeData)
      });
      const savedScheme = await response.json();
      
      if (response.ok) {
        setSchemes([savedScheme, ...schemes]);
        setNewTitle('');
        setNewDesc('');
        setAdminTab('schemes');
      }
    } catch (err) {
      console.error('Error saving scheme to database:', err);
    }
  };

  const handleDeleteScheme = async (id) => {
    try {
      const res = await fetch(`https://gov-scheme-portal.onrender.com/api/schemes/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSchemes(schemes.filter(s => s._id !== id));
      }
    } catch (err) {
      console.error('Error deleting scheme:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-2 h-fit ${
        darkMode ? 'glass-card border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`font-bold text-lg mb-4 px-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h3>
        {[
          { id: 'analytics', label: '📊 Analytics' },
          { id: 'schemes', label: '📂 Manage Schemes' },
          { id: 'add', label: '➕ Add Scheme' },
          { id: 'users', label: '👥 View Users' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setAdminTab(item.id)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition ${
              adminTab === item.id 
                ? (darkMode ? 'bg-white text-gray-950 shadow-md' : 'bg-gray-900 text-white shadow-md')
                : (darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-900/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
            }`}
          >
            {item.label}
          </button>
        ))}
        <div className="pt-6 border-t border-gray-800 text-[11px] text-gray-500 px-2 leading-relaxed">
          🔒 Connected to MongoDB • Role: Admin
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`lg:col-span-3 p-8 rounded-3xl border shadow-2xl ${
        darkMode ? 'glass-card border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        
        {/* 1. ANALYTICS TAB */}
        {adminTab === 'analytics' && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Analytics Dashboard</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-400 uppercase font-semibold">Total Schemes in DB</p>
                <h4 className="text-2xl font-bold mt-1">{schemes.length}</h4>
                <p className="text-[11px] text-emerald-400 mt-2">Live MongoDB Sync</p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-400 uppercase font-semibold">Registered Users</p>
                <h4 className="text-2xl font-bold mt-1">{users.length}</h4>
                <p className="text-[11px] text-emerald-400 mt-2">MongoDB Atlas</p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-400 uppercase font-semibold">Daily Searches</p>
                <h4 className="text-2xl font-bold mt-1">12.8k</h4>
                <p className="text-[11px] text-emerald-400 mt-2">+340 this week ↑</p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-400 uppercase font-semibold">Match Accuracy</p>
                <h4 className="text-2xl font-bold mt-1">94.3%</h4>
                <p className="text-[11px] text-emerald-400 mt-2">+1.2% this week ↑</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. MANAGE SCHEMES TAB */}
        {adminTab === 'schemes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Manage Schemes ({schemes.length})</h3>
              <button 
                onClick={() => setAdminTab('add')}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 transition shadow"
              >
                + Add Scheme
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b uppercase text-[10px] ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                    <th className="pb-3 font-semibold">Scheme</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">State</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-800/60' : 'divide-gray-200'}`}>
                  {schemes.map((s) => (
                    <tr key={s._id} className="transition">
                      <td className="py-4 font-semibold">{s.title}</td>
                      <td className="py-4">
                        <span className={`border px-2.5 py-1 rounded-full ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`}>
                          {s.category}
                        </span>
                      </td>
                      <td className="py-4">{s.state}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleDeleteScheme(s._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition inline-flex items-center justify-center"
                          title="Delete Scheme"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ADD SCHEME TAB */}
        {adminTab === 'add' && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Add New Scheme to Database</h3>
            <form onSubmit={handleAddSchemeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-500 block mb-2">Scheme Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. PM-Kisan Samman Nidhi" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-500 block mb-2">Category</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option>Education</option>
                    <option>Health</option>
                    <option>Agriculture</option>
                    <option>Women</option>
                    <option>Senior Citizens</option>
                    <option>Students</option>
                    <option>Employment</option>
                    <option>Housing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-500 block mb-2">State Coverage</label>
                  <select 
                    value={newPageState} 
                    onChange={(e) => setNewPageState(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    {indianStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-500 block mb-2">Short Description</label>
                  <input 
                    type="text" 
                    placeholder="Brief overview of benefits..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="mt-4 bg-orange-500 text-white font-bold px-6 py-3.5 rounded-xl text-xs hover:bg-orange-600 transition shadow-lg"
              >
                Save Scheme to MongoDB
              </button>
            </form>
          </div>
        )}

        {/* 4. VIEW USERS TAB */}
        {adminTab === 'users' && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Registered Users ({users.length})</h3>
            {users.length === 0 ? (
              <p className="text-xs text-gray-400">No users found in database or endpoint not configured.</p>
            ) : (
              <div className="space-y-4">
                {users.map((u) => (
                  <div key={u._id} className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                    <div>
                      <h4 className="font-bold text-sm">{u.name}</h4>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                      u.role === 'admin' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}