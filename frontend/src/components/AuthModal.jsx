import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export default function AuthModal({ onClose, setUser }) {
  const [view, setView] = useState('login'); // 'login', 'register', or 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (view === 'forgot') {
        const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Password reset failed');
        setSuccessMsg('Password updated successfully! Please login.');
        setTimeout(() => { setView('login'); setSuccessMsg(''); }, 2000);
        setLoading(false);
        return;
      }

      const endpoint = view === 'register' ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
      const payload = view === 'register' ? { name: fullName, email, password } : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      if (view === 'register') {
        setSuccessMsg('Registration successful! Please log in.');
        setView('login');
      } else {
        localStorage.setItem('token', data.token);
        setUser({ fullName: data.user.name, email: data.user.email, role: data.user.role });
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Integration
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();

        const backendRes = await fetch('http://localhost:5000/api/auth/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: googleUser.name, email: googleUser.email, provider: 'Google' })
        });
        
        const data = await backendRes.json();
        if (!backendRes.ok) throw new Error(data.error || 'Failed to save Google user');

        localStorage.setItem('token', data.token);
        setUser({ fullName: data.user.name, email: data.user.email, role: data.user.role });
        onClose();
      } catch (err) {
        setError(err.message || 'Google Authentication Failed');
      }
    },
    onError: () => setError('Google Popup Closed or Failed')
  });

  // Facebook Login Integration using your App ID
  const handleFacebookLogin = () => {
    const appId = '4533192663582562';
    const redirectUri = window.location.origin;
    
    const fbLoginUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email,public_profile&response_type=token`;
    
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(fbLoginUrl, 'Facebook Login', `width=${width},height=${height},top=${top},left=${left}`);

    const checkPopup = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
        } else if (popup.location.href.includes('access_token')) {
          const urlParams = new URLSearchParams(popup.location.hash.substring(1));
          const accessToken = urlParams.get('access_token');
          popup.close();
          clearInterval(checkPopup);

          const graphRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
          const fbUser = await graphRes.json();

          const backendRes = await fetch('http://localhost:5000/api/auth/social', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              name: fbUser.name || 'Facebook User', 
              email: fbUser.email || `fb_${fbUser.id}@facebook.com`, 
              provider: 'Facebook' 
            })
          });

          const data = await backendRes.json();
          if (!backendRes.ok) throw new Error(data.error || 'Failed to save Facebook user');

          localStorage.setItem('token', data.token);
          setUser({ fullName: data.user.name, email: data.user.email, role: data.user.role });
          onClose();
        }
      } catch (e) {
        // Cross-origin safety guard during popup redirect
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-gray-800 relative shadow-2xl bg-[#121824] text-white">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">✕</button>
        
        <h2 className="text-2xl font-bold mb-1">
          {view === 'register' ? 'Create account' : view === 'forgot' ? 'Reset password' : 'Welcome back'}
        </h2>
        <p className="text-xs text-gray-400 mb-6">Connected to MongoDB Atlas • Secure JWT Auth</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 text-xs rounded-xl">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <input 
              type="text" 
              placeholder="Full Name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="off"
              required 
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
            />
          )}

          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required 
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
          />

          {/* Password Field with Eye Toggle */}
          {view !== 'forgot' && (
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required 
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-orange-500"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          )}

          {/* New Password Field for Forgot Password View */}
          {view === 'forgot' && (
            <div className="relative">
              <input 
                type={showNewPassword ? 'text' : 'password'} 
                placeholder="Enter New Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-orange-500"
              />
              <button 
                type="button" 
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>
          )}

          {/* Forgot Password Link */}
          {view === 'login' && (
            <div className="text-right">
              <span 
                onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }}
                className="text-xs text-orange-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition shadow-lg cursor-pointer"
          >
            {loading ? 'Processing...' : (view === 'register' ? 'Register →' : view === 'forgot' ? 'Update Password →' : 'Login →')}
          </button>
        </form>

        {view !== 'forgot' && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="px-3 text-xs text-gray-500 uppercase">Or continue with</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => googleLogin()}
                className="flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 py-2.5 rounded-xl text-xs font-medium text-gray-300 transition cursor-pointer"
              >
                <span>🌐</span>
                <span>Google</span>
              </button>
              <button 
                type="button"
                onClick={handleFacebookLogin}
                className="flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 py-2.5 rounded-xl text-xs font-medium text-gray-300 transition cursor-pointer"
              >
                <span>📘</span>
                <span>Facebook</span>
              </button>
            </div>
          </>
        )}

        <div className="text-center mt-6">
          {view === 'login' && (
            <p className="text-xs text-gray-400 cursor-pointer hover:text-white" onClick={() => { setView('register'); setError(''); setSuccessMsg(''); }}>
              New here? <span className="text-orange-400 font-semibold">Create account</span>
            </p>
          )}
          {view === 'register' && (
            <p className="text-xs text-gray-400 cursor-pointer hover:text-white" onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}>
              Already have account? <span className="text-orange-400 font-semibold">Login</span>
            </p>
          )}
          {view === 'forgot' && (
            <p className="text-xs text-gray-400 cursor-pointer hover:text-white" onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}>
              Remembered your password? <span className="text-orange-400 font-semibold">Back to Login</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}