import React from "react";
import { Sparkles, ShieldAlert, Clock, Target, Check, AlertCircle } from "lucide-react";

export default function WellnessInsights({ insights }) {
  const {
    coachSummary,
    burnoutRisk,
    productiveWindow,
    primaryGoal,
    strengths = [],
    risks = [],
    focusAreas = []
  } = insights;

  // Set burnout color scheme
  const getBurnoutColors = (risk) => {
    const r = (risk || "Low").toLowerCase();
    if (r === "high") {
      return { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", label: "High Risk" };
    }
    if (r === "moderate" || r === "medium") {
      return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Moderate Risk" };
    }
    return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", label: "Low Risk" };
  };

  const bColor = getBurnoutColors(burnoutRisk);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Glow decorator */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-[#6C4CF1] text-white rounded-xl shadow-sm">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-extrabold text-lg text-gray-950">AI Coach Assessment</h3>
          <p className="text-xs text-gray-500">Intelligent balance synthesis</p>
        </div>
      </div>

      {/* Narrative */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Narrative Summary</h4>
        <p className="text-sm md:text-base text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
          "{coachSummary}"
        </p>
      </div>

      {/* Key stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className={`p-4 rounded-xl border flex flex-col justify-center ${bColor.bg} ${bColor.border}`}>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Burnout Status</span>
          <span className={`text-sm font-extrabold mt-1.5 flex items-center gap-1.5 ${bColor.text}`}>
            <ShieldAlert className="w-4 h-4" />
            {bColor.label}
          </span>
        </div>

        <div className="p-4 rounded-xl border border-gray-100 bg-white flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Productive Window</span>
          <span className="text-sm font-extrabold text-[#6C4CF1] mt-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#6C4CF1]" />
            <span className="truncate">{productiveWindow}</span>
          </span>
        </div>

        <div className="p-4 rounded-xl border border-gray-100 bg-white flex flex-col justify-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Target</span>
          <span className="text-sm font-extrabold text-[#8B6CFF] mt-1.5 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#8B6CFF]" />
            <span className="truncate">{primaryGoal.replace(/_/g, " ")}</span>
          </span>
        </div>
      </div>

      {/* Strengths & Risks */}
      {(strengths.length > 0 || risks.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          {strengths.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <span>👍 Dynamic Strengths</span>
              </h4>
              <ul className="space-y-2">
                {strengths.map((str, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-emerald-500 bg-emerald-50 p-0.5 rounded-full flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 font-bold" />
                    </span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {risks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                <span>⚠️ Growth Risks</span>
              </h4>
              <ul className="space-y-2">
                {risks.map((risk, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-rose-500 bg-rose-50 p-0.5 rounded-full flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 font-bold" />
                    </span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
