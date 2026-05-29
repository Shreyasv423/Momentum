import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Activity } from 'lucide-react';
import { authService } from '../../services/auth';
import { useStore } from '../../hooks/useStore';
import momentumLogo from '../../assets/momentumlogo.png';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initApp = useStore(state => state.initApp);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return setError('Please fill in all fields');
    if (password.length < 6) return setError('Password must be at least 6 characters');

    setError('');
    setLoading(true);
    try {
      const user = await authService.signup(email, password, name);
      initApp(user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
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
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-20 h-20 flex items-center justify-center mb-3"
          >
            <img src={momentumLogo} alt="Momentum Logo" className="w-full h-full object-contain" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Join Momentum</h1>
          <p className="text-sm text-gray-400 font-medium">Build consistency. Achieve discipline.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-sm text-red-300 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-bg/60 border border-dark-border focus:border-neon-purple/60 focus:ring-1 focus:ring-neon-purple/60 transition-all rounded-2xl py-3.5 pl-12 pr-4 outline-none text-sm text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-bg/60 border border-dark-border focus:border-neon-purple/60 focus:ring-1 focus:ring-neon-purple/60 transition-all rounded-2xl py-3.5 pl-12 pr-4 outline-none text-sm text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-bg/60 border border-dark-border focus:border-neon-purple/60 focus:ring-1 focus:ring-neon-purple/60 transition-all rounded-2xl py-3.5 pl-12 pr-4 outline-none text-sm text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple/90 hover:to-neon-blue/90 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-neon-blue/10 disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-neon-blue font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
