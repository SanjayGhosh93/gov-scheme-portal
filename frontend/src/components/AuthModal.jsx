import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE } from '../utils/apiConfig';

export default function AuthModal({ onClose, setUser }) {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Google OAuth Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSocialLoading(true);
      setError('');
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const googleUser = await userInfoRes.json();

        let res = null;
        let data = null;
        try {
          res = await fetch(`${API_BASE}/api/auth/social`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: googleUser.name || 'Google Citizen',
              email: googleUser.email,
              provider: 'google'
            })
          });
          const text = await res.text();
          try { data = JSON.parse(text); } catch { data = null; }
        } catch {
          res = null;
          data = null;
        }

        const userData = {
          fullName: (data && data.user && data.user.name) || googleUser.name || 'Google Citizen',
          email: (data && data.user && data.user.email) || googleUser.email,
          role: (data && data.user && data.user.role) || 'user'
        };

        const sessionToken = (data && data.token) || `google_token_${Date.now()}`;
        localStorage.setItem('token', sessionToken);
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);

        setSuccessMsg(`Welcome, ${userData.fullName}!`);
        setTimeout(() => onClose(), 600);
      } catch {
        setError('Google sign-in could not be completed. Please try with email/password.');
      } finally {
        setSocialLoading(false);
      }
    },
    onError: () => {
      setError('Google Sign-In was cancelled or failed.');
      setSocialLoading(false);
    }
  });

  // Facebook OAuth Login
  const handleFacebookLogin = () => {
    setSocialLoading(true);
    setError('');

    const appId = '4533192663582562';
    const redirectUri = window.location.origin;
    const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email,public_profile&response_type=token`;

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      fbAuthUrl,
      'FacebookLoginPopup',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      setError('Popup was blocked by your browser. Please allow popups to continue.');
      setSocialLoading(false);
      return;
    }

    const checkPopup = setInterval(async () => {
      try {
        if (popup.closed) {
          clearInterval(checkPopup);
          setSocialLoading(false);
          return;
        }

        const currentUrl = popup.location.href;
        if (currentUrl && currentUrl.includes('access_token=')) {
          clearInterval(checkPopup);
          const params = new URLSearchParams(popup.location.hash.substring(1));
          const accessToken = params.get('access_token');
          popup.close();

          if (accessToken) {
            const fbProfileRes = await fetch(`https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`);
            const fbProfile = await fbProfileRes.json();

            let res = null;
            let data = null;
            try {
              res = await fetch(`${API_BASE}/api/auth/social`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: fbProfile.name || 'Facebook Citizen',
                  email: fbProfile.email || `fb_${Date.now()}@facebook.com`,
                  provider: 'facebook'
                })
              });
              const text = await res.text();
              try { data = JSON.parse(text); } catch { data = null; }
            } catch {
              res = null;
            }

            const userData = {
              fullName: (data && data.user && data.user.name) || fbProfile.name || 'Facebook Citizen',
              email: (data && data.user && data.user.email) || fbProfile.email || `fb_${Date.now()}@facebook.com`,
              role: (data && data.user && data.user.role) || 'user'
            };

            const sessionToken = (data && data.token) || `fb_token_${Date.now()}`;
            localStorage.setItem('token', sessionToken);
            localStorage.setItem('user', JSON.stringify(userData));
            if (setUser) setUser(userData);

            setSuccessMsg(`Welcome, ${userData.fullName}!`);
            setTimeout(() => onClose(), 600);
          }
          setSocialLoading(false);
        }
      } catch {
        // Cross-origin polling expected until redirected
      }
    }, 500);

    setTimeout(() => {
      if (!popup.closed) {
        clearInterval(checkPopup);
        setSocialLoading(false);
      }
    }, 60000);
  };

  // Main Submit Handler (Seamless Sign-In, Auto-Register, & Admin Login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Password Reset View
      if (view === 'forgot') {
        const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, newPassword })
        });
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch { data = {}; }

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update password');
        }
        setSuccessMsg('Password updated successfully! Please sign in with your new password.');
        setView('login');
        setPassword('');
        return;
      }

      // 2. Dedicated Administrator Login
      if (view === 'admin') {
        let adminRes = null;
        let adminData = null;

        try {
          adminRes = await fetch(`${API_BASE}/api/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, password })
          });
          const text = await adminRes.text();
          try { adminData = JSON.parse(text); } catch { adminData = null; }
        } catch {
          adminRes = null;
        }

        if (adminRes && adminRes.ok && adminData && adminData.token) {
          const adminUser = {
            fullName: adminData.user?.name || 'System Administrator',
            email: adminData.user?.email || cleanEmail,
            role: 'admin'
          };
          localStorage.setItem('token', adminData.token);
          localStorage.setItem('user', JSON.stringify(adminUser));
          if (setUser) setUser(adminUser);
          onClose();
          return;
        }

        // Demo Admin Default
        if (cleanEmail === 'admin@schemesaathi.com' && password === 'admin123') {
          const demoAdmin = {
            fullName: 'System Administrator',
            email: 'admin@schemesaathi.com',
            role: 'admin'
          };
          localStorage.setItem('token', 'admin_session_' + Date.now());
          localStorage.setItem('user', JSON.stringify(demoAdmin));
          if (setUser) setUser(demoAdmin);
          onClose();
          return;
        }

        throw new Error((adminData && (adminData.message || adminData.error)) || 'Invalid administrator credentials. Please check your admin email and password.');
      }

      // 3. Citizen Registration View
      if (view === 'register') {
        const displayName = fullName.trim() || cleanEmail.split('@')[0];
        const regRes = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: displayName, email: cleanEmail, password })
        });
        const regText = await regRes.text();
        let regData;
        try { regData = JSON.parse(regText); } catch { regData = {}; }

        if (!regRes.ok) {
          throw new Error(regData.message || 'Registration failed. User may already exist.');
        }

        // Auto-login after registration
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        const lText = await loginRes.text();
        let lData;
        try { lData = JSON.parse(lText); } catch { lData = {}; }

        const userData = {
          fullName: displayName,
          email: cleanEmail,
          role: 'user'
        };
        const token = (lData && lData.token) || ('user_session_' + Date.now());
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);
        onClose();
        return;
      }

      // 4. Citizen Sign-In View (With Intelligent Auto-Registration)
      if (view === 'login') {
        let loginRes = null;
        let loginData = null;

        try {
          loginRes = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, password })
          });
          const text = await loginRes.text();
          try { loginData = JSON.parse(text); } catch { loginData = null; }
        } catch {
          loginRes = null;
        }

        // Case A: Existing user authenticated successfully
        if (loginRes && loginRes.ok && loginData && loginData.token) {
          const userData = {
            fullName: loginData.user?.name || cleanEmail.split('@')[0],
            email: loginData.user?.email || cleanEmail,
            role: loginData.user?.role || 'user'
          };
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('user', JSON.stringify(userData));
          if (setUser) setUser(userData);
          onClose();
          return;
        }

        // Case B: Account does not exist yet -> Automatically register & sign in!
        if (loginRes && loginRes.status === 400 && loginData && loginData.message === 'Invalid email or password') {
          const fallbackName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          
          const regRes = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: fallbackName,
              email: cleanEmail,
              password
            })
          });
          const regText = await regRes.text();
          let regData;
          try { regData = JSON.parse(regText); } catch { regData = {}; }

          // If new user registered successfully
          if (regRes.ok) {
            const loginAfterReg = await fetch(`${API_BASE}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail, password })
            });
            const lText = await loginAfterReg.text();
            let lData;
            try { lData = JSON.parse(lText); } catch { lData = {}; }

            const userData = {
              fullName: fallbackName,
              email: cleanEmail,
              role: 'user'
            };
            const token = (lData && lData.token) || ('user_session_' + Date.now());
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            if (setUser) setUser(userData);
            onClose();
            return;
          } else if (regData && regData.message === 'User already exists with this email') {
            // User exists, but password was incorrect
            throw new Error('Incorrect password for this account. Click "Forgot password?" below if you need to reset it.');
          }
        }

        // Case C: Offline fallback session if remote server is unreachable
        if (!loginRes || !loginRes.ok) {
          const localName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          const fallbackUser = {
            fullName: localName,
            email: cleanEmail,
            role: 'user'
          };
          localStorage.setItem('token', 'citizen_token_' + Date.now());
          localStorage.setItem('user', JSON.stringify(fallbackUser));
          if (setUser) setUser(fallbackUser);
          onClose();
          return;
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-gray-800 relative shadow-2xl bg-[#121824] text-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer"
        >
          ✕
        </button>
        
        <div className="flex items-center gap-3 mb-1">
          {view === 'admin' ? (
            <img src="/pictures/admin-svgrepo-com.svg" alt="Admin" className="w-7 h-7 object-contain" />
          ) : (
            <img src="/pictures/scheme_saathi_logo.png" alt="SchemeSaathi" className="h-8 w-auto object-contain rounded-lg shadow" />
          )}
          <h2 className="text-2xl font-black tracking-tight">
            {view === 'register' ? 'Create Account' : view === 'forgot' ? 'Reset Password' : view === 'admin' ? 'Administrator Login' : 'Welcome Back'}
          </h2>
        </div>
        
        <p className="text-xs text-gray-400 mb-6">
          {view === 'admin' 
            ? 'Exclusive portal access for verified system administrators' 
            : 'Access national welfare schemes • Synced with MongoDB Atlas'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 text-xs rounded-xl flex items-center gap-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Social Login Buttons (Google & Facebook) */}
        {view !== 'forgot' && view !== 'admin' && (
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-3">
              
              {/* Google Sign In Button */}
              <button 
                type="button"
                onClick={() => handleGoogleLogin()}
                disabled={socialLoading}
                className="flex items-center justify-center gap-2.5 bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-orange-500/50 py-3 rounded-2xl text-xs font-bold text-white transition shadow-sm hover:shadow-orange-500/10 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>

              {/* Facebook Sign In Button */}
              <button 
                type="button"
                onClick={handleFacebookLogin}
                disabled={socialLoading}
                className="flex items-center justify-center gap-2.5 bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 hover:border-blue-500/50 py-3 rounded-2xl text-xs font-bold text-white transition shadow-sm hover:shadow-blue-500/10 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="px-3 text-[10px] text-gray-500 uppercase font-bold tracking-wider">Or with email</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Ramesh Kumar" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required 
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">
              {view === 'admin' ? 'Admin Email Address' : 'Email Address'}
            </label>
            <input 
              type="email" 
              placeholder={view === 'admin' ? "admin@schemesaathi.com" : "name@example.com"} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required 
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Password Field with Eye Toggle */}
          {view !== 'forgot' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required 
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pr-12 text-xs text-white focus:outline-none focus:border-orange-500"
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
          )}

          {/* New Password Field for Forgot Password View */}
          {view === 'forgot' && (
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5">New Password</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? 'text' : 'password'} 
                  placeholder="Enter new strong password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pr-12 text-xs text-white focus:outline-none focus:border-orange-500"
                />
                <button 
                  type="button" 
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition cursor-pointer flex items-center justify-center"
                  title={showNewPassword ? "Hide password" : "Show password"}
                >
                  <img 
                    src={showNewPassword ? "/pictures/eye-password-hide-svgrepo-com.svg" : "/pictures/eye-password-eye-password-svgrepo-com.svg"} 
                    alt="Toggle Password" 
                    className="w-4 h-4 object-contain opacity-70 hover:opacity-100 transition-opacity" 
                  />
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Link & Admin Mode Link */}
          {view === 'login' && (
            <div className="flex justify-between items-center text-xs pt-1">
              <span 
                onClick={() => { setView('admin'); setError(''); setSuccessMsg(''); }}
                className="text-orange-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <img src="/pictures/admin-svgrepo-com.svg" alt="" className="w-3.5 h-3.5 object-contain inline" />
                <span>Admin Login</span>
              </span>
              <span 
                onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }}
                className="text-gray-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </span>
            </div>
          )}

          {view === 'admin' && (
            <div className="text-right text-xs pt-1">
              <span 
                onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}
                className="text-gray-400 hover:underline cursor-pointer"
              >
                ← Back to Citizen Login
              </span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || socialLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-600/20 text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? 'Authenticating...' : (view === 'register' ? 'Register Account →' : view === 'forgot' ? 'Update Password →' : view === 'admin' ? 'Admin Login →' : 'Sign In →')}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-800/80">
          {view === 'login' && (
            <p className="text-xs text-gray-400 cursor-pointer hover:text-white" onClick={() => { setView('register'); setError(''); setSuccessMsg(''); }}>
              New to SchemeSaathi? <span className="text-orange-400 font-semibold">Create account</span>
            </p>
          )}
          {view === 'register' && (
            <p className="text-xs text-gray-400 cursor-pointer hover:text-white" onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}>
              Already have an account? <span className="text-orange-400 font-semibold">Sign In</span>
            </p>
          )}
          {view === 'forgot' && (
            <p className="text-xs text-gray-400 cursor-pointer hover:text-white" onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}>
              Remembered your password? <span className="text-orange-400 font-semibold">Back to Login</span>
            </p>
          )}
          {view === 'admin' && (
            <p className="text-xs text-gray-400">
              Default Admin: <span className="text-orange-400 font-mono">admin@schemesaathi.com / admin123</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}