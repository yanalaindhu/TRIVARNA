import React from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Smile, Dumbbell, BookOpen } from "lucide-react";

export default function QuickActions({ onOpenCheckin }) {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Talk to AI Companion",
      icon: Bot,
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
      onClick: () => navigate("/chatbot"),
    },
    {
      label: "Log Daily Wellbeing",
      icon: Smile,
      color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
      onClick: onOpenCheckin,
    },
    {
      label: "Track Workout",
      icon: Dumbbell,
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
      onClick: () => navigate("/body"),
    },
    {
      label: "Log Journal Reflection",
      icon: BookOpen,
      color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
      onClick: () => navigate("/life"),
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
      <h3 className="font-bold text-gray-800 text-lg mb-4">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={act.onClick}
              className={`
                flex items-center space-x-3 p-4 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer
                ${act.color}
              `}
            >
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-left leading-tight">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}