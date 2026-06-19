import React from "react";
import { BrainCircuit, Moon, Zap, Shield, Trophy, Compass, Award } from "lucide-react";

export default function AchievementBadges({ scores, insights }) {
  const { mindScore, bodyScore, lifestyleScore, overallScore } = scores;
  const { burnoutRisk } = insights;

  const earnedBadges = [];

  if (mindScore >= 80) {
    earnedBadges.push({
      name: "Focus Builder",
      description: "Exceptional mental clarity & cognitive stamina.",
      color: "bg-blue-50 text-blue-800 border-blue-200/50",
      icon: BrainCircuit,
      iconBg: "bg-blue-100 text-blue-600",
    });
  }

  if (bodyScore >= 80) {
    earnedBadges.push({
      name: "Sleep Optimizer",
      description: "Optimal rest patterns & high physical energy.",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200/50",
      icon: Moon,
      iconBg: "bg-emerald-100 text-emerald-600",
    });
  }

  if (lifestyleScore >= 80) {
    earnedBadges.push({
      name: "Productivity Master",
      description: "Highly efficient habit execution & timing.",
      color: "bg-orange-50 text-orange-850 border-orange-200/50",
      icon: Zap,
      iconBg: "bg-orange-100 text-orange-600",
    });
  }

  const risk = (burnoutRisk || "").toLowerCase();
  if (risk === "low") {
    earnedBadges.push({
      name: "Stress Fighter",
      description: "Exceptional resilience & low burnout indicators.",
      color: "bg-purple-50 text-purple-800 border-purple-200/50",
      icon: Shield,
      iconBg: "bg-purple-100 text-purple-600",
    });
  }

  if (overallScore >= 85) {
    earnedBadges.push({
      name: "Wellness Champion",
      description: "Achieved an elite aggregated balance score.",
      color: "bg-amber-50 text-amber-900 border-amber-250/50",
      icon: Trophy,
      iconBg: "bg-amber-100 text-amber-600",
    });
  } else if (overallScore >= 60) {
    earnedBadges.push({
      name: "Wellness Explorer",
      description: "Completed baseline assessment & active tracking.",
      color: "bg-indigo-50 text-indigo-850 border-indigo-200/50",
      icon: Compass,
      iconBg: "bg-indigo-100 text-indigo-600",
    });
  }

  // Fallback if no badges earned yet
  if (earnedBadges.length === 0) {
    earnedBadges.push({
      name: "Wellness Journeyman",
      description: "Successfully initiated the TRIVARNA profile setup.",
      color: "bg-gray-50 text-gray-800 border-gray-200",
      icon: Compass,
      iconBg: "bg-gray-150 text-gray-500",
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5 hover:shadow-md transition-all duration-300">
      <div>
        <h3 className="font-extrabold text-lg text-gray-950">Achievements</h3>
        <p className="text-xs text-gray-500">Milestones unlocked via your scores</p>
      </div>

      <div className="flex flex-col gap-3.5">
        {earnedBadges.map((badge, idx) => {
          const IconComponent = badge.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 p-3 rounded-xl border ${badge.color} hover:scale-[1.01] transition-transform duration-200`}
            >
              <div className={`p-2.5 rounded-lg ${badge.iconBg} flex-shrink-0`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold">{badge.name}</h4>
                <p className="text-xs opacity-90 leading-tight">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
