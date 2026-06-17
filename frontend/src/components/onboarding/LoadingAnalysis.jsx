import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

const STAGES = [
  "Analyzing Mind Profile...",
  "Analyzing Body Profile...",
  "Analyzing Lifestyle Profile...",
  "Identifying Stress Patterns...",
  "Calculating Burnout Risk...",
  "Finding Productive Hours...",
  "Generating Personalized Daily Schedule...",
  "Generating Recommendations..."
];

export default function LoadingAnalysis() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    // We have 8 stages to show in 3 seconds. 3000ms / 8 = 375ms per stage.
    const interval = setInterval(() => {
      setActiveStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto py-8 px-4 flex flex-col items-center">
      {/* Dynamic Animated Pulse Sphere */}
      <div className="relative mb-8 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-24 h-24 bg-primary-purple rounded-full blur-xl"
        />
        <div className="w-16 h-16 bg-light-purple border border-primary-purple/20 rounded-2xl flex items-center justify-center shadow-inner relative z-10">
          <Loader2 className="w-8 h-8 text-primary-purple animate-spin" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-text-primary">TRIVARNA Engine Active</h3>
        <p className="text-sm text-text-secondary mt-1">Synthesizing your balance plan...</p>
      </div>

      {/* Checklist container */}
      <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStage;
          const isActive = idx === activeStage;

          return (
            <div
              key={stage}
              className={`flex items-center space-x-3 transition-opacity duration-300 ${
                isDone || isActive ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? 'bg-success-green text-white scale-110'
                    : isActive
                    ? 'bg-light-purple text-primary-purple border border-primary-purple/30 animate-pulse'
                    : 'bg-gray-100 border border-gray-200 text-transparent'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isActive ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-purple" />
                ) : null}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary-purple font-semibold' : isDone ? 'text-text-primary' : 'text-text-secondary'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress tracker line */}
      <div className="w-full h-1 bg-gray-100 rounded-full mt-8 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-full bg-primary-purple"
        />
      </div>
    </div>
  );
}
