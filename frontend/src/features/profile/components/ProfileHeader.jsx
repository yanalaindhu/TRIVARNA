import React from "react";
import { Calendar, Flame, Award, Mail } from "lucide-react";

export default function ProfileHeader({ user }) {
  const { name, email, role, joinDate, streak, level } = user;

  // Generate initials for avatar fallback
  const getInitials = (userName) => {
    return userName
      ? userName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "TU";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Background glow decorator */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#F3F0FF] rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 w-full">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6C4CF1] to-[#8B6CFF] text-white flex items-center justify-center font-extrabold text-2xl shadow-md flex-shrink-0">
          {getInitials(name)}
        </div>

        {/* User details */}
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-950">{name}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#F3F0FF] text-[#6C4CF1] border border-[#6C4CF1]/10 self-center">
              {role}
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-sm text-gray-550">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-gray-400" />
              {email}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              Joined {joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Wellness Metrics (Level & Streak) */}
      <div className="flex gap-4 w-full md:w-auto justify-center">
        <div className="bg-[#F8F7FF] border border-[#6C4CF1]/10 rounded-xl px-4 py-3 text-center min-w-[100px] flex-1 md:flex-initial">
          <div className="flex items-center justify-center gap-1 text-[#6C4CF1] mb-0.5">
            <Award className="w-4.5 h-4.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Level</span>
          </div>
          <span className="text-2xl font-black text-gray-900">{level}</span>
        </div>

        <div className="bg-[#FFF8F5] border border-orange-200/50 rounded-xl px-4 py-3 text-center min-w-[100px] flex-1 md:flex-initial">
          <div className="flex items-center justify-center gap-1 text-orange-600 mb-0.5">
            <Flame className="w-4.5 h-4.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Streak</span>
          </div>
          <span className="text-2xl font-black text-gray-900">{streak} Days</span>
        </div>
      </div>
    </div>
  );
}
