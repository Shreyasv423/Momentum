import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Code2, Trophy, Flame, UserPlus, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export default function LeetCodeWidget() {
  const { leetcodeStats, leetcodeLoading, updateLeetCodeUsername, refreshLeetCodeStats } = useStore();
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setError('');
    try {
      await updateLeetCodeUsername(usernameInput.trim());
    } catch (err) {
      setError('Could not connect. Try again or check the username.');
    }
  };

  const isConnected = !!leetcodeStats.username;

  return (
    <div className="glass rounded-3xl p-6 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Background Glow */}
      <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-yellow-500/10 rounded-full blur-[40px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-yellow-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">LeetCode Tracker</h3>
        </div>
        {isConnected && (
          <button
            onClick={refreshLeetCodeStats}
            disabled={leetcodeLoading}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${leetcodeLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {!isConnected ? (
        /* CONNECT VIEW */
        <div className="flex-grow flex flex-col justify-center py-4">
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Link your LeetCode profile to track solved problems, contest ratings, and maintain your DSA consistency streak.
          </p>
          <form onSubmit={handleConnect} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="LeetCode Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/60 transition-all rounded-2xl py-3 px-4 outline-none text-xs text-white"
                required
              />
            </div>
            {error && <p className="text-[10px] text-red-400 font-semibold">{error}</p>}
            <button
              type="submit"
              disabled={leetcodeLoading}
              className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {leetcodeLoading ? 'Connecting...' : 'Connect Profile'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-gray-500 mt-3 text-center font-medium">
            Don't have a profile? Use "<span className="text-yellow-500">test</span>" to load demo data.
          </p>
        </div>
      ) : (
        /* STATS VIEW */
        <div className="space-y-4 flex-grow flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <a
                href={`https://leetcode.com/${leetcodeStats.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-white hover:text-yellow-400 hover:underline flex items-center gap-1"
              >
                @{leetcodeStats.username}
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </a>
              <span className="text-[9px] text-gray-500 font-semibold">
                Rank: {leetcodeStats.ranking?.toLocaleString() || 'N/A'}
              </span>
            </div>
            
            {leetcodeStats.dsaStreak > 0 && (
              <div className="flex items-center gap-1.5 bg-orange-950/20 border border-orange-500/20 px-2 py-0.5 rounded-full text-xs font-bold text-orange-400">
                <Flame className="w-3.5 h-3.5 text-orange-500 flame-active" />
                <span>{leetcodeStats.dsaStreak} days</span>
              </div>
            )}
          </div>

          {/* Solved stats grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/5 rounded-2xl p-2.5 text-center">
              <p className="text-[10px] font-bold text-gray-400">Solved</p>
              <p className="text-base font-extrabold text-white mt-1">{leetcodeStats.solvedTotal}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/10 rounded-2xl p-2.5 text-center">
              <p className="text-[10px] font-bold text-green-400">Easy</p>
              <p className="text-base font-extrabold text-green-300 mt-1">{leetcodeStats.solvedEasy}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/10 rounded-2xl p-2.5 text-center">
              <p className="text-[10px] font-bold text-yellow-400">Medium</p>
              <p className="text-base font-extrabold text-yellow-300 mt-1">{leetcodeStats.solvedMedium}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/10 rounded-2xl p-2.5 text-center">
              <p className="text-[10px] font-bold text-red-400">Hard</p>
              <p className="text-base font-extrabold text-red-300 mt-1">{leetcodeStats.solvedHard}</p>
            </div>
          </div>

          {/* Contest & Submissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-dark-bg/60 border border-dark-border p-3 rounded-2xl text-xs font-medium">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Contest Rating
              </span>
              <span className="font-bold text-white">{leetcodeStats.contestRating || 'N/A'}</span>
            </div>

            {/* Recent Submissions list */}
            {leetcodeStats.recentSubmissions && leetcodeStats.recentSubmissions.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Recent Submissions</p>
                <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar">
                  {leetcodeStats.recentSubmissions.map((sub, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] bg-white/2 p-2 rounded-xl border border-white/2">
                      <span className="text-gray-300 truncate max-w-[140px] font-medium">{sub.title}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            sub.status === 'Accepted' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {sub.status}
                        </span>
                        <span className="text-gray-500 font-semibold">{sub.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
