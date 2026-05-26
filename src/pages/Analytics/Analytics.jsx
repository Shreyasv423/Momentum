import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, BookOpen, Clock, Award } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import Header from '../../components/ui/Header';

export default function Analytics() {
  const { tasks, focusSessions, streak, leetcodeStats } = useStore();

  // 1. Calculate general stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  // 2. Weekly Completion Data (last 7 days)
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];
      
      // Count completed tasks on this date (history) or mock if guest has no history
      const completedOnDay = streak.history && streak.history[dateStr] ? 3 : (i === 0 ? completedTasks : Math.floor(Math.random() * 4) + 1);
      
      data.push({
        name: dayName,
        completed: completedOnDay
      });
    }
    return data;
  };

  // 3. Category Breakdown Data
  const getCategoryData = () => {
    const counts = {};
    tasks.forEach((t) => {
      if (t.completed) {
        counts[t.category] = (counts[t.category] || 0) + 1;
      }
    });

    // Provide default mockup data if no categories completed
    const data = Object.keys(counts).map((cat) => ({
      name: cat,
      value: counts[cat]
    }));

    if (data.length === 0) {
      return [
        { name: 'DSA', value: 8 },
        { name: 'Gym', value: 5 },
        { name: 'Work', value: 7 },
        { name: 'Study', value: 4 },
        { name: 'Personal', value: 3 }
      ];
    }
    return data;
  };

  // 4. Monthly Productivity data (Mock trends for premium dashboard)
  const monthlyData = [
    { name: 'Jan', rating: 65 },
    { name: 'Feb', rating: 72 },
    { name: 'Mar', rating: 78 },
    { name: 'Apr', rating: 85 },
    { name: 'May', rating: 92 }
  ];

  const COLORS = ['#00d2ff', '#9d4edd', '#ff007f', '#22c55e', '#eab308', '#3b82f6', '#6366f1'];

  return (
    <div className="flex-1 pb-24 lg:pb-8 lg:pl-64 min-h-screen bg-dark-bg text-gray-100 select-none">
      <Header title="Performance Analytics" />

      <main className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
              Completion Rate
            </span>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {completionRate}%
              </span>
              <span className="text-xs text-green-400 font-bold ml-1.5 flex inline-flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +4.2%
              </span>
            </div>
          </div>

          <div className="glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
              Focus Hours
            </span>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-neon-blue text-glow-blue">
                {totalFocusHours}
              </span>
              <span className="text-xs text-gray-500 font-bold ml-1">hrs</span>
            </div>
          </div>

          <div className="glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
              LeetCode Solved
            </span>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-yellow-500">
                {leetcodeStats.solvedTotal || 0}
              </span>
              <span className="text-xs text-gray-500 font-bold ml-1">problems</span>
            </div>
          </div>

          <div className="glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">
              Longest Streak
            </span>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-400">
                {streak.longestStreak || 0}
              </span>
              <span className="text-xs text-gray-500 font-bold ml-1">days</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Weekly Task Completion Chart */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-neon-blue" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Weekly Routine Consistency
              </h3>
            </div>
            
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getWeeklyData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(12,12,30,0.85)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed Routines"
                    stroke="#00d2ff"
                    fillOpacity={1}
                    fill="url(#areaBlue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Pie Breakdown */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neon-purple" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Routine Breakdown
              </h3>
            </div>

            <div className="h-52 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(12,12,30,0.85)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute text-center">
                <p className="text-xl font-extrabold text-white">{completedTasks || 27}</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Done</p>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-semibold px-2">
              {getCategoryData().map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Focus Trend & DSA statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Focus Trend */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neon-pink" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Productivity Index Trend
              </h3>
            </div>

            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(12,12,30,0.85)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px'
                    }}
                  />
                  <Bar dataKey="rating" name="Efficiency %" fill="#ff007f" radius={[8, 8, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#pinkGradient)" />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff007f" />
                      <stop offset="100%" stopColor="#9d4edd" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DSA Analytics Card */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Award className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                DSA consistency metrics
              </h3>
            </div>

            {leetcodeStats.username ? (
              <div className="space-y-4 flex-grow flex flex-col justify-around">
                {/* DSA Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                      <span>Easy Solved</span>
                      <span className="text-green-400 font-bold">{leetcodeStats.solvedEasy}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min(100, (leetcodeStats.solvedEasy / 200) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                      <span>Medium Solved</span>
                      <span className="text-yellow-400 font-bold">{leetcodeStats.solvedMedium}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${Math.min(100, (leetcodeStats.solvedMedium / 150) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                      <span>Hard Solved</span>
                      <span className="text-red-400 font-bold">{leetcodeStats.solvedHard}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${Math.min(100, (leetcodeStats.solvedHard / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-dark-bg/60 border border-dark-border p-3.5 rounded-2xl text-center text-xs font-medium text-gray-400">
                  Daily Solved targets: <span className="text-yellow-500 font-extrabold">{leetcodeStats.dsaStreak} days consistency streak</span> 🔥
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-center items-center text-center py-6">
                <p className="text-gray-400 text-xs font-semibold">LeetCode profile not linked</p>
                <p className="text-gray-500 text-[10px] mt-1 max-w-[200px]">
                  Link your username in Settings or Dashboard to visualize DSA consistency stats!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
