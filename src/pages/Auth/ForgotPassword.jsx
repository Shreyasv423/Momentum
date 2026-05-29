import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, Activity } from 'lucide-react';
import { authService } from '../../services/auth';
import momentumLogo from '../../assets/momentumlogo.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');

    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authService.resetPassword(email);
      setMessage('A password reset link has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Reset Password</h1>
          <p className="text-sm text-gray-400 font-medium">We'll email you instructions to reset your password.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-sm text-red-300 text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-950/40 border border-green-500/30 rounded-2xl text-sm text-green-300 text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-neon-purple/10 disabled:opacity-50"
          >
            <KeyRound className="w-5 h-5" />
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
