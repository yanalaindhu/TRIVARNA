import React from "react";
import { Sun, Sunset, Moon, Compass, Clock, Sparkles } from "lucide-react";

export default function AIPlanPreview({ aiPlan }) {
  const { wakeTime, sleepTarget, schedule = [] } = aiPlan;

  // Map periods to icons & colors
  const periodConfig = {
    Morning: { icon: Sun, color: "text-amber-500 bg-amber-50 border-amber-100" },
    Afternoon: { icon: Compass, color: "text-blue-500 bg-blue-50 border-blue-100" },
    Evening: { icon: Sunset, color: "text-orange-500 bg-orange-50 border-orange-100" },
    Night: { icon: Moon, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  };

  // Tag color helper
  const getItemTagStyle = (type) => {
    const t = (type || "").toLowerCase();
    if (t === "mindfulness" || t === "mind") return "bg-purple-100 text-purple-700 border border-purple-200";
    if (t === "work") return "bg-red-50 text-red-700 border border-red-100 font-semibold";
    if (t === "exercise" || t === "body") return "bg-green-100 text-green-700 border border-green-200";
    if (t === "break" || t === "rest") return "bg-amber-100 text-amber-700 border border-amber-200";
    if (t === "sleep") return "bg-indigo-100 text-indigo-700 border border-indigo-200";
    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#6C4CF1] text-white rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-gray-950">Personalized daily plan</h3>
            <p className="text-xs text-gray-500">AI-optimized schedule nodes</p>
          </div>
        </div>

        {/* Quick info badges */}
        <div className="flex gap-2 text-xs">
          <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400 font-medium">Wake: </span>
            <span className="font-extrabold text-gray-800">{wakeTime}</span>
          </div>
          <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400 font-medium">Sleep: </span>
            <span className="font-extrabold text-gray-800">{sleepTarget}</span>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedule.map((periodObj) => {
          const cfg = periodConfig[periodObj.period] || periodConfig.Morning;
          const PeriodIcon = cfg.icon;

          return (
            <div
              key={periodObj.period}
              className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:shadow-sm hover:border-gray-250 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Period Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-150/40 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${cfg.color} flex-shrink-0`}>
                      <PeriodIcon className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-800">
                      {periodObj.period}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-gray-550 bg-gray-150/50 px-2 py-0.5 rounded-full flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {periodObj.time}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3.5">
                  {periodObj.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2.5 text-xs sm:text-sm">
                      <span className="text-[10px] font-bold text-[#6C4CF1] bg-[#F3F0FF] px-2 py-0.5 rounded border border-[#6C4CF1]/10 flex-shrink-0 mt-0.5 min-w-[65px] text-center">
                        {item.time}
                      </span>
                      <div className="flex-1 space-y-1">
                        <span className="text-gray-900 leading-normal font-medium block">
                          {item.label}
                        </span>
                        {item.type && (
                          <span className={`inline-block text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full ${getItemTagStyle(item.type)}`}>
                            {item.type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {periodObj.items.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No tasks scheduled.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
