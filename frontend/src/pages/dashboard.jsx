import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import CheckinModal from "../components/CheckinModal";
import api from "../services/api";
import { 
  Sparkles, 
  Compass, 
  Flame, 
  Plus, 
  Loader2, 
  ArrowRight, 
  Calendar, 
  Bot,
  Heart,
  Droplet,
  Coffee,
  Activity,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Dumbbell,
  Target
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Helper Circular Progress Component
const CircularProgress = ({ score, color, size = 80, strokeWidth = 7, label, status }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const colorClasses = {
    purple: { stroke: "#8b5cf6", trail: "#f3e8ff", text: "text-purple-600" },
    blue: { stroke: "#3b82f6", trail: "#dbeafe", text: "text-blue-600" },
    green: { stroke: "#10b981", trail: "#d1fae5", text: "text-emerald-600" },
    orange: { stroke: "#f59e0b", trail: "#fef3c7", text: "text-amber-600" },
  };

  const activeColor = colorClasses[color] || colorClasses.purple;

  return (
    <div className="flex flex-col items-center bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm hover:shadow-md transition duration-300 flex-1 min-w-[130px]">
      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">{label}</span>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={activeColor.trail}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={activeColor.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black text-gray-800">{score}</span>
        </div>
      </div>
      {status && (
        <span className={`mt-3.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
          status === "Excellent" ? "bg-green-50 text-emerald-600" :
          status === "Good" ? "bg-blue-50 text-blue-600" :
          status === "Moderate" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
        }`}>
          {status}
        </span>
      )}
    </div>
  );
};

// Helper Sparkline Card Component
const TrendCard = ({ title, value, status, data, color }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between flex-1 min-w-[150px]">
      <div>
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{title}</span>
        <div className="flex justify-between items-baseline mt-2 mb-3">
          <span className="text-lg font-black text-gray-800">{value}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{status}</span>
        </div>
      </div>
      <div className="h-8 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loadError, setLoadError] = useState(null);

  const userId = localStorage.getItem("userId");

  const loadDashboardData = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      // 1. Fetch main dashboard scores, latest checkin, and plans
      const response = await api.get(`/dashboard/${userId}`);
      setDashboard(response.data);
      
      const email = localStorage.getItem("email");
      setUserEmail(email || "user@trivarna.com");
      
      if (response.data?.profile?.full_name) {
        setUserName(response.data.profile.full_name);
      } else {
        setUserName(email ? email.split('@')[0] : "Aarya");
      }

      // 2. Fetch historic check-ins for the sparkline charts
      const checkinsRes = await api.get(`/checkins/${userId}`);
      if (checkinsRes.data) {
        setCheckins(checkinsRes.data.reverse()); // Chronological order
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setLoadError(err.response?.data?.detail || err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const handleCheckinSuccess = () => {
    loadDashboardData();
  };

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Synchronizing commands...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center p-6 text-center">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 max-w-md w-full space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800">Connection Error</h2>
          <p className="text-sm text-gray-600">{loadError}</p>
          <button 
            onClick={loadDashboardData}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm w-full cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const profile = dashboard?.profile || {};
  const plan = dashboard?.plan || {};
  const latestCheckin = dashboard?.latest_checkin || {};

  // Safe parsing of schedule tasks
  let scheduleTasks = [];
  try {
    if (plan && plan.schedule) {
      if (Array.isArray(plan.schedule)) {
        scheduleTasks = plan.schedule;
      } else if (typeof plan.schedule === "string") {
        scheduleTasks = JSON.parse(plan.schedule);
      }
    }
  } catch (e) {
    console.error("Failed to parse schedule tasks:", e);
  }

  // Get score ratings
  const getScoreRating = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Moderate";
    return "Poor";
  };

  // Default mock sparkline coordinates if history is short
  const defaultStressPoints = [{ value: 45 }, { value: 50 }, { value: 62 }, { value: 55 }, { value: 65 }];
  const defaultSleepPoints = [{ value: 6.8 }, { value: 7.5 }, { value: 6.2 }, { value: 7.0 }, { value: 7.2 }];
  const defaultActivityPoints = [{ value: 5000 }, { value: 6200 }, { value: 8500 }, { value: 7400 }, { value: 8245 }];
  const defaultMoodPoints = [{ value: 6 }, { value: 7 }, { value: 8 }, { value: 7 }, { value: 8 }];

  const getTrendData = (key, defaultPoints) => {
    if (checkins && checkins.length >= 2) {
      return checkins.slice(-5).map(c => ({
        value: key === 'sleep' ? c.sleep_hours 
             : key === 'stress' ? c.stress_level 
             : key === 'activity' ? c.exercise_minutes 
             : c.mood_score
      }));
    }
    return defaultPoints;
  };

  // Date formatter
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  try {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] text-gray-800 antialiased">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto max-h-screen">
          
          {/* Top Header Row */}
          <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                Good Morning, {userName} 🌿
              </h1>
              <p className="text-gray-400 text-xs mt-1 font-bold">
                Here's your wellbeing summary for today.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 font-bold bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm">
                {formattedDate}
              </span>
              <img
                src={localStorage.getItem("trivarna_avatar_url") || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                className="w-10 h-10 rounded-full ring-2 ring-purple-100 shadow-sm object-cover"
                alt="avatar"
              />
            </div>
          </div>

          {/* Grid Layout matching Screen 05 Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Span 2) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* 1. Wellness Score Panels (Circular progress indicators) */}
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm mb-4 flex items-center gap-2 tracking-wide">
                  <Sparkles className="w-4.5 h-4.5 text-purple-600" />
                  WELLNESS SUMMARY
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Overall Wellness */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-100/50 shadow-sm flex flex-col justify-between items-center text-center hover:shadow-md transition duration-300 flex-1">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">Wellness Score</span>
                    <div className="relative w-20 h-20 my-1">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="#f3e8ff" strokeWidth="7" fill="transparent" />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="34" 
                          stroke="#8b5cf6" 
                          strokeWidth="7" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 34}
                          strokeDashoffset={2 * Math.PI * 34 - (2 * Math.PI * 34 * (profile.overall_score || 82)) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black text-gray-800">{profile.overall_score || 82}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-600 font-extrabold mt-3">
                      You're doing great! Keep it up.
                    </span>
                  </div>

                  {/* Mind Score */}
                  <CircularProgress 
                    label="Mind Score" 
                    score={profile.mind_score || 75} 
                    color="blue" 
                    status={getScoreRating(profile.mind_score || 75)} 
                  />

                  {/* Body Score */}
                  <CircularProgress 
                    label="Body Score" 
                    score={profile.body_score || 88} 
                    color="green" 
                    status={getScoreRating(profile.body_score || 88)} 
                  />

                  {/* Life/Lifestyle Score */}
                  <CircularProgress 
                    label="Life Score" 
                    score={profile.lifestyle_score || 83} 
                    color="orange" 
                    status={getScoreRating(profile.lifestyle_score || 83)} 
                  />
                </div>
              </div>

              {/* 2. Trends Overview (Sparkline charts) */}
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm mb-4 flex items-center gap-2 tracking-wide">
                  <TrendingUp className="w-4.5 h-4.5 text-purple-600" />
                  TRENDS OVERVIEW
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <TrendCard 
                    title="Stress" 
                    value={latestCheckin?.stress_level ? latestCheckin.stress_level * 10 : 65} 
                    status={latestCheckin?.stress_level ? (latestCheckin.stress_level < 4 ? "Calm" : latestCheckin.stress_level < 7 ? "Moderate" : "High") : "Moderate"}
                    color="#f43f5e" 
                    data={getTrendData('stress', defaultStressPoints)} 
                  />

                  <TrendCard 
                    title="Sleep" 
                    value={latestCheckin?.sleep_hours ? `${latestCheckin.sleep_hours}h` : "7.2h"} 
                    status={latestCheckin?.sleep_hours ? (latestCheckin.sleep_hours >= 7 ? "Optimal" : "Deficit") : "Optimal"}
                    color="#3b82f6" 
                    data={getTrendData('sleep', defaultSleepPoints)} 
                  />

                  <TrendCard 
                    title="Activity" 
                    value={latestCheckin?.exercise_minutes ? `${latestCheckin.exercise_minutes * 100} steps` : "8,245 steps"} 
                    status={latestCheckin?.exercise_minutes ? (latestCheckin.exercise_minutes >= 30 ? "Active" : "Light") : "Active"}
                    color="#10b981" 
                    data={getTrendData('activity', defaultActivityPoints)} 
                  />

                  <TrendCard 
                    title="Mood" 
                    value={latestCheckin?.mood_score ? (latestCheckin.mood_score >= 8 ? "Excellent" : latestCheckin.mood_score >= 6 ? "Good" : "Neutral") : "Good"} 
                    status={latestCheckin?.mood_score ? (latestCheckin.mood_score >= 7 ? "Positive" : "Low") : "Positive"}
                    color="#f59e0b" 
                    data={getTrendData('mood', defaultMoodPoints)} 
                  />
                </div>
              </div>

              {/* 3. Today's Insight (Meditation banner) */}
              <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6 border border-purple-500/10">
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="space-y-4 max-w-md z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
                    <span>TODAY'S INSIGHT</span>
                  </div>
                  <p className="text-sm md:text-base font-bold leading-relaxed text-purple-50">
                    Your stress tends to increase when sleep falls below 6 hours. Try sleeping before 11 PM today.
                  </p>
                  <button 
                    onClick={() => navigate("/mind")}
                    className="flex items-center gap-1.5 bg-white text-purple-900 text-xs font-bold px-4 py-2 rounded-xl shadow hover:bg-purple-50 transition cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Vector Meditating Illustration */}
                <div className="flex-shrink-0 z-10 select-none">
                  <svg viewBox="0 0 120 120" className="w-28 h-28 text-purple-300/80 filter drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                    <path d="M90,30 A15,15 0 0,0 70,15 A18,18 0 1,1 90,30 Z" fill="currentColor" opacity="0.9" />
                    <circle cx="30" cy="20" r="1.5" fill="currentColor" className="animate-pulse" />
                    <circle cx="45" cy="35" r="1" fill="currentColor" />
                    <circle cx="20" cy="50" r="1.5" fill="currentColor" className="animate-pulse" />
                    <circle cx="85" cy="65" r="1" fill="currentColor" />
                    <polygon points="10,100 50,40 90,100" fill="currentColor" opacity="0.3" />
                    <polygon points="40,100 80,55 120,100" fill="currentColor" opacity="0.2" />
                    <g transform="translate(45, 60)" fill="currentColor">
                      <circle cx="15" cy="10" r="4.5" />
                      <path d="M15,16 C10,16 6,20 6,25 C6,27 8,28 9,28 L21,28 C22,28 24,27 24,25 C24,20 20,16 15,16 Z" />
                      <path d="M5,29 C5,29 0,33 0,35 C0,37 3,38 7,38 L23,38 C27,38 30,37 30,35 C30,33 25,29 25,29 Z" opacity="0.9" />
                      <circle cx="15" cy="10" r="9" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" className="animate-ping" />
                    </g>
                  </svg>
                </div>
              </div>

            </div>
            
            {/* Right Column (Span 1) */}
            <div className="space-y-8">
              
              {/* 1. Quick Actions (Styling matching Screen 05 Dashboard) */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
                <h3 className="font-extrabold text-gray-800 text-sm mb-4 tracking-wide uppercase">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  
                  {/* Talk to AI Companion */}
                  <button 
                    onClick={() => navigate("/chatbot")} 
                    className="flex items-center justify-between p-4 border border-gray-100 hover:border-purple-200 rounded-2xl bg-gray-50/50 hover:bg-purple-50/20 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">Talk to AI Companion</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">Start daily therapy & coaching</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-purple-600 transition" />
                  </button>

                  {/* Log Mood (triggers Check-in Modal) */}
                  <button 
                    onClick={() => setCheckinOpen(true)} 
                    className="flex items-center justify-between p-4 border border-gray-100 hover:border-purple-200 rounded-2xl bg-gray-50/50 hover:bg-purple-50/20 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-pink-100 text-pink-600 rounded-xl">
                        <Heart className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">Log Mood & Wellbeing</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">Complete daily wellness check-in</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-pink-600 transition" />
                  </button>

                  {/* Track Workout */}
                  <button 
                    onClick={() => navigate("/body")} 
                    className="flex items-center justify-between p-4 border border-gray-100 hover:border-purple-200 rounded-2xl bg-gray-50/50 hover:bg-purple-50/20 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Dumbbell className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">Track Workout Activity</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">Log exercise minutes & steps</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-emerald-600 transition" />
                  </button>

                  {/* Log Your Meal */}
                  <button 
                    onClick={() => navigate("/body")} 
                    className="flex items-center justify-between p-4 border border-gray-100 hover:border-purple-200 rounded-2xl bg-gray-50/50 hover:bg-purple-50/20 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                        <Coffee className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-gray-800">Log Your Meal Nutrition</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">Track daily calorie budget</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4.5 h-4.5 text-gray-300 group-hover:text-amber-500 transition" />
                  </button>

                </div>
              </div>

              {/* 2. Today's AI Schedule Plan */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-gray-800 text-sm tracking-wide uppercase flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-purple-600" />
                    Today's Schedule
                  </h3>
                  {plan?.wake_time && (
                    <span className="text-[9px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-extrabold border border-purple-100">
                      {plan.wake_time} - {plan.sleep_target}
                    </span>
                  )}
                </div>

                {scheduleTasks.length > 0 ? (
                  <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                    {scheduleTasks.map((task, idx) => (
                      <div 
                        key={idx} 
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100/30 hover:bg-gray-100/50 transition text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-primary-purple bg-light-purple/60 px-2.5 py-1 rounded-xl min-w-[55px] text-center border border-primary-purple/10">
                            {task.time}
                          </span>
                          <div>
                            <p className="font-bold text-gray-800 text-xs">{task.task}</p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">{task.category || "General"}</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-extrabold text-emerald-600 uppercase">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Calendar className="w-8 h-8 text-purple-400/50 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs">No scheduled routine found.</p>
                    <button 
                      onClick={() => navigate("/onboarding")} 
                      className="text-[10px] text-purple-600 font-extrabold hover:underline mt-1.5 flex items-center gap-1 mx-auto"
                    >
                      <span>Complete Onboarding</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Check-in Modal */}
          <CheckinModal 
            isOpen={checkinOpen} 
            onClose={() => setCheckinOpen(false)} 
            onCheckinSuccess={handleCheckinSuccess} 
          />

        </main>
      </div>
    );
  } catch (err) {
    console.error("Dashboard render crash caught:", err);
    // Throw error so top-level ErrorBoundary can render standard fallback
    throw err;
  }
}