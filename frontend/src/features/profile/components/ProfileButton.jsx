import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { PROFILE_ROUTE } from "../constants/routes";

export default function ProfileButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(PROFILE_ROUTE)}
      className="flex items-center space-x-2 px-4 py-2 bg-[#F3F0FF] text-[#6C4CF1] border border-[#6C4CF1]/10 rounded-xl hover:bg-[#6C4CF1] hover:text-white transition-all duration-250 shadow-sm text-sm font-extrabold cursor-pointer"
    >
      <User className="w-4 h-4" />
      <span>View Profile</span>
    </button>
  );
}
