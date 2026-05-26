import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressRing({ percentage = 0 }) {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background track circle */}
        <circle
          stroke="rgba(255, 255, 255, 0.04)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius * 1.6}
          cy={radius * 1.6}
        />
        
        {/* Neon Glow Circle */}
        <motion.circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius * 1.6}
          cy={radius * 1.6}
          className="transition-all duration-700 ease-out"
          filter="url(#glowFilter)"
        />

        {/* Gradients and Filters definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#9d4edd" />
          </linearGradient>
          <filter id="glowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      {/* Inner Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white tracking-tight text-glow-blue">
          {Math.round(percentage)}%
        </span>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
          Progress
        </span>
      </div>
    </div>
  );
}
