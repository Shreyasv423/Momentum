import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  SlidersHorizontal,
  Flame,
  Activity
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import Header from '../../components/ui/Header';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';

const categories = ['All', 'DSA', 'Study', 'Gym', 'Work', 'Health', 'Personal', 'Revision'];
const priorities = ['All', 'High', 'Medium', 'Low'];

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompleted } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  // Filtering & search states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Active, Completed

  const handleSaveTask = (taskId, taskData) => {
    if (typeof taskId === 'string') {
      updateTask(taskId, taskData);
    } else {
      addTask(taskId); // First param is taskData when adding
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Filter tasks based on filters and search queries
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Completed' && t.completed) ||
      (statusFilter === 'Active' && !t.completed);

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div className="flex-1 pb-24 lg:pb-8 lg:pl-64 min-h-screen bg-dark-bg text-gray-100 select-none">
      <Header title="Routines & Habits" />

      <main className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        {/* Filters Panel */}
        <div className="glass rounded-3xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search routines or habits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 focus:ring-1 focus:ring-neon-blue/60 transition-all rounded-2xl py-2.5 pl-11 pr-4 outline-none text-xs text-white"
              />
            </div>

            {/* Status tabs */}
            <div className="flex bg-dark-bg border border-dark-border p-1 rounded-2xl w-full md:w-auto">
              {['All', 'Active', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-neon-blue/15 to-neon-purple/10 text-white border border-neon-blue/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-white/5">
            {/* Category Filter */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                Filter by Category
              </span>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 transition-all rounded-2xl py-2.5 px-4 outline-none text-xs text-white cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority Filter */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                Filter by Priority
              </span>
              <div className="relative">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 transition-all rounded-2xl py-2.5 px-4 outline-none text-xs text-white cursor-pointer"
                >
                  {priorities.map((prio) => (
                    <option key={prio} value={prio}>
                      {prio}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Quick Action Info */}
            <div className="hidden md:flex items-end justify-end">
              <button
                onClick={handleOpenAddModal}
                className="py-2.5 px-5 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-neon-blue/15"
              >
                <Plus className="w-4 h-4" /> Add Routine
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Showing {filteredTasks.length} habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full glass rounded-3xl p-16 text-center border-dashed border-dark-border flex flex-col items-center justify-center"
                >
                  <Activity className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm font-semibold">No habits found</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Try adjusting your filters or create a new habit.
                  </p>
                  <button
                    onClick={handleOpenAddModal}
                    className="mt-4 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/5 text-xs font-bold rounded-2xl flex items-center gap-2 transition-all"
                  >
                    Create Habit
                  </button>
                </motion.div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompleted}
                    onDelete={deleteTask}
                    onEdit={handleEditTask}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAddModal}
          className="w-14 h-14 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center shadow-lg shadow-neon-blue/30 text-white"
        >
          <Plus className="w-7 h-7" />
        </motion.button>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
