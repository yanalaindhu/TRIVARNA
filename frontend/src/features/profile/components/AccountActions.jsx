import React from "react";
import { UserCog, Bell, Lock, Cpu, Download, ChevronRight } from "lucide-react";

export default function AccountActions() {
  const actions = [
    { label: "Edit Profile", icon: UserCog, desc: "Modify email, name, and role parameters" },
    { label: "Notification Settings", icon: Bell, desc: "Configure check-in reminders & AI alerts" },
    { label: "Privacy Settings", icon: Lock, desc: "Control data usage & sharing rules" },
    { label: "Connected Devices", icon: Cpu, desc: "Manage sync with health wearables & apps" },
    { label: "Export Data", icon: Download, desc: "Download full history in JSON format" },
  ];

  const handleActionClick = (label) => {
    alert(`${label} settings are currently in read-only mode (frontend demo).`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5 hover:shadow-md transition-all duration-300">
      <div>
        <h3 className="font-extrabold text-lg text-gray-950">Settings & Security</h3>
        <p className="text-xs text-gray-500">Configure profile parameters & data syncs</p>
      </div>

      <div className="divide-y divide-gray-100">
        {actions.map((act) => {
          const ActionIcon = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => handleActionClick(act.label)}
              className="w-full flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group text-left transition-colors duration-150"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2 bg-gray-50 text-gray-500 rounded-xl group-hover:bg-[#F3F0FF] group-hover:text-[#6C4CF1] transition-all duration-200">
                  <ActionIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-gray-900 group-hover:text-[#6C4CF1] transition-colors duration-150">
                    {act.label}
                  </span>
                  <span className="block text-xs text-gray-450 leading-normal font-normal">
                    {act.desc}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#6C4CF1] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
