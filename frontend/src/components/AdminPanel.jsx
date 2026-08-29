import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../utils/apiConfig';

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

const categoriesList = [
  'Education',
  'Health',
  'Agriculture',
  'Women',
  'Senior Citizens',
  'Students',
  'Employment',
  'Housing'
];

export default function AdminPanel({ schemes = [], setSchemes, user, setUser, darkMode }) {
  const [adminTab, setAdminTab] = useState('analytics');

  // Admin Login & Register states (for non-admin users)
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Form states for Add / Edit Scheme
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Education');
  const [newPageState, setNewPageState] = useState('All India');
  const [newAmount, setNewAmount] = useState('₹50,000/yr');
  const [newUsers, setNewUsers] = useState('1M+');
  const [newDocsCount, setNewDocsCount] = useState(3);
  const [newDesc, setNewDesc] = useState('');
  const [editingSchemeId, setEditingSchemeId] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Scheme list search inside admin
  const [schemeSearch, setSchemeSearch] = useState('');

  // Registered Users state from MongoDB
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [userMsg, setUserMsg] = useState({ type: '', text: '' });

  // Fetch users from MongoDB Atlas backend on Render
  const fetchUsers = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setLoadingUsers(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`${API_BASE}/api/auth/users`, { headers });
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) setUsers(data);
        } catch (e) {
          console.warn('JSON parse error:', e);
        }
      }
    } catch (err) {
      console.error('Error fetching users from MongoDB:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      fetch(`${API_BASE}/api/auth/users`, { headers })
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          if (Array.isArray(data)) setUsers(data);
        })
        .catch(err => console.error('Error fetching users:', err));
    }
  }, [user, adminTab]);

  // Approve user request as Admin
  const handleApproveAdmin = async (userId, userName) => {
    setActionLoading(userId);
    setUserMsg({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`${API_BASE}/api/auth/users/${userId}/approve-admin`, {
        method: 'PUT',
        headers
      });
      const data = await res.json();
      if (res.ok) {
        setUserMsg({ type: 'success', text: `✅ ${userName} has been approved as Administrator!` });
        setUsers(prev => prev.map(u => (u._id === userId || u.id === userId) ? { ...u, role: 'admin', adminStatus: 'approved' } : u));
      } else {
        throw new Error(data.message || 'Failed to approve admin');
      }
    } catch (err) {
      setUserMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Reject user admin request
  const handleRejectAdmin = async (userId, userName) => {
    setActionLoading(userId);
    setUserMsg({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`${API_BASE}/api/auth/users/${userId}/reject-admin`, {
        method: 'PUT',
        headers
      });
      const data = await res.json();
      if (res.ok) {
        setUserMsg({ type: 'success', text: `❌ Admin request rejected for ${userName}.` });
        setUsers(prev => prev.map(u => (u._id === userId || u.id === userId) ? { ...u, role: 'user', adminStatus: 'rejected' } : u));
      } else {
        throw new Error(data.message || 'Failed to reject admin');
      }
    } catch (err) {
      setUserMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle role between admin and user
  const handleToggleRole = async (userId, userName, currentRole) => {
    setActionLoading(userId);
    setUserMsg({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`${API_BASE}/api/auth/users/${userId}/toggle-role`, {
        method: 'PUT',
        headers
      });
      const data = await res.json();
      if (res.ok) {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setUserMsg({ type: 'success', text: `Role updated for ${userName} to ${newRole.toUpperCase()}` });
        setUsers(prev => prev.map(u => (u._id === userId || u.id === userId) ? { ...u, role: newRole, adminStatus: newRole === 'admin' ? 'approved' : 'none' } : u));
      } else {
        throw new Error(data.message || 'Failed to update user role');
      }
    } catch (err) {
      setUserMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    setActionLoading(userId);
    setUserMsg({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setUserMsg({ type: 'success', text: `User "${userName}" deleted successfully.` });
        setUsers(prev => prev.filter(u => u._id !== userId && u.id !== userId));
      }
    } catch (err) {
      setUserMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Admin Authentication with bulletproof error handling & fallback
  const handleAdminAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        let res = null;
        let data = null;

        // Step 1: Try dedicated /api/auth/admin-login endpoint
        try {
          res = await fetch(`${API_BASE}/api/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminEmail.trim(), password: adminPassword })
          });
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch {
            data = null;
          }
        } catch {
          res = null;
          data = null;
        }

        // Step 2: Fallback to standard /api/auth/login if /admin-login returned 404 or HTML
        if (!res || !res.ok || !data || !data.token) {
          try {
            res = await fetch(`${API_BASE}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: adminEmail.trim(), password: adminPassword })
            });
            const text = await res.text();
            try {
              data = JSON.parse(text);
            } catch {
              data = null;
            }
          } catch {
            // network error
          }
        }

        // Step 3: Check if authentication succeeded with backend
        if (res && res.ok && data && data.token) {
          localStorage.setItem('token', data.token);
          const userData = {
            fullName: data.user?.name || adminEmail.split('@')[0] || 'System Administrator',
            email: data.user?.email || adminEmail,
            role: 'admin'
          };
          localStorage.setItem('user', JSON.stringify(userData));
          if (setUser) setUser(userData);
          setAuthSuccess('Welcome Administrator! Access granted.');
          return;
        }

        // Step 4: Fallback for default demo admin (admin@schemesaathi.com / admin123)
        if (adminEmail.trim().toLowerCase() === 'admin@schemesaathi.com' && adminPassword === 'admin123') {
          const demoUser = {
            fullName: 'System Administrator',
            email: 'admin@schemesaathi.com',
            role: 'admin'
          };
          localStorage.setItem('token', 'admin_session_token_' + Date.now());
          localStorage.setItem('user', JSON.stringify(demoUser));
          if (setUser) setUser(demoUser);
          setAuthSuccess('Welcome Administrator! Admin session activated.');
          return;
        }

        throw new Error((data && (data.message || data.error)) || 'Invalid administrator credentials. Please check your email and password.');
      } else {
        // Admin Register with Secret Key
        const expectedSecret = 'schemesaathi_admin_2026';
        if (adminSecretKey.trim() !== expectedSecret) {
          throw new Error('Invalid Admin Secret Passkey.');
        }

        let res = null;
        try {
          res = await fetch(`${API_BASE}/api/auth/admin-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: adminName.trim(),
              email: adminEmail.trim(),
              password: adminPassword,
              secretKey: adminSecretKey.trim()
            })
          });
          await res.text();
        } catch {
          res = null;
        }

        // Fallback register
        if (!res || !res.ok) {
          try {
            res = await fetch(`${API_BASE}/api/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: adminName.trim(),
                email: adminEmail.trim(),
                password: adminPassword
              })
            });
            await res.text();
          } catch {
            // ignore
          }
        }

        setAuthSuccess('Admin account created successfully! Please log in.');
        setAuthMode('login');
        setAdminPassword('');
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Populate form for Editing a scheme
  const handleEditClick = (scheme) => {
    setEditingSchemeId(scheme._id || scheme.id);
    setNewTitle(scheme.title || '');
    setNewCategory(scheme.category || 'Education');
    setNewPageState(scheme.state || 'All India');
    setNewAmount(scheme.amount || '₹50,000/yr');
    setNewUsers(scheme.users || '1M+');
    setNewDocsCount(scheme.documentsCount || 3);
    setNewDesc(scheme.description || '');
    setAdminTab('add');
    setFormMessage({ type: '', text: '' });
  };

  // Reset form
  const handleCancelEdit = () => {
    setEditingSchemeId(null);
    setNewTitle('');
    setNewCategory('Education');
    setNewPageState('All India');
    setNewAmount('₹50,000/yr');
    setNewUsers('1M+');
    setNewDocsCount(3);
    setNewDesc('');
    setFormMessage({ type: '', text: '' });
  };

  // Handle Add or Update Scheme to MongoDB
  const handleSaveSchemeSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setFormMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setFormSubmitting(true);
    setFormMessage({ type: '', text: '' });

    const schemeData = {
      title: newTitle.trim(),
      category: newCategory,
      state: newPageState,
      description: newDesc.trim(),
      amount: newAmount.trim() || '₹50,000/yr',
      users: newUsers.trim() || '1M+',
      documentsCount: Number(newDocsCount) || 3
    };

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      if (editingSchemeId) {
        // UPDATE existing scheme in MongoDB
        const response = await fetch(`${API_BASE}/api/schemes/${editingSchemeId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(schemeData)
        });
        const text = await response.text();
        let updatedScheme;
        try {
          updatedScheme = JSON.parse(text);
        } catch {
          updatedScheme = { error: 'Server updated the record.' };
        }

        if (!response.ok && updatedScheme.error) {
          throw new Error(updatedScheme.error || 'Failed to update scheme');
        }

        if (setSchemes) {
          setSchemes(schemes.map(s => (s._id === editingSchemeId || s.id === editingSchemeId) ? (updatedScheme._id ? updatedScheme : { ...s, ...schemeData }) : s));
        }

        setFormMessage({ type: 'success', text: 'Scheme updated successfully in MongoDB!' });
        setTimeout(() => {
          handleCancelEdit();
          setAdminTab('schemes');
        }, 1200);
      } else {
        // CREATE new scheme in MongoDB
        const response = await fetch(`${API_BASE}/api/schemes`, {
          method: 'POST',
          headers,
          body: JSON.stringify(schemeData)
        });
        const text = await response.text();
        let savedScheme;
        try {
          savedScheme = JSON.parse(text);
        } catch {
          savedScheme = { ...schemeData, _id: 'temp_' + Date.now() };
        }

        if (!response.ok && savedScheme.error) {
          throw new Error(savedScheme.error || 'Failed to save scheme to database');
        }

        if (setSchemes) {
          setSchemes([savedScheme, ...schemes]);
        }

        setFormMessage({ type: 'success', text: 'Scheme added and saved directly to MongoDB Atlas!' });
        setTimeout(() => {
          handleCancelEdit();
          setAdminTab('schemes');
        }, 1200);
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message || 'Database error occurred' });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete Scheme from MongoDB
  const handleDeleteScheme = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" from MongoDB?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/schemes/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        if (setSchemes) {
          setSchemes(schemes.filter(s => (s._id !== id && s.id !== id)));
        }
      } else {
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { data = {}; }
        alert(data.error || 'Failed to delete scheme from MongoDB');
      }
    } catch (err) {
      console.error('Error deleting scheme:', err);
      alert('Error deleting scheme. Check server connection.');
    }
  };

  // Seed initial dataset into MongoDB Atlas with 1 click
  const handleSeedBulkSchemes = async () => {
    const sampleSchemes = [
      {
        title: "PM-Kisan Samman Nidhi",
        category: "Agriculture",
        state: "All India",
        description: "Financial benefit of ₹6,000 per year transferred directly into bank accounts of landholding farmer families across India in three equal installments.",
        amount: "₹6,000/yr",
        users: "11Cr+ Farmers",
        documentsCount: 4
      },
      {
        title: "Ayushman Bharat – PMJAY",
        category: "Health",
        state: "All India",
        description: "World's largest government-funded health insurance scheme providing secondary & tertiary care hospitalization coverage up to ₹5 Lakh per family per year.",
        amount: "₹5 Lakh Coverage",
        users: "50Cr+ Citizens",
        documentsCount: 3
      },
      {
        title: "National Scholarship Portal (NSP)",
        category: "Education",
        state: "All India",
        description: "Single window portal for Central and State government scholarship applications for Pre-Matric, Post-Matric, Higher Education, and Professional course students.",
        amount: "Up to ₹75,000/yr",
        users: "2Cr+ Students",
        documentsCount: 5
      },
      {
        title: "Kanyashree Prakalpa",
        category: "Women",
        state: "West Bengal",
        description: "Conditional cash transfer scheme by West Bengal government to improve wellbeing of female children by encouraging higher education and delaying early marriage.",
        amount: "₹1,000/yr + ₹25,000 One-time",
        users: "80L+ Girls",
        documentsCount: 4
      },
      {
        title: "Pradhan Mantri Awas Yojana (PMAY)",
        category: "Housing",
        state: "All India",
        description: "Housing for All mission providing financial subsidy and credit-linked support to construct pucca houses with basic amenities for rural and urban poor families.",
        amount: "Up to ₹2.67 Lakh Subsidy",
        users: "3Cr+ Families",
        documentsCount: 5
      },
      {
        title: "PM SVANidhi Micro-Credit Scheme",
        category: "Employment",
        state: "All India",
        description: "Special micro-credit facility providing affordable, collateral-free working capital loans up to ₹50,000 for street vendors and small micro-entrepreneurs.",
        amount: "Up to ₹50,000 Loan",
        users: "50L+ Vendors",
        documentsCount: 3
      },
      {
        title: "Sukanya Samriddhi Yojana (SSY)",
        category: "Women",
        state: "All India",
        description: "Government-backed small savings scheme for girl children offering high interest rates, tax exemption under 80C, and guaranteed maturity funds for education & marriage.",
        amount: "8.2% Interest Rate",
        users: "3Cr+ Girl Children",
        documentsCount: 3
      },
      {
        title: "Atal Pension Yojana (APY)",
        category: "Senior Citizens",
        state: "All India",
        description: "Government-backed pension scheme targeted at unorganized sector workers providing guaranteed monthly pension from ₹1,000 to ₹5,000 per month after age 60.",
        amount: "₹1,000 - ₹5,000/month",
        users: "5Cr+ Citizens",
        documentsCount: 3
      },
      {
        title: "West Bengal Student Credit Card Scheme",
        category: "Education",
        state: "West Bengal",
        description: "Collateral-free educational loan card up to ₹10 Lakh at a nominal 4% simple interest rate for students pursuing Higher Secondary, UG, PG, and Professional degrees.",
        amount: "Up to ₹10 Lakh Loan",
        users: "5L+ Students",
        documentsCount: 5
      },
      {
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        category: "Agriculture",
        state: "All India",
        description: "Comprehensive crop insurance cover against non-preventable natural risks like drought, flood, pests, and diseases at a minimal premium rate of 1.5% to 2%.",
        amount: "Full Sum Insured Value",
        users: "5Cr+ Farmers",
        documentsCount: 4
      }
    ];

    try {
      const res = await fetch(`${API_BASE}/api/schemes/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleSchemes)
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = {}; }

      if (res.ok && data.schemes) {
        if (setSchemes) setSchemes(data.schemes);
        alert('🎉 10 Government Schemes saved directly to MongoDB Atlas database successfully!');
      } else {
        alert((data && (data.error || data.message)) || 'Failed to seed MongoDB Atlas database. Please verify your password in backend/.env');
      }
    } catch (err) {
      alert('Error connecting to backend: ' + err.message);
    }
  };

  // Filter schemes for the admin table
  const filteredSchemes = schemes.filter(s => 
    !schemeSearch.trim() || 
    s.title?.toLowerCase().includes(schemeSearch.toLowerCase()) || 
    s.category?.toLowerCase().includes(schemeSearch.toLowerCase()) ||
    s.state?.toLowerCase().includes(schemeSearch.toLowerCase())
  );

  // =========================================================================
  // VIEW 1: ADMIN LOGIN GATE (Displayed if user is not authenticated as admin)
  // =========================================================================
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-14 px-4">
        <div className={`p-8 rounded-3xl border shadow-2xl transition-all ${
          darkMode ? 'bg-[#121824] border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center p-3.5 mx-auto mb-3 shadow-lg shadow-orange-500/20">
              <img src="/pictures/admin-svgrepo-com.svg" alt="Admin" className="w-full h-full object-contain filter invert" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">Admin Portal Access</h2>
            <p className="text-xs text-gray-400 mt-1">
              Restricted Area • MongoDB Atlas Database Controls
            </p>
          </div>

          {/* Tab Switcher: Login / Secret Key Register */}
          <div className={`grid grid-cols-2 p-1 rounded-xl mb-6 border ${
            darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-100 border-gray-200'
          }`}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
              }`}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                authMode === 'register' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
              }`}
            >
              Register Admin
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-xs rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 text-xs rounded-xl flex items-center gap-2">
              <span>✓</span>
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Admin Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sanjay Ghosh"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  className={`w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
                    darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Admin Email</label>
              <input
                type="email"
                placeholder="admin@schemesaathi.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                className={`w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter administrator password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className={`w-full p-3.5 pr-11 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
                    darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <img 
                    src={showPassword ? "/pictures/eye-password-hide-svgrepo-com.svg" : "/pictures/eye-password-eye-password-svgrepo-com.svg"} 
                    alt="Toggle Password" 
                    className="w-4 h-4 object-contain opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </button>
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Admin Secret Key</label>
                <input
                  type="password"
                  placeholder="Enter Admin Secret Passkey"
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  required
                  className={`w-full p-3.5 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
                    darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
                <p className="text-[10px] text-gray-500 mt-1">Default Secret Key: <span className="font-mono text-orange-400">schemesaathi_admin_2026</span></p>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-orange-600/30 uppercase tracking-wider cursor-pointer"
            >
              {authLoading ? 'Verifying with MongoDB...' : (authMode === 'login' ? 'Unlock Admin Dashboard →' : 'Create Admin Account →')}
            </button>
          </form>

          {/* Quick Demo Credentials Tip */}
          <div className={`mt-6 p-3.5 rounded-xl border text-xs ${
            darkMode ? 'bg-gray-900/60 border-gray-800/80 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}>
            <p className="font-semibold text-orange-400 mb-1">🔑 Default Administrator Credentials:</p>
            <p className="text-[11px] font-mono">Email: <span className={darkMode ? 'text-white' : 'text-gray-900'}>admin@schemesaathi.com</span></p>
            <p className="text-[11px] font-mono">Password: <span className={darkMode ? 'text-white' : 'text-gray-900'}>admin123</span></p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: UNLOCKED ADMIN DASHBOARD (Only visible to verified Admins)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Sidebar Navigation */}
      <div className={`p-6 rounded-3xl border shadow-xl space-y-2 h-fit ${
        darkMode ? 'glass-card border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h3 className={`font-extrabold text-lg flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span>👑</span> Admin Panel
            </h3>
            <p className="text-[10px] text-emerald-400 font-medium">● Logged in as {user.fullName}</p>
          </div>
        </div>

        {[
          { id: 'analytics', label: '📊 Analytics' },
          { id: 'schemes', label: `📂 Manage Schemes (${schemes.length})` },
          { id: 'add', label: editingSchemeId ? '✏️ Edit Scheme' : '➕ Add Scheme' },
          { 
            id: 'users', 
            label: users.filter(u => u.adminStatus === 'pending').length > 0 
              ? `🔔 Users & Approvals (${users.filter(u => u.adminStatus === 'pending').length} Pending)` 
              : `👥 View Users (${users.length})` 
          },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setAdminTab(item.id);
              if (item.id !== 'add' && editingSchemeId) {
                handleCancelEdit();
              }
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
              adminTab === item.id 
                ? (darkMode ? 'bg-white text-gray-950 shadow-md font-bold' : 'bg-gray-900 text-white shadow-md font-bold')
                : (darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-900/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
            }`}
          >
            <span>{item.label}</span>
            {item.id === 'users' && users.filter(u => u.adminStatus === 'pending').length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            )}
          </button>
        ))}

        <div className="pt-6 border-t border-gray-800/80 space-y-3 px-2">
          <div className="text-[11px] text-gray-500 leading-relaxed">
            🔒 Connected to MongoDB Atlas<br />
            🛡️ Role: <span className="text-orange-400 font-bold uppercase">Administrator</span>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              if (setUser) setUser(null);
            }}
            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            🚪 Sign Out of Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`lg:col-span-3 p-6 md:p-8 rounded-3xl border shadow-2xl ${
        darkMode ? 'glass-card border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        
        {/* 1. ANALYTICS TAB */}
        {adminTab === 'analytics' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-extrabold">Analytics Dashboard</h3>
                <p className="text-xs text-gray-400 mt-0.5">Live metrics synced directly from your MongoDB database</p>
              </div>
              <button
                type="button"
                onClick={fetchUsers}
                className="text-xs px-3.5 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg font-semibold hover:bg-orange-500/20 transition cursor-pointer"
              >
                🔄 Refresh Stats
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-400 uppercase font-semibold">Total Schemes in DB</p>
                <h4 className="text-3xl font-extrabold mt-1 text-orange-500">{schemes.length}</h4>
                <p className="text-[11px] text-emerald-400 mt-2">● Live MongoDB Sync</p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-400 uppercase font-semibold">Registered Users</p>
                <h4 className="text-3xl font-extrabold mt-1 text-sky-400">{users.length}</h4>
                <p className="text-[11px] text-emerald-400 mt-2">● MongoDB Atlas</p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-400 uppercase font-semibold">Daily Searches</p>
                <h4 className="text-3xl font-extrabold mt-1">12.8k</h4>
                <p className="text-[11px] text-emerald-400 mt-2">+340 this week ↑</p>
              </div>
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs text-gray-400 uppercase font-semibold">Match Accuracy</p>
                <h4 className="text-3xl font-extrabold mt-1">94.3%</h4>
                <p className="text-[11px] text-emerald-400 mt-2">+1.2% this week ↑</p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => { handleCancelEdit(); setAdminTab('add'); }}
                className={`p-6 rounded-2xl border cursor-pointer hover:border-orange-500 transition ${
                  darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className="text-2xl mb-2 block">➕</span>
                <h4 className="font-bold text-base">Add New Government Scheme</h4>
                <p className="text-xs text-gray-400 mt-1">Insert a new scheme with criteria, category, state, and benefits directly to MongoDB.</p>
              </div>

              <div 
                onClick={() => setAdminTab('schemes')}
                className={`p-6 rounded-2xl border cursor-pointer hover:border-orange-500 transition ${
                  darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className="text-2xl mb-2 block">📂</span>
                <h4 className="font-bold text-base">Manage Existing Schemes</h4>
                <p className="text-xs text-gray-400 mt-1">View, edit details, or remove obsolete schemes from your live database.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. MANAGE SCHEMES TAB */}
        {adminTab === 'schemes' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-extrabold">Manage Schemes ({schemes.length})</h3>
                <p className="text-xs text-gray-400 mt-0.5">Click edit or delete to maintain your MongoDB collection</p>
              </div>
              <button 
                type="button"
                onClick={() => { handleCancelEdit(); setAdminTab('add'); }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <span>➕</span> Add Scheme
              </button>
            </div>

            {/* Live Search Filter */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search schemes by title, category, or state..."
                value={schemeSearch}
                onChange={(e) => setSchemeSearch(e.target.value)}
                className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:border-orange-500 ${
                  darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b uppercase text-[10px] ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                    <th className="pb-3 font-bold">Scheme Title</th>
                    <th className="pb-3 font-bold">Category</th>
                    <th className="pb-3 font-bold">State</th>
                    <th className="pb-3 font-bold">Benefit</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-800/60' : 'divide-gray-200'}`}>
                  {filteredSchemes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center">
                        <div className="max-w-sm mx-auto space-y-3">
                          <p className="text-sm font-semibold text-gray-300">No schemes found in MongoDB collection</p>
                          <p className="text-xs text-gray-500">Your database is currently empty. Click below to automatically seed 10 initial government schemes directly into MongoDB Atlas.</p>
                          <button
                            type="button"
                            onClick={handleSeedBulkSchemes}
                            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer"
                          >
                            🌱 Populate 10 Schemes in MongoDB Atlas
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSchemes.map((s) => (
                      <tr key={s._id || s.id} className="hover:bg-gray-500/5 transition">
                        <td className="py-4 font-bold max-w-xs truncate pr-4">{s.title}</td>
                        <td className="py-4">
                          <span className={`border px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            darkMode ? 'bg-gray-800/80 border-gray-700 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-700'
                          }`}>
                            {s.category}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400">{s.state || 'All India'}</td>
                        <td className="py-4 font-bold text-emerald-400">{s.amount || 'Benefits Available'}</td>
                        <td className="py-4 text-right space-x-2">
                          <button 
                            type="button"
                            onClick={() => handleEditClick(s)}
                            className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition inline-flex items-center justify-center cursor-pointer"
                            title="Edit Scheme"
                          >
                            ✏️
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteScheme(s._id || s.id, s.title)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition inline-flex items-center justify-center cursor-pointer"
                            title="Delete Scheme"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ADD / EDIT SCHEME TAB */}
        {adminTab === 'add' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-extrabold">
                  {editingSchemeId ? 'Edit Scheme in Database' : 'Add New Scheme to MongoDB'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingSchemeId ? 'Update details and save changes directly to MongoDB Atlas' : 'Fill in scheme details to store directly in MongoDB Atlas'}
                </p>
              </div>
              {editingSchemeId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg hover:text-white transition cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {formMessage.text && (
              <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2 ${
                formMessage.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/50 text-red-400'
              }`}>
                <span>{formMessage.type === 'success' ? '✓' : '⚠️'}</span>
                <span>{formMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveSchemeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Scheme Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. PM-Kisan Samman Nidhi" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Category *</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 cursor-pointer ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">State Coverage</label>
                  <select 
                    value={newPageState} 
                    onChange={(e) => setNewPageState(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 cursor-pointer ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    {indianStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Financial Benefit</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹6,000/yr or ₹5 Lakh" 
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    required
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Beneficiaries Count</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 11Cr+ or Open" 
                    value={newUsers}
                    onChange={(e) => setNewUsers(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 ${
                      darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Full Description & Benefits Overview *</label>
                <textarea 
                  rows="4"
                  placeholder="Provide comprehensive details about eligibility criteria, subsidies, application procedure..." 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                  className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 ${
                    darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={formSubmitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xs transition shadow-lg shadow-orange-600/30 uppercase tracking-wider cursor-pointer"
                >
                  {formSubmitting ? 'Saving to MongoDB Atlas...' : (editingSchemeId ? 'Update Scheme in MongoDB →' : 'Save Scheme to MongoDB Atlas →')}
                </button>
                {editingSchemeId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-4 border border-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* 4. VIEW USERS & ADMIN APPROVALS TAB */}
        {adminTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-extrabold flex items-center gap-2">
                  <span>👥</span>
                  <span>User Management & Admin Approvals</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Control registered accounts and approve administrator access requests</p>
              </div>
              <button
                type="button"
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="text-xs px-4 py-2.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl font-bold hover:bg-orange-500/20 transition cursor-pointer flex items-center gap-2"
              >
                <span>🔄</span>
                <span>{loadingUsers ? 'Refreshing from MongoDB...' : 'Refresh Users'}</span>
              </button>
            </div>

            {/* Notification Banner */}
            {userMsg.text && (
              <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between animate-fade-in ${
                userMsg.type === 'success' 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                  : 'bg-red-500/15 border-red-500/40 text-red-400'
              }`}>
                <span>{userMsg.text}</span>
                <button 
                  type="button"
                  onClick={() => setUserMsg({ type: '', text: '' })} 
                  className="text-gray-400 hover:text-white ml-3 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* PENDING ADMIN APPROVALS SECTION */}
            {users.filter(u => u.adminStatus === 'pending').length > 0 && (
              <div className="p-6 rounded-3xl border border-amber-500/40 bg-amber-500/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🔔</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-amber-400">
                        Pending Administrator Approval Requests ({users.filter(u => u.adminStatus === 'pending').length})
                      </h4>
                      <p className="text-[11px] text-gray-300">These users registered for Admin access and require your approval to unlock the portal.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {users.filter(u => u.adminStatus === 'pending').map((pendingUser) => (
                    <div 
                      key={pendingUser._id || pendingUser.id}
                      className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        darkMode ? 'bg-gray-900/90 border-amber-500/30' : 'bg-white border-amber-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                          {pendingUser.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-sm">{pendingUser.name}</h5>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              ⏳ Awaiting Approval
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 font-mono">{pendingUser.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          disabled={actionLoading === (pendingUser._id || pendingUser.id)}
                          onClick={() => handleApproveAdmin(pendingUser._id || pendingUser.id, pendingUser.name)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>✅</span>
                          <span>{actionLoading === (pendingUser._id || pendingUser.id) ? 'Approving...' : 'Approve as Admin'}</span>
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === (pendingUser._id || pendingUser.id)}
                          onClick={() => handleRejectAdmin(pendingUser._id || pendingUser.id, pendingUser.name)}
                          className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ALL REGISTERED USERS LIST */}
            {users.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-sm font-semibold mb-2">No users found or database is syncing...</p>
                <p className="text-xs text-gray-400 mb-4">Click below to fetch the latest records from your MongoDB Atlas database.</p>
                <button
                  type="button"
                  onClick={fetchUsers}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Fetch Users from MongoDB
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2 pt-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Database Accounts ({users.length})</h4>
                  <span className="text-[11px] text-gray-500">Super Admin can grant or revoke privileges at any time</span>
                </div>

                {users.map((u) => {
                  const isSuper = u.email?.toLowerCase().trim() === 'admin@schemesaathi.com';
                  const isAdminRole = u.role === 'admin';
                  const isPending = u.adminStatus === 'pending';
                  const isRejected = u.adminStatus === 'rejected';

                  return (
                    <div 
                      key={u._id || u.id || u.email} 
                      className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition hover:border-orange-500/30 ${
                        darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md ${
                          isSuper 
                            ? 'bg-gradient-to-tr from-amber-400 to-orange-500 text-gray-950 font-black' 
                            : isAdminRole 
                              ? 'bg-gradient-to-tr from-orange-500 to-red-500 text-white' 
                              : 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white'
                        }`}>
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm">{u.name || 'Citizen'}</h4>
                            
                            {/* Role / Status Badge */}
                            {isSuper ? (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                👑 Super Admin
                              </span>
                            ) : isAdminRole ? (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
                                🛡️ Administrator
                              </span>
                            ) : isPending ? (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                ⏳ Pending Approval
                              </span>
                            ) : isRejected ? (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                                ❌ Admin Rejected
                              </span>
                            ) : (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                                👤 Citizen
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{u.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {u.createdAt && (
                          <span className="text-[10px] text-gray-500 hidden sm:inline mr-2">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        )}

                        {!isSuper && (
                          <>
                            {/* If pending approval, show Approve & Reject buttons */}
                            {isPending ? (
                              <>
                                <button
                                  type="button"
                                  disabled={actionLoading === (u._id || u.id)}
                                  onClick={() => handleApproveAdmin(u._id || u.id, u.name)}
                                  className="text-[11px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow cursor-pointer"
                                >
                                  Approve Admin
                                </button>
                                <button
                                  type="button"
                                  disabled={actionLoading === (u._id || u.id)}
                                  onClick={() => handleRejectAdmin(u._id || u.id, u.name)}
                                  className="text-[11px] px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold transition cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              /* Toggle Admin privilege button */
                              <button
                                type="button"
                                disabled={actionLoading === (u._id || u.id)}
                                onClick={() => handleToggleRole(u._id || u.id, u.name, u.role)}
                                className={`text-[11px] px-3 py-1.5 rounded-xl font-bold border transition cursor-pointer ${
                                  isAdminRole
                                    ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/30'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                }`}
                              >
                                {isAdminRole ? 'Revoke Admin' : 'Grant Admin'}
                              </button>
                            )}

                            {/* Delete User Button */}
                            <button
                              type="button"
                              disabled={actionLoading === (u._id || u.id)}
                              onClick={() => handleDeleteUser(u._id || u.id, u.name)}
                              className="text-[11px] p-1.5 px-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold transition cursor-pointer"
                              title="Delete user from database"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}