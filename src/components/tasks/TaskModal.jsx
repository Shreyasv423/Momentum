import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';

const categories = ['DSA', 'Study', 'Gym', 'Work', 'Health', 'Personal', 'Revision'];
const priorities = ['Low', 'Medium', 'High'];
const repeats = ['None', 'Daily', 'Weekdays', 'Weekends', 'Custom'];

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DSA');
  const [time, setTime] = useState('');
  const [repeat, setRepeat] = useState('None');
  const [priority, setPriority] = useState('Medium');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || 'DSA');
      setTime(taskToEdit.time || '');
      setRepeat(taskToEdit.repeat || 'None');
      setPriority(taskToEdit.priority || 'Medium');
    } else {
      setTitle('');
      setDescription('');
      setCategory('DSA');
      setTime('');
      setRepeat('None');
      setPriority('Medium');
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      category,
      time,
      repeat,
      priority,
      completed: taskToEdit ? taskToEdit.completed : false,
      streakCount: taskToEdit ? taskToEdit.streakCount : 0,
    };

    if (taskToEdit) {
      onSave(taskToEdit.id, taskData);
    } else {
      onSave(taskData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-dark-card border border-dark-border shadow-2xl rounded-3xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <h3 className="text-lg font-bold text-white">
                {taskToEdit ? 'Edit Task ✍️' : 'Create Task 📋'}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Solve 3 LeetCode Mediums"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 focus:ring-1 focus:ring-neon-blue/60 transition-all rounded-2xl py-3 px-4 outline-none text-sm text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  placeholder="Details or resources needed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 focus:ring-1 focus:ring-neon-blue/60 transition-all rounded-2xl py-3 px-4 outline-none text-sm text-white h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 transition-all rounded-2xl py-3 px-4 outline-none text-sm text-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 transition-all rounded-2xl py-3 px-4 outline-none text-sm text-white cursor-pointer"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 focus:ring-1 focus:ring-neon-blue/60 transition-all rounded-2xl py-3 px-4 outline-none text-sm text-white cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Repeat Schedule</label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border focus:border-neon-blue/60 transition-all rounded-2xl py-3 px-4 outline-none text-sm text-white cursor-pointer"
                  >
                    {repeats.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-dark-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-2xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white font-semibold rounded-2xl text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-neon-blue/10"
                >
                  {taskToEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {taskToEdit ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
