import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Flame, CheckCircle, BarChart, Settings, Clock, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import Header from '../../components/ui/Header';

export default function Focus() {
  const { focusSessions, addFocusSession, settings, updateSettings } = useStore();
  const [timerMode, setTimerMode] = useState('Focus'); // Focus (25), Deep (50), Custom
  const [customMinutes, setCustomMinutes] = useState(25);
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const timerRef = useRef(null);

  // Sound toggles
  const soundEnabled = settings.soundEnabled;
  const toggleSound = () => updateSettings({ soundEnabled: !soundEnabled });

  // Get duration based on mode
  const getDuration = (mode) => {
    if (mode === 'Focus') return 25 * 60;
    if (mode === 'Deep') return 50 * 60;
    return customMinutes * 60;
  };

  // Reset Timer when mode changes
  useEffect(() => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = getDuration(timerMode);
    setTimeLeft(duration);
    setProgress(100);
  }, [timerMode, customMinutes]);

  // Timer Tick Logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          const nextVal = prev - 1;
          const totalDuration = getDuration(timerMode);
          setProgress((nextVal / totalDuration) * 100);
          return nextVal;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timerMode]);

  // Audio finish feedback
  const playAlarmSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch (e) {
      console.warn('Audio context alert issue:', e);
    }
  };

  const handleTimerComplete = async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const minutesFocused = Math.round(getDuration(timerMode) / 60);
    await addFocusSession(minutesFocused, timerMode);
    
    playAlarmSound();
    
    // Reset timer
    setTimeLeft(getDuration(timerMode));
    setProgress(100);
  };

  const handleToggleStart = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(getDuration(timerMode));
    setProgress(100);
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Statistics summaries
  const totalSessionsCount = focusSessions.length;
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  return (
    <div className="flex-1 pb-24 lg:pb-8 lg:pl-64 min-h-screen bg-dark-bg text-gray-100 select-none">
      <Header title="Deep Focus Mode" />

      <main className="p-4 sm:p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TIMER COLUMN */}
        <div className="md:col-span-2 glass rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Neon Glow Circle Background */}
          <div className="absolute inset-0 bg-radial-gradient from-neon-purple/5 to-transparent blur-3xl pointer-events-none" />

          {/* Mode select tabs */}
          <div className="flex bg-dark-bg border border-dark-border p-1 rounded-2xl w-full max-w-sm mb-10 relative z-10">
            {['Focus', 'Deep', 'Custom'].map((mode) => (
              <button
                key={mode}
                onClick={() => setTimerMode(mode)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  timerMode === mode
                    ? 'bg-gradient-to-r from-neon-purple/15 to-neon-blue/10 text-white border border-neon-purple/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode === 'Focus' ? 'Pomodoro (25m)' : mode === 'Deep' ? 'Deep Work (50m)' : 'Custom'}
              </button>
            ))}
          </div>

          {/* Custom Duration Input Drawer */}
          <AnimatePresence>
            {timerMode === 'Custom' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full max-w-sm mb-6 flex flex-col items-center space-y-2"
              >
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Duration (Minutes)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="180"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(parseInt(e.target.value))}
                    className="w-48 accent-neon-purple"
                  />
                  <span className="text-sm font-bold text-neon-purple bg-neon-purple/10 border border-neon-purple/20 px-3 py-1 rounded-xl">
                    {customMinutes} min
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Giant Countdown Clock */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-10">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                stroke="rgba(255, 255, 255, 0.03)"
                fill="transparent"
                strokeWidth="6"
                r="110"
                cx="128"
                cy="128"
              />
              <circle
                stroke={timerMode === 'Deep' ? 'url(#deepGlow)' : 'url(#focusGlow)'}
                fill="transparent"
                strokeWidth="8"
                strokeDasharray="691"
                strokeDashoffset={691 - (progress / 100) * 691}
                strokeLinecap="round"
                r="110"
                cx="128"
                cy="128"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="focusGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00b0ff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="deepGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Timer readout */}
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-extrabold text-white tracking-tighter text-glow-purple">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">
                {isActive ? 'Staying Focused' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={toggleSound}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              title={soundEnabled ? 'Mute alert' : 'Unmute alert'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-neon-blue" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
            </button>

            <button
              onClick={handleToggleStart}
              className={`w-36 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md ${
                isActive
                  ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue/20'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" /> Focus
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              title="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* FOCUS HISTORY SIDEBAR */}
        <div className="col-span-1 space-y-6">
          {/* Summary Card */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-neon-blue" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Focus Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/4 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                  Sessions
                </span>
                <span className="text-2xl font-extrabold text-white">
                  {totalSessionsCount}
                </span>
              </div>
              <div className="bg-white/4 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
                  Hours
                </span>
                <span className="text-2xl font-extrabold text-white text-glow-blue">
                  {totalFocusHours}
                </span>
              </div>
            </div>
          </div>

          {/* Session Logs */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Session Logs
                </h3>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {focusSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-xs">No deep work logs yet</p>
                  </div>
                ) : (
                  focusSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex justify-between items-center p-2.5 bg-white/3 rounded-xl border border-white/2"
                    >
                      <div>
                        <p className="text-[10px] font-bold text-white uppercase">
                          {session.mode} Session
                        </p>
                        <p className="text-[9px] text-gray-500">
                          {new Date(session.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-neon-blue">
                        +{session.durationMinutes}m
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
