import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Bell,
  Code,
  Volume2,
  Trash2,
  Download,
  AlertOctagon,
  Moon,
  Sun,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import Header from '../../components/ui/Header';

export default function Settings() {
  const navigate = useNavigate();
  const {
    settings,
    updateSettings,
    resetProgress,
    leetcodeStats,
    updateLeetCodeUsername,
    tasks,
    streak,
    focusSessions,
    notifications,
    addSystemNotification
  } = useStore();

  const [usernameInput, setUsernameInput] = useState(settings.leetcodeUsername || leetcodeStats.username || '');
  const [leetcodeLoading, setLeetcodeLoading] = useState(false);
  const [leetcodeMessage, setLeetcodeMessage] = useState('');
  const [leetcodeError, setLeetcodeError] = useState('');

  const [permissionState, setPermissionState] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      addSystemNotification({
        title: 'Momentum Alerts Enabled! ⚡',
        body: 'You will now receive notifications for your milestones and timers.',
        type: 'milestone'
      });
      return;
    }
    const permission = await Notification.requestPermission();
    setPermissionState(permission);
    if (permission === 'granted') {
      addSystemNotification({
        title: 'Momentum Alerts Enabled! ⚡',
        body: 'You will now receive notifications for your milestones and timers.',
        type: 'milestone'
      });
    }
  };

  // Handle LeetCode link
  const handleSaveLeetCode = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setLeetcodeLoading(true);
    setLeetcodeMessage('');
    setLeetcodeError('');
    try {
      await updateLeetCodeUsername(usernameInput.trim());
      setLeetcodeMessage('Profile connected successfully! 🚀');
    } catch (err) {
      setLeetcodeError('Could not locate username. Verify spelling.');
    } finally {
      setLeetcodeLoading(false);
    }
  };

  // Sound toggle
  const handleSoundToggle = (e) => {
    updateSettings({ soundEnabled: e.target.checked });
  };

  // Reset Progress Handler
  const handleReset = async () => {
    const confirmReset = window.confirm(
      'ARE YOU SURE? This will permanently delete all tasks, routines, strengths history, focus session logs, and settings!'
    );
    if (confirmReset) {
      await resetProgress();
      alert('Application reset successfully.');
      navigate('/');
    }
  };

  // Export Data as JSON
  const handleExportData = () => {
    try {
      const dataToExport = {
        tasks,
        streak,
        focusSessions,
        notifications,
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataToExport, null, 2)
      )}`;
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `momentum_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="flex-1 pb-24 lg:pb-8 lg:pl-64 min-h-screen bg-dark-bg text-gray-100 select-none">
      <Header title="Preferences & Config" />

      <main className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Settings grid */}
        <div className="space-y-6">
          
          {/* Theme Preferences Card */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-neon-blue" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Theme Preferences
              </h3>
            </div>
            
            <div className="flex items-center justify-between p-3.5 bg-dark-bg/60 border border-dark-border rounded-2xl">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Default Dark Mode</p>
                <p className="text-[10px] text-gray-500">Momentum optimizes battery and screen glow automatically.</p>
              </div>
              <div className="flex items-center bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs text-neon-blue font-bold gap-1.5">
                <Moon className="w-3.5 h-3.5" /> Dark Enabled
              </div>
            </div>
          </div>

          {/* Sound & Notification Config */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-neon-purple" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sound & Reminders
              </h3>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-dark-bg/60 border border-dark-border rounded-2xl">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Audio Alerts</p>
                <p className="text-[10px] text-gray-500">Play oscillator bells when focus timers complete.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={handleSoundToggle}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-purple" />
              </label>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-dark-bg/60 border border-dark-border rounded-2xl">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Desktop Alerts</p>
                <p className="text-[10px] text-gray-500">Get native alerts for focus sessions, streaks, and achievements.</p>
              </div>
              <div>
                {permissionState === 'granted' ? (
                  <span className="text-xs text-neon-blue font-bold flex items-center gap-1 bg-neon-blue/10 border border-neon-blue/20 px-3 py-1.5 rounded-xl">
                    <ShieldCheck className="w-3.5 h-3.5" /> Enabled
                  </span>
                ) : permissionState === 'denied' ? (
                  <span className="text-xs text-red-400 font-bold flex items-center gap-1 bg-red-950/20 border border-red-500/20 px-3 py-1.5 rounded-xl" title="Enable notifications in browser settings">
                    Blocked ⚠️
                  </span>
                ) : (
                  <button
                    onClick={handleRequestPermission}
                    className="py-1.5 px-4 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white text-xs font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-neon-blue/10"
                  >
                    Enable Alerts
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LeetCode configuration */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                LeetCode Connection
              </h3>
            </div>

            <form onSubmit={handleSaveLeetCode} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="flex-grow bg-dark-bg border border-dark-border focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/60 transition-all rounded-2xl py-3 px-4 outline-none text-xs text-white"
                />
                <button
                  type="submit"
                  disabled={leetcodeLoading}
                  className="py-3 px-6 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {leetcodeLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Connect'}
                  Save Config
                </button>
              </div>

              {leetcodeMessage && <p className="text-[11px] text-green-400 font-bold">{leetcodeMessage}</p>}
              {leetcodeError && <p className="text-[11px] text-red-400 font-bold">{leetcodeError}</p>}
            </form>
          </div>

          {/* Backup & Risk operations */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Danger Zone & Backups
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Export Data */}
              <div className="p-4 bg-dark-bg/60 border border-dark-border rounded-2xl flex flex-col justify-between items-start gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Export Backups</p>
                  <p className="text-[10px] text-gray-500">Download all focus history and settings as JSON.</p>
                </div>
                <button
                  onClick={handleExportData}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-white/5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-neon-blue" /> Download Backup
                </button>
              </div>

              {/* Reset Data */}
              <div className="p-4 bg-red-950/10 border border-red-500/25 rounded-2xl flex flex-col justify-between items-start gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-red-300">Wipe Database</p>
                  <p className="text-[10px] text-red-400/70">Wipe all tasks, focus logs, and reset streaks to zero.</p>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 bg-red-950/45 hover:bg-red-500/20 text-red-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-red-500/30 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hard Reset
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
