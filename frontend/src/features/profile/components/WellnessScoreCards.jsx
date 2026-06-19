import React from "react";
import { Compass, BrainCircuit, Heart, Trophy, TrendingUp } from "lucide-react";

export default function WellnessScoreCards({ scores }) {
  const { mindScore, bodyScore, lifestyleScore, overallScore } = scores;

  // Helper to determine status and color schemes
  const getStatus = (score) => {
    if (score >= 90) return { text: "Excellent", textClass: "text-emerald-700", bgClass: "bg-emerald-50 border-emerald-100" };
    if (score >= 75) return { text: "Good", textClass: "text-[#6C4CF1]", bgClass: "bg-[#F3F0FF] border-[#6C4CF1]/15" };
    if (score >= 60) return { text: "Improving", textClass: "text-amber-700", bgClass: "bg-amber-50 border-amber-100" };
    return { text: "Needs Attention", textClass: "text-rose-700", bgClass: "bg-rose-50 border-rose-100" };
  };

  const scoreConfigs = [
    {
      title: "Overall Balance",
      score: overallScore,
      icon: Compass,
      colorClass: "from-[#6C4CF1] to-[#8B6CFF]",
      iconBg: "bg-purple-100 text-purple-600",
      description: "Aggregated health & habit index"
    },
    {
      title: "Mind Profile",
      score: mindScore,
      icon: BrainCircuit,
      colorClass: "from-blue-600 to-indigo-500",
      iconBg: "bg-blue-100 text-blue-600",
      description: "Stress recovery & emotion metrics"
    },
    {
      title: "Body Profile",
      score: bodyScore,
      icon: Heart,
      colorClass: "from-emerald-600 to-teal-500",
      iconBg: "bg-emerald-100 text-emerald-600",
      description: "Rest, hydration & physical energy"
    },
    {
      title: "Lifestyle Profile",
      score: lifestyleScore,
      icon: Trophy,
      colorClass: "from-orange-500 to-amber-500",
      iconBg: "bg-orange-100 text-orange-600",
      description: "Habit formation & daily execution"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {scoreConfigs.map((cfg) => {
        const status = getStatus(cfg.score);
        const Icon = cfg.icon;

        return (
          <div
            key={cfg.title}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Card Top */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {cfg.title}
                </span>
                <div className={`p-2 rounded-lg ${cfg.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Card Main Score */}
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-gray-900">{cfg.score}</span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
            </div>

            {/* Card Footer Status & Trend */}
            <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${status.bgClass} ${status.textClass}`}>
                {status.text}
              </span>
              <span className="flex items-center text-xs text-emerald-600 font-semibold gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+2.4%</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
