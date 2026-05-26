import React, { useState } from 'react';
import { Bell, Flame, X, Check, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../hooks/useStore';

export default function Header({ title }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, streak, notifications, readNotification, clearNotifications } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id) => {
    readNotification(id);
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning 🌅';
    if (hrs < 18) return 'Good Afternoon ☀️';
    return 'Good Evening 🌃';
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-dark-border bg-dark-bg/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Page Title / Greeting */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {title || getGreeting()}
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Mobile Streak FLAME */}
        <div className="flex lg:hidden items-center gap-1 bg-orange-950/20 border border-orange-500/20 px-2.5 py-1 rounded-full text-xs font-bold text-orange-400">
          <Flame className="w-4 h-4 text-orange-500 flame-active" />
          <span>{streak.currentStreak || 0}</span>
        </div>

        {/* Notifications Trigger */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all"
        >
          <Bell className="w-5 h-5 text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-neon-pink to-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-dark-bg">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <img
            src={user?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'guest'}`}
            alt="Profile Avatar"
            className="w-10 h-10 rounded-xl border border-dark-border bg-white/5"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white">{user?.displayName || 'Momentum Explorer'}</p>
            <p className="text-[10px] text-gray-500 font-medium">{user?.email || 'guest@momentum.app'}</p>
          </div>
        </div>
      </div>

      {/* Notifications Drawer */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-dark-card border-l border-dark-border shadow-2xl z-50 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neon-blue/15 text-neon-blue border border-neon-blue/30">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Notifications list */}
                <div className="space-y-3 overflow-y-auto no-scrollbar max-h-[calc(100vh-170px)]">
                  {notifications.length === 0 ? (
                    <div className="text-center py-10">
                      <ShieldAlert className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm font-semibold">All quiet here</p>
                      <p className="text-gray-500 text-xs mt-1">Activities will appear as they happen</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        layout
                        onClick={() => handleNotificationClick(notif.id)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          notif.read
                            ? 'bg-dark-bg/40 border-dark-border/40 opacity-70'
                            : 'bg-gradient-to-r from-neon-blue/5 to-transparent border-neon-blue/20 hover:border-neon-blue/40 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`text-sm font-bold ${notif.read ? 'text-gray-400' : 'text-white'}`}>
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2.5 h-2.5 rounded-full bg-neon-blue mt-1 flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{notif.body}</p>
                        <span className="text-[10px] text-gray-500 mt-2 block font-medium">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Clear all action */}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="w-full py-3 border border-red-500/20 bg-red-950/15 hover:bg-red-500/10 text-red-400 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All History
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
