import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import FloatingAIChatbot from './components/FloatingAIChatbot';

import Home from './pages/Home';
import SchemesPage from './pages/SchemesPage';
import EligibilityChecker from './pages/EligibilityChecker';
import Favourites from './pages/Favourites';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All India');

  // Dynamic state loaded from MongoDB backend
  const [schemes, setSchemes] = useState([]);
  const [favourites, setFavourites] = useState([]);

  // Fetch schemes from MongoDB backend on load
  useEffect(() => {
    fetch('http://localhost:5000/api/schemes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSchemes(data);
      })
      .catch(err => console.error('Failed to fetch schemes from backend:', err));
  }, []);

  // Fetch logged-in user's saved favourites from MongoDB database
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/favourites', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setFavourites(data);
        })
        .catch(err => console.error('Failed to fetch user favourites:', err));
    } else {
      setFavourites([]); // Clear favourites view on logout
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

    try {
      const response = await fetch('http://localhost:5000/api/auth/favourites/toggle', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ schemeId: scheme._id })
      });

      const updatedFavourites = await response.json();
      if (response.ok) {
        setFavourites(updatedFavourites);
      }
    } catch (err) {
      console.error('Failed to update favorite in database:', err);
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
          setUser={setUser} 
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
            onToggleFavourite={toggleFavourite} 
            setActiveTab={setActiveTab} 
            darkMode={darkMode}
          />
        )}

        {activeTab === 'admin' && <AdminPanel schemes={schemes} setSchemes={setSchemes} darkMode={darkMode} />}
      </div>

      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          user={user} 
          setUser={setUser} 
          darkMode={darkMode} 
        />
      )}
      
      <FloatingAIChatbot darkMode={darkMode} />

      <Footer setActiveTab={setActiveTab} darkMode={darkMode} />
    </div>
  );
}