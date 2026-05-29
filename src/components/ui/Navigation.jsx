import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Timer, BarChart3, Settings, LogOut, Flame } from 'lucide-react';
import { authService } from '../../services/auth';
import { useStore } from '../../hooks/useStore';
import momentumLogo from '../../assets/momentumlogo.png';

export default function Navigation() {
  const navigate = useNavigate();
  const initApp = useStore(state => state.initApp);
  const streak = useStore(state => state.streak);

  const handleLogout = async () => {
    await authService.logout();
    initApp(null);
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/focus', label: 'Focus', icon: Timer },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Sidebar - Desktop Layout (lg screens) */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-dark-border bg-dark-bg/80 backdrop-blur-xl p-6 justify-between z-30">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <img src={momentumLogo} alt="Momentum Logo" className="w-9 h-9 object-contain" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Momentum</h2>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Productivity OS</span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-neon-blue/15 to-neon-purple/5 border-l-4 border-neon-blue text-white shadow-inner shadow-neon-blue/5'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                          isActive ? 'text-neon-blue' : 'text-gray-400 group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="space-y-4">
          {/* Streak indicator */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-950/20 border border-orange-500/20">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-orange-500 flame-active" />
              <div>
                <p className="text-xs font-semibold text-gray-400">Current Streak</p>
                <p className="text-sm font-bold text-orange-400">{streak.currentStreak || 0} days</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Bottom Nav Bar - Mobile & Tablet Layout (hides on lg screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-dark-border bg-dark-bg/75 backdrop-blur-xl flex items-center justify-around px-2 pb-safe z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-150 ${
                  isActive ? 'text-neon-blue' : 'text-gray-400 hover:text-gray-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110 drop-shadow-[0_0_5px_rgba(0,210,255,0.4)]' : ''}`} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
