import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Play,
  TrendingUp,
  CheckCircle,
  Clock,
  Flame,
  PlusCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import Header from '../../components/ui/Header';
import ProgressRing from '../../components/dashboard/ProgressRing';
import LeetCodeWidget from '../../components/dashboard/LeetCodeWidget';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    streak,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompleted,
    leetcodeStats
  } = useStore();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Filter today's tasks
  const todayTasks = tasks; // Under simple state, showing active tasks. Can filter by repeat/creation if required, but showing user tasks for today is ideal.
  const completedTasks = todayTasks.filter((t) => t.completed);
  const pendingTasks = todayTasks.filter((t) => !t.completed);
  const completionPercentage =
    todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  const handleSaveTask = (taskId, taskData) => {
    if (typeof taskId === 'string') {
      updateTask(taskId, taskData);
    } else {
      addTask(taskId); // First param is taskData when adding
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  // Get motivational quote based on completion
  const getMotivationalText = () => {
    if (todayTasks.length === 0) return 'Add your first task to start building momentum! ⚡';
    if (completionPercentage === 100) return 'Perfect day! Massive momentum built today! 🔥';
    if (completionPercentage >= 75) return 'Almost there! Keep your momentum going 🔥';
    if (completionPercentage >= 50) return 'You are halfway! Stay focused 🧠';
    return 'Take one small action. Momentum builds from consistency. ⚡';
  };

  return (
    <div className="flex-1 pb-24 lg:pb-8 lg:pl-64 min-h-screen bg-dark-bg text-gray-100 select-none">
      <Header />

      <main className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        {/* Banner Greeting & Quote */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-premium rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="space-y-2 text-center md:text-left z-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Keep your momentum going 🔥
            </h2>
            <p className="text-sm text-gray-400 font-medium max-w-md">
              {getMotivationalText()}
            </p>
          </div>
          <div className="flex gap-3 relative z-10 w-full md:w-auto">
            <button
              onClick={handleOpenAddModal}
              className="flex-1 md:flex-initial py-3 px-5 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-neon-blue/10"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
            <button
              onClick={() => navigate('/focus')}
              className="flex-1 md:flex-initial py-3 px-5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 border border-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play className="w-4 h-4 text-neon-purple" /> Focus Session
            </button>
          </div>
        </motion.div>

        {/* Analytics Summary & Progress Circle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Circular Progress Ring Card */}
          <div className="glass rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-around gap-6 col-span-1 md:col-span-2">
            <ProgressRing percentage={completionPercentage} />
            <div className="space-y-4 flex-1">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider text-center sm:text-left">
                Daily Completion Progress
              </h3>
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-white/4 border border-white/5 rounded-2xl p-4 text-center sm:text-left">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-1 justify-center sm:justify-start">
                    <CheckCircle className="w-4 h-4 text-neon-blue" />
                    Completed
                  </span>
                  <span className="text-2xl font-extrabold text-white">
                    {completedTasks.length}
                  </span>
                  <span className="text-xs text-gray-500 font-bold ml-1">tasks</span>
                </div>

                <div className="bg-white/4 border border-white/5 rounded-2xl p-4 text-center sm:text-left">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-1 justify-center sm:justify-start">
                    <Clock className="w-4 h-4 text-neon-purple" />
                    Remaining
                  </span>
                  <span className="text-2xl font-extrabold text-white">
                    {pendingTasks.length}
                  </span>
                  <span className="text-xs text-gray-500 font-bold ml-1">tasks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Flame Summary */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-orange-500/10 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 flame-active" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Momentum Streaks
              </h3>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex justify-between items-center bg-dark-bg/60 border border-dark-border p-3 rounded-2xl">
                <span className="text-xs text-gray-400 font-semibold">Current Streak</span>
                <span className="text-lg font-extrabold text-orange-400 flex items-center gap-1">
                  {streak.currentStreak || 0} days <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                </span>
              </div>

              <div className="flex justify-between items-center bg-dark-bg/60 border border-dark-border p-3 rounded-2xl">
                <span className="text-xs text-gray-400 font-semibold">Longest Streak</span>
                <span className="text-lg font-extrabold text-white">
                  {streak.longestStreak || 0} days
                </span>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 font-semibold text-center italic mt-1">
              "Never break the chain."
            </p>
          </div>
        </div>

        {/* Tasks List & LeetCode widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Today's routines
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                  {todayTasks.length}
                </span>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs text-neon-blue hover:text-white font-bold flex items-center gap-1 transition-colors"
              >
                Manage Tasks <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
              {todayTasks.length === 0 ? (
                <div className="glass rounded-3xl p-10 text-center border-dashed border-dark-border flex flex-col items-center justify-center">
                  <Activity className="w-12 h-12 text-gray-600 mb-3 animate-pulse" />
                  <p className="text-gray-400 text-sm font-semibold">No tasks scheduled for today</p>
                  <p className="text-gray-500 text-xs mt-1">Add tasks to track routines and build your streak!</p>
                  <button
                    onClick={handleOpenAddModal}
                    className="mt-4 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/5 text-xs font-bold rounded-2xl flex items-center gap-2 transition-all"
                  >
                    <PlusCircle className="w-4 h-4 text-neon-blue" /> Create First Task
                  </button>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompleted}
                    onDelete={deleteTask}
                    onEdit={handleEditTask}
                  />
                ))
              )}
            </div>
          </div>

          {/* LeetCode stats */}
          <div className="col-span-1">
            <LeetCodeWidget />
          </div>
        </div>
      </main>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
