import React from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, Flame, Trash2, Edit3, CheckCircle, Circle } from 'lucide-react';

const categoryColors = {
  DSA: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Study: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Gym: 'bg-red-500/10 text-red-400 border-red-500/20',
  Work: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Health: 'bg-green-500/10 text-green-400 border-green-500/20',
  Personal: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Revision: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const priorityColors = {
  High: 'bg-red-500/20 text-red-300 border-red-500/30',
  Medium: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const { id, title, description, category, time, repeat, priority, completed, streakCount } = task;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className={`glass rounded-2xl p-4 flex items-start gap-3.5 border transition-all ${
        completed
          ? 'bg-dark-bg/20 border-dark-border/40 opacity-60'
          : 'hover:border-white/10 hover:shadow-lg shadow-black/20'
      }`}
    >
      {/* Complete Checkbox Button */}
      <button
        onClick={() => onToggle(id)}
        className="mt-1 text-gray-500 hover:text-neon-blue transition-colors focus:outline-none flex-shrink-0"
      >
        {completed ? (
          <CheckCircle className="w-5 h-5 text-neon-blue fill-neon-blue/15" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400 hover:text-white" />
        )}
      </button>

      {/* Task Details */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`text-sm font-bold truncate ${
              completed ? 'text-gray-500 line-through' : 'text-white'
            }`}
          >
            {title}
          </h4>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 lg:opacity-100">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {description && (
          <p className={`text-xs text-gray-400 mt-1 leading-relaxed ${completed ? 'line-through text-gray-600' : ''}`}>
            {description}
          </p>
        )}

        {/* Footer Badges & Metadata */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5">
          {/* Category Badge */}
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
              categoryColors[category] || 'bg-white/5 text-gray-300 border-white/10'
            }`}
          >
            {category}
          </span>

          {/* Priority Badge */}
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
              priorityColors[priority] || 'bg-white/5 text-gray-300'
            }`}
          >
            {priority}
          </span>

          {/* Time indicator */}
          {time && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              <Clock className="w-3 h-3 text-gray-500" />
              {time}
            </span>
          )}

          {/* Repeat Schedule */}
          {repeat && repeat !== 'None' && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              <RefreshCw className="w-3 h-3 text-gray-500" />
              {repeat}
            </span>
          )}

          {/* Streak indicator */}
          {streakCount > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] text-orange-400 font-extrabold bg-orange-950/20 border border-orange-500/25 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3 text-orange-500 flame-active" />
              <span>{streakCount} streak</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
