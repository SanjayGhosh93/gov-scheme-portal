import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import FloatingAIChatbot from './components/FloatingAIChatbot';

import Home from './pages/Home';
import SchemesPage from './pages/SchemesPage';
import EligibilityChecker from './pages/EligibilityChecker';
import Favourites from './pages/Favourites';
import AdminPanel from './components/AdminPanel';

import { API_BASE } from './utils/apiConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [darkMode, setDarkMode] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');

  // Live MongoDB state fetched exclusively from Render backend
  const [schemes, setSchemes] = useState([]);
  const [favourites, setFavourites] = useState([]);

  // Fetch schemes directly from Render MongoDB backend
  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE}/api/schemes`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (isMounted && Array.isArray(data)) {
          setSchemes(data);
        }
      })
      .catch(err => console.error('Render MongoDB schemes fetch error:', err));
    return () => { isMounted = false; };
  }, []);

  // Verify and refresh logged-in user profile from MongoDB
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.name && data.email) {
            const updatedUser = {
              fullName: data.name,
              email: data.email,
              role: data.role || 'user'
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        })
        .catch(err => {
          console.warn('User profile MongoDB sync notice:', err);
        });
    }
  }, []);

  // Fetch logged-in user's saved favourites from MongoDB database
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      fetch(`${API_BASE}/api/auth/favourites`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setFavourites(data);
        })
        .catch(err => console.error('Failed to fetch user favourites from MongoDB:', err));
    }
  }, [user]);

  // Database-driven toggle function to save directly into MongoDB user document
  const toggleFavourite = async (scheme) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save your favorite schemes!');
      setIsAuthOpen(true);
      return;
    }

    const schemeId = scheme._id || scheme.id;
    try {
      const response = await fetch(`${API_BASE}/api/auth/favourites/toggle`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ schemeId })
      });

      if (response.ok) {
        const updatedFavourites = await response.json();
        if (Array.isArray(updatedFavourites)) {
          setFavourites(updatedFavourites);
        }
      }
    } catch (err) {
      console.error('Failed to toggle favourite in MongoDB:', err);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-[#0b0f17] text-white' : 'bg-[#fbf9f5] text-gray-950'
    } flex flex-col justify-between selection:bg-orange-500 selection:text-white`}>
      <div>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenAuth={() => setIsAuthOpen(true)} 
          user={user} 
          setUser={(newUser) => {
            setUser(newUser);
            if (!newUser) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }} 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {activeTab === 'home' && (
          <Home 
            schemes={schemes} 
            favourites={favourites} 
            onToggleFavourite={toggleFavourite} 
            setActiveTab={setActiveTab}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            onSelectCategory={setSelectedCategory}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'schemes' && (
          <SchemesPage 
            schemes={schemes} 
            favourites={favourites} 
            onToggleFavourite={toggleFavourite}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityChecker 
            schemes={schemes} 
            favourites={favourites} 
            onToggleFavourite={toggleFavourite} 
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'favourites' && (
          <Favourites 
            favourites={favourites} 
            schemes={schemes}
            onToggleFavourite={toggleFavourite} 
            setActiveTab={setActiveTab} 
            darkMode={darkMode}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel 
            schemes={schemes} 
            setSchemes={setSchemes} 
            user={user}
            setUser={setUser}
            darkMode={darkMode} 
          />
        )}
      </div>

      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          user={user} 
          setUser={setUser} 
          darkMode={darkMode} 
        />
      )}
      
      <FloatingAIChatbot schemes={schemes} darkMode={darkMode} />

      <Footer setActiveTab={setActiveTab} darkMode={darkMode} />
    </div>
  );
}