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
import logo from "../assets/trivarna-logo.png";

import { getProfile } from "../services/profileService";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [profileData, setProfileData] = React.useState({
    fullName: localStorage.getItem("trivarna_full_name") || "Explorer",
    avatarUrl: localStorage.getItem("trivarna_avatar_url") || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  });

  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    getProfile(userId)
      .then((data) => {
        if (data.success && data.profile) {
          const name = data.profile.full_name || "Explorer";
          localStorage.setItem("trivarna_full_name", name);
          
          let avatar = localStorage.getItem("trivarna_avatar_url");
          if (!avatar) {
            avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
            localStorage.setItem("trivarna_avatar_url", avatar);
          }

          setProfileData({
            fullName: name,
            avatarUrl: avatar,
          });
        }
      })
      .catch((err) => console.error("Error loading sidebar profile:", err));
  }, []);

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
        { name: "Life & Habits", path: "/life", icon: Sparkles },
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
        <div className="w-10 h-10 flex items-center justify-center">
  <img
    src={logo}
    alt="Trivarna"
    className="w-full h-full object-contain"
  />
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
          src={profileData.avatarUrl}
          className="w-9 h-9 rounded-full ring-2 ring-purple-100 object-cover"
          alt="avatar"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-gray-800 truncate">{profileData.fullName}</p>
          <p className="text-[10px] text-gray-400 truncate">{localStorage.getItem("email") || "aarya@trivarna.com"}</p>
        </div>
      </div>
    </aside>
  );
}