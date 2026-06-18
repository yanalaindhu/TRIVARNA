import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Compass, 
  Brain, 
  Activity, 
  Sparkles, 
  Target, 
  Calendar, 
  Flame, 
  FileBarChart, 
  Settings as SettingsIcon, 
  User, 
  Bot,
  LayoutDashboard
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuGroups = [
    {
      title: "Core",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "AI Companion", path: "/chatbot", icon: Bot },
      ]
    },
    {
      title: "Wellbeing Dimensions",
      items: [
        { name: "Mind Overview", path: "/mind", icon: Brain },
        { name: "Body Tracker", path: "/body", icon: Activity },
        { name: "Soul & Habits", path: "/soul", icon: Sparkles },
      ]
    },
    {
      title: "Modules",
      items: [
        { name: "Goals Manager", path: "/goals", icon: Target },
        { name: "Habits Calendar", path: "/habits", icon: Calendar },
        { name: "Health Twin", path: "/health-twin", icon: Flame },
      ]
    },
    {
      title: "Account",
      items: [
        { name: "Analytics Reports", path: "/reports", icon: FileBarChart },
        { name: "Settings", path: "/settings", icon: SettingsIcon },
        { name: "Profile", path: "/profile", icon: User },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col p-5 sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="flex items-center space-x-2.5 mb-8 px-2">
        <div className="w-9 h-9 bg-purple-100 text-purple-600 border border-purple-200/50 rounded-xl flex items-center justify-center shadow-inner">
          <Compass className="w-5 h-5 stroke-[2]" />
        </div>
        <span className="text-xl font-black text-gray-800 tracking-tight">
          TRIVARNA
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto space-y-6 scrollbar-thin">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2 px-3">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const IconComponent = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <li key={itemIdx}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${isActive 
                          ? "bg-purple-50 text-purple-600 shadow-sm border-l-4 border-purple-600" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }
                      `}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Quick Info */}
      <div className="border-t border-gray-100 pt-4 mt-4 flex items-center space-x-3 px-2">
        <img
          src="https://i.pravatar.cc/40"
          className="w-9 h-9 rounded-full ring-2 ring-purple-100"
          alt="avatar"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-gray-800 truncate">Aarya Sharma</p>
          <p className="text-[10px] text-gray-400 truncate">{localStorage.getItem("email") || "aarya@trivarna.com"}</p>
        </div>
      </div>
    </aside>
  );
}