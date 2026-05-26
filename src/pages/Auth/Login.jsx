import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserCheck, Activity } from 'lucide-react';
import { authService } from '../../services/auth';
import { useStore } from '../../hooks/useStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initApp = useStore(state => state.initApp);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Please fill in all fields');
    
    setError('');
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      initApp(user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      initApp(user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setError('');
    setLoading(true);
    // Setup a guest user object
    const guestUser = {
      uid: 'guest',
      email: 'guest@momentum.app',
      displayName: 'Momentum Builder',
      photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest'
    };
    initApp(guestUser);
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-dark-bg text-gray-100 select-none relative overflow-hidden">
      {/* Background Neon Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-neon-blue/15 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-neon-purple/15 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md glass-premium p-8 rounded-3xl relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-14 h-14 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center shadow-lg shadow-neon-blue/20 mb-4"
          >
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Momentum</h1>
          <p className="text-sm text-gray-400 font-medium italic">“Small actions. Massive momentum.”</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-sm text-red-300 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-bg/60 border border-dark-border focus:border-neon-blue/60 focus:ring-1 focus:ring-neon-blue/60 transition-all rounded-2xl py-3.5 pl-12 pr-4 outline-none text-sm text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-neon-blue hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-bg/60 border border-dark-border focus:border-neon-blue/60 focus:ring-1 focus:ring-neon-blue/60 transition-all rounded-2xl py-3.5 pl-12 pr-4 outline-none text-sm text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-neon-purple/10 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Entering...' : 'Log In'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-dark-border"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-xs font-bold uppercase">Or</span>
          <div className="flex-grow border-t border-dark-border"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="bg-dark-bg border border-dark-border hover:bg-gray-900/40 text-gray-200 text-sm font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-4 h-4 text-neon-blue" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.553 0-6.44-2.887-6.44-6.44s2.887-6.44 6.44-6.44c1.633 0 3.12.607 4.26 1.613l3.056-3.055C19.123 2.213 15.89 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.98 0 12.76-5.023 12.76-12.24 0-.74-.066-1.475-.194-2.185H12.24z" />
            </svg>
            Google
          </button>
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="bg-dark-bg border border-dark-border hover:bg-gray-900/40 text-gray-200 text-sm font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4 text-neon-purple" />
            Guest mode
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          New to Momentum?{' '}
          <Link to="/signup" className="text-neon-purple font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
