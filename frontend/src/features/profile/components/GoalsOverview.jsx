import React from "react";
import { Target, Compass, Sparkles } from "lucide-react";

export default function GoalsOverview({ goals }) {
  const { selectedGoals = [], primaryGoal = "", sixMonthVision = "" } = goals;

  // Format goal names to be human readable
  const formatGoalName = (goal) => {
    if (!goal) return "";
    return goal
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Glow decorator */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-[#8B6CFF] text-white rounded-xl shadow-sm">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-lg text-gray-950">Goal Architecture</h3>
          <p className="text-xs text-gray-500">Targets and long-term vision</p>
        </div>
      </div>

      {/* Primary Goal */}
      {primaryGoal && (
        <div className="bg-[#F8F7FF] border border-[#6C4CF1]/10 rounded-xl p-4 flex items-center space-x-3.5">
          <div className="p-2.5 bg-[#6C4CF1] text-white rounded-lg flex-shrink-0">
            <Compass className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Primary Target</span>
            <span className="text-sm font-extrabold text-gray-900">
              {formatGoalName(primaryGoal)}
            </span>
          </div>
        </div>
      )}

      {/* Selected Goals as Chips */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Focused Areas</span>
        <div className="flex flex-wrap gap-2">
          {selectedGoals.map((goal, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F3F0FF] text-[#6C4CF1] border border-[#6C4CF1]/5"
            >
              <Sparkles className="w-3 h-3 mr-1.5 text-[#8B6CFF]" />
              {formatGoalName(goal)}
            </span>
          ))}
          {selectedGoals.length === 0 && (
            <span className="text-xs text-gray-400 italic">No specific focus areas selected.</span>
          )}
        </div>
      </div>

      {/* 6 Month Vision */}
      {sixMonthVision && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">6-Month Vision Statement</span>
          <div className="relative border-l-4 border-[#6C4CF1] bg-gray-50 p-4 rounded-r-xl">
            <p className="text-xs sm:text-sm text-gray-750 italic leading-relaxed">
              "{sixMonthVision}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
