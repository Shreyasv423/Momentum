import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Timer, Award, X, Sparkles } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export default function ToastContainer() {
  const toasts = useStore((state) => state.toasts || []);
  const removeToast = useStore((state) => state.removeToast);

  const getIcon = (type) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-neon-blue" />;
      case 'focus':
        return <Timer className="w-4 h-4 text-neon-pink" />;
      case 'milestone':
        return <Award className="w-4 h-4 text-yellow-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-neon-purple" />;
    }
  };

  const getBorderColorClass = (type) => {
    switch (type) {
      case 'task':
        return 'border-neon-blue/20 shadow-[0_0_15px_rgba(0,176,255,0.1)]';
      case 'focus':
        return 'border-neon-pink/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]';
      case 'milestone':
        return 'border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]';
      default:
        return 'border-neon-purple/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`pointer-events-auto w-full glass rounded-2xl p-4 flex items-start gap-3 border ${getBorderColorClass(
              toast.type
            )} bg-[#0d0d21]/95 backdrop-blur-xl relative overflow-hidden`}
          >
            {/* Glowing Accent Bar */}
            <div className={`absolute top-0 left-0 w-1 h-full ${
              toast.type === 'task' ? 'bg-neon-blue' :
              toast.type === 'focus' ? 'bg-neon-pink' :
              toast.type === 'milestone' ? 'bg-yellow-500' : 'bg-neon-purple'
            }`} />

            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>

            {/* Content */}
            <div className="flex-grow space-y-0.5 pr-2">
              <h4 className="text-xs font-bold text-white tracking-wide">
                {toast.title}
              </h4>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
