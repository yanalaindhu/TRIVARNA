import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { getProfile, updateProfile } from "../services/profileService";
import { useOnboardingStore } from "../store/onboardingStore";
import { User, Award, Flame, Edit3, Save, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", // female 1
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80", // male 1
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", // female 2
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", // male 2
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80", // female 3
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"  // male 3
];

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileName, setProfileName] = useState("Explorer");
  const [occupation, setOccupation] = useState("Product Designer");
  const [age, setAge] = useState(28);
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem("trivarna_avatar_url") || AVATAR_PRESETS[0]
  );
  const [stats, setStats] = useState({ active_days: 0, current_streak: 0, badges_unlocked: 0 });
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email") || "user@trivarna.com";

  const fetchProfile = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile(userId);
      if (data.success) {
        setProfileName(data.profile.full_name || "Explorer");
        setOccupation(data.profile.occupation || "Product Designer");
        setAge(data.profile.age || 28);
        const avatar = data.profile.avatar_url || AVATAR_PRESETS[0];
        setSelectedAvatar(avatar);
        localStorage.setItem("trivarna_avatar_url", avatar);
        localStorage.setItem("trivarna_full_name", data.profile.full_name || "Explorer");
        setStats(data.stats || { active_days: 0, current_streak: 0, badges_unlocked: 0 });
        setAchievements(data.achievements || []);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await updateProfile(userId, {
        full_name: profileName,
        occupation,
        age,
        avatar_url: selectedAvatar
      });
      if (res.success) {
        localStorage.setItem("trivarna_avatar_url", selectedAvatar);
        localStorage.setItem("trivarna_full_name", profileName);
        setEditing(false);
        fetchProfile();
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Error saving profile details.");
      setLoading(false);
    }
  };

  const getIconForAchievement = (title) => {
    if (title === "Streak Master") return Flame;
    return Award;
  };

  if (loading && achievements.length === 0 && stats.active_days === 0) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading Profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8fc] text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <User className="w-8 h-8 text-purple-600" />
            User Profile & Streaks
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal profile, check your streaks, and trace your wellbeing achievements.
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center max-w-lg mx-auto space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="text-lg font-bold text-gray-800">Failed to Load Profile</h2>
            <p className="text-sm text-gray-600">{error}</p>
            <button 
              onClick={fetchProfile}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm w-full cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Details Card (Col span 1) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm flex flex-col justify-between items-center text-center h-fit">
              <div className="w-full flex flex-col items-center">
                <img
                  src={selectedAvatar}
                  className="w-24 h-24 rounded-full ring-4 ring-purple-100 mb-4 shadow-sm object-cover"
                  alt="profile"
                />

                {editing ? (
                  <div className="w-full space-y-3 mt-2">
                    {/* Avatar selection grid */}
                    <div className="w-full mb-3 text-left">
                      <label className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider block">Choose Avatar</label>
                      <div className="grid grid-cols-6 gap-2">
                        {AVATAR_PRESETS.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            onClick={() => setSelectedAvatar(url)}
                            className={`w-8 h-8 rounded-full cursor-pointer ring-2 object-cover transition-all ${
                              selectedAvatar === url ? "ring-purple-600 scale-105" : "ring-transparent hover:ring-purple-200"
                            }`}
                            alt={`preset-${idx}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-purple-500 font-bold"
                        required
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Occupation</label>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-purple-500 text-gray-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Age</label>
                      <input
                        type="number"
                        value={age}
                        placeholder="e.g. 28"
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-purple-500 text-gray-500 font-bold"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-800">{profileName}</h2>
                    <p className="text-xs text-gray-500 mt-1">{occupation}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Age: {age} years old</p>
                  </>
                )}

                <p className="text-xs text-gray-400 mt-3.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  {email}
                </p>
              </div>

              <div className="w-full border-t border-gray-100 pt-5 mt-6">
                {editing ? (
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 cursor-pointer w-full shadow-md shadow-purple-600/20 hover:-translate-y-[1px]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                ) : (
                  <div className="space-y-2.5 w-full">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center justify-center gap-2 border border-purple-200 hover:bg-purple-50 text-purple-600 text-xs font-bold px-4 py-2.5 rounded-xl hover:shadow-md hover:shadow-purple-600/10 transition-all duration-300 cursor-pointer w-full hover:-translate-y-[1px]"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile Details</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to retake the onboarding assessment? This will reset your current answers and generate new AI plans.")) {
                          useOnboardingStore.getState().resetOnboarding();
                          navigate("/onboarding");
                        }
                      }}
                      className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer w-full"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                      <span>Retake Diagnostic Assessment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Streaks & Achievements (Col span 2) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Stats Dashboard */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 text-center">
                  <span className="text-gray-400 text-[10px] font-bold uppercase block mb-1">Active Days</span>
                  <span className="text-3xl font-extrabold text-purple-600">{stats.active_days}</span>
                  <p className="text-[9px] text-gray-400 mt-0.5">Total logged time</p>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 text-center">
                  <span className="text-gray-400 text-[10px] font-bold uppercase block mb-1">Current Streak</span>
                  <span className="text-3xl font-extrabold text-orange-500">{stats.current_streak}</span>
                  <p className="text-[9px] text-gray-400 mt-0.5">Days in a row</p>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 text-center">
                  <span className="text-gray-400 text-[10px] font-bold uppercase block mb-1">Achievements</span>
                  <span className="text-3xl font-extrabold text-emerald-600">{stats.badges_unlocked}</span>
                  <p className="text-[9px] text-gray-400 mt-0.5">Badges unlocked</p>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
                <h3 className="font-extrabold text-gray-800 text-lg mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Achievements Badges Unlocked
                </h3>

                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((ach, idx) => {
                      const Icon = getIconForAchievement(ach.title);
                      return (
                        <div key={idx} className={`p-4 rounded-2xl border flex gap-4 items-start ${ach.color} transition hover:scale-[1.01] duration-200`}>
                          <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-xs">{ach.title}</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{ach.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Award className="w-10 h-10 text-purple-400/50 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs">No achievements unlocked yet.</p>
                    <p className="text-[9px] text-gray-400 mt-1">Keep logging daily check-ins, sleep, and hydration goals to unlock badges!</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
