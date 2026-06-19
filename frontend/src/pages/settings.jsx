import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { Settings as SettingsIcon, Bell, Lock, Smartphone, RefreshCw, LogOut, Globe, Moon } from "lucide-react";
import { useOnboardingStore } from "../store/onboardingStore";

export default function Settings() {
  const navigate = useNavigate();
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem("darkMode", String(nextDark));
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f8f8fc] text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-purple-600" />
            System Settings & Preferences
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure theme profiles and manage your onboarding assessment.
          </p>
        </div>

        <div className="max-w-2xl bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm space-y-8">

          {/* Theme & Localization */}
          <div>
            <h3 className="font-extrabold text-gray-800 text-sm mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600" />
              Localization & UI
            </h3>

            <div className="space-y-3">
              {/* Theme Mode */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div>
                  <p className="font-bold text-gray-800 text-xs">Dark Mode</p>
                  <p className="text-[10px] text-gray-400">Enable dark theme aesthetics.</p>
                </div>
                <button
                  onClick={handleToggleDarkMode}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    darkMode ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    darkMode ? "translate-x-6" : ""
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic & Onboarding Group */}
          <div>
            <h3 className="font-extrabold text-gray-800 text-sm mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              Onboarding & Diagnostics
            </h3>
            
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
              <div>
                <p className="font-bold text-gray-800 text-xs">Reset Onboarding Data</p>
                <p className="text-[10px] text-gray-400">Retake the full diagnostic assessment questionnaire to re-align your wellness scores and AI plan.</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to retake the onboarding assessment? This will update your wellness scores and generate a new AI routine schedule.")) {
                    resetOnboarding();
                    navigate("/onboarding");
                  }
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 cursor-pointer shadow-md shadow-purple-600/20 hover:-translate-y-[1px]"
              >
                Retake Assessment
              </button>
            </div>
          </div>

          {/* Session Cutoff */}
          <div className="border-t border-gray-100 pt-6 flex justify-between items-center">
            <span className="text-xs text-gray-400">Active session: {localStorage.getItem("email")}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs font-bold px-4 py-2.5 rounded-xl hover:shadow-md hover:shadow-red-500/10 transition-all duration-300 cursor-pointer shadow-sm hover:-translate-y-[1px]"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Account</span>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
