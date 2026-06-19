import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import ScoreCard from "../components/scorecard";
import api from "../services/api";
import { Activity, Dumbbell, Moon, Soup, Plus, Loader2, Sparkles, Flame } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BodyOverview() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fitness"); // fitness, sleep, nutrition
  const [checkins, setCheckins] = useState([]);
  const [latestCheckin, setLatestCheckin] = useState(null);
  const [onboarding, setOnboarding] = useState(null);

  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
  
  // Nutrition-specific state
  const [meals, setMeals] = useState(() => {
    const savedToday = localStorage.getItem(`meals_${userId}_${todayStr}`);
    if (savedToday) {
      try {
        return JSON.parse(savedToday);
      } catch (e) {
        console.error("Failed to parse meals:", e);
      }
    }
    // Migration: if there is old data, treat it as today's meals
    const savedOld = localStorage.getItem(`meals_${userId}`);
    if (savedOld) {
      try {
        const parsed = JSON.parse(savedOld);
        localStorage.setItem(`meals_${userId}_${todayStr}`, savedOld);
        return parsed;
      } catch (e) {
        console.error("Failed to parse old meals:", e);
      }
    }
    return [];
  });
  const [newMeal, setNewMeal] = useState({ name: "", type: "Breakfast", calories: "" });

  const loadBodyData = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const dashRes = await api.get(`/dashboard/${userId}`);
      if (dashRes.data) {
        setLatestCheckin(dashRes.data.latest_checkin || {});
        setOnboarding(dashRes.data.onboarding || null);
      }

      const checkinsRes = await api.get(`/checkins/${userId}`);
      if (checkinsRes.data) {
        const sorted = [...checkinsRes.data].reverse().map(c => ({
          ...c,
          date: new Date(c.created_at).toLocaleDateString([], { month: "short", day: "numeric" })
        }));
        setCheckins(sorted);
      }
    } catch (err) {
      console.error("Error loading body data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBodyData();
  }, [userId]);

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name || !newMeal.calories) return;
    const updatedMeals = [
      ...meals,
      {
        name: newMeal.name,
        type: newMeal.type,
        calories: parseInt(newMeal.calories)
      }
    ];
    setMeals(updatedMeals);
    localStorage.setItem(`meals_${userId}_${todayStr}`, JSON.stringify(updatedMeals));
    setNewMeal({ name: "", type: "Breakfast", calories: "" });
  };

  if (loading && checkins.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading Body Analytics...</p>
        </div>
      </div>
    );
  }

  // Verify if the latest check-in was recorded today
  const checkinDate = latestCheckin?.created_at ? new Date(latestCheckin.created_at) : null;
  const isCheckinToday = checkinDate ? new Date().toDateString() === checkinDate.toDateString() : false;

  const totalExercise = isCheckinToday ? (latestCheckin?.exercise_minutes || 0) : 0;
  const totalSleep = isCheckinToday ? (latestCheckin?.sleep_hours || 0) : 0;
  const totalWater = isCheckinToday ? (latestCheckin?.water_intake || 0) : 0;
  
  const estimatedSteps = totalExercise > 0 ? (totalExercise * 120 + 2000) : 0;
  const distanceCovered = estimatedSteps > 0 ? (estimatedSteps * 0.00075).toFixed(1) : "0.0";

  const sleepLogged = isCheckinToday && latestCheckin && latestCheckin.sleep_hours !== undefined && latestCheckin.sleep_hours !== null;
  const sleepDisplay = sleepLogged ? `${totalSleep} hrs` : "No data";
  const sleepScoreDisplay = sleepLogged ? (totalSleep > 7 ? "92%" : totalSleep > 5 ? "78%" : "54%") : "No data";
  const sleepEfficiencyDisplay = sleepLogged ? "88%" : "No data";

  // Nutrition calculations
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  // Dynamic calorie target based on onboarding activity level
  const activityLevel = onboarding?.body_data?.activity || "moderately_active";
  const targetCalories = activityLevel === "sedentary" ? 1800 
                       : activityLevel === "lightly_active" ? 2000 
                       : activityLevel === "moderately_active" ? 2200 
                       : activityLevel === "very_active" ? 2500 
                       : 2200;

  const caloriePercent = Math.min((totalCalories / targetCalories) * 100, 100);

  const getDynamicSleepInsights = () => {
    if (!sleepLogged) {
      return {
        title: "No Sleep Data Recorded",
        desc: "Please log your sleep hours in today's check-in to get custom sleep hygiene advice.",
        tips: [
          "Complete your daily check-in",
          "Aim for regular sleep onset window (approx. 10:30 PM)",
          "Avoid screen usage 30 mins before sleep"
        ]
      };
    }
    if (totalSleep >= 8) {
      return {
        title: "Excellent Sleep Duration",
        desc: `You logged ${totalSleep} hours of sleep today. This is within the optimal zone of recovery for physical and cognitive restoration. Keep it up!`,
        tips: [
          "Maintain your sleep consistency over the weekend",
          "Make sure your room remains cool and pitch-black",
          "Log your morning energy level to track sleep quality"
        ]
      };
    } else if (totalSleep >= 7) {
      return {
        title: "Sufficient Sleep Duration",
        desc: `You logged ${totalSleep} hours of sleep. This meets the minimum threshold for healthy recovery, supporting full daily performance.`,
        tips: [
          "Keep screens away 30 minutes before sleep",
          "Avoid large meals within 2 hours of sleeping",
          "Expose yourself to sunlight within 1 hour of waking"
        ]
      };
    } else if (totalSleep >= 5) {
      return {
        title: "Mild Sleep Deprivation Detected",
        desc: `You only logged ${totalSleep} hours of sleep. This is below the recommended 7-9 hours, which can cause cognitive fatigue, reduced focus, and elevated stress.`,
        tips: [
          "Avoid double-shot espresso or caffeine blocks after 2:00 PM",
          "Consider a short 15-20 min power nap before 3:00 PM",
          "Go to bed 30 minutes earlier tonight"
        ]
      };
    } else {
      return {
        title: "Critical Sleep Deficit Detected",
        desc: `Warning: You logged only ${totalSleep} hours of sleep. This is a severe sleep deficit. Your immune function, hormonal balance, and focus are significantly impaired.`,
        tips: [
          "Do not engage in heavy or hazardous physical work today",
          "Listen to our healing playlist to calm your nervous system",
          "Prioritize getting back to bed early tonight"
        ]
      };
    }
  };

  const sleepInsights = getDynamicSleepInsights();

  // Yesterday's calories and recommendations
  const yesterdayMeals = (() => {
    const saved = localStorage.getItem(`meals_${userId}_${yesterdayStr}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  })();
  const yesterdayCalories = yesterdayMeals.reduce((sum, m) => sum + m.calories, 0);
  const yesterdayExcess = yesterdayCalories > targetCalories ? yesterdayCalories - targetCalories : 0;

  // Sleep stages mock data for chart
  const sleepStagesData = [
    { name: "Awake", minutes: 30, color: "#f59e0b" },
    { name: "REM", minutes: 90, color: "#8b5cf6" },
    { name: "Light", minutes: 210, color: "#3b82f6" },
    { name: "Deep", minutes: 120, color: "#10b981" }
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f8fc] text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Activity className="w-8 h-8 text-purple-600" />
              Body Assessment & Trackers
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Monitor your physical exercise, sleep hygiene, and daily nutritional balance.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100/50 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab("fitness")}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "fitness" ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Fitness & Activity</span>
          </button>
          <button
            onClick={() => setActiveTab("sleep")}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "sleep" ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Sleep Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab("nutrition")}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "nutrition" ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Soup className="w-4 h-4" />
            <span>Nutrition Intake</span>
          </button>
        </div>

        {/* Dynamic Content */}
        {activeTab === "fitness" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {yesterdayExcess > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-3xl p-6 shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-orange-900 text-base">Yesterday's Calorie Balance Recommendation</h4>
                  <p className="text-orange-700 text-sm mt-1 font-medium">
                    You consumed <strong>{yesterdayCalories} kcal</strong> yesterday, which exceeded your daily target of <strong>{targetCalories} kcal</strong> by <strong>{yesterdayExcess} kcal</strong>. To balance it out, we recommend performing one of the following activities today:
                  </p>
                  <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-orange-100/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                        <span>🏃 Jogging/Running: {Math.max(10, Math.round(yesterdayExcess / 10))} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span>🚶 Brisk Walking: {Math.max(15, Math.round(yesterdayExcess / 5))} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                        <span>🚴 Cycling: {Math.max(12, Math.round(yesterdayExcess / 8))} mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fitness Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 flex flex-col justify-between">
                <span className="text-gray-400 text-[10px] font-bold uppercase">Exercise Minutes</span>
                <span className="text-3xl font-extrabold mt-2 text-purple-600">{totalExercise}</span>
                <span className="text-[10px] text-gray-500 mt-1">Goal: 45 mins/day</span>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 flex flex-col justify-between">
                <span className="text-gray-400 text-[10px] font-bold uppercase">Water Hydration</span>
                <span className="text-3xl font-extrabold mt-2 text-sky-500">{totalWater} L</span>
                <span className="text-[10px] text-gray-500 mt-1">Goal: 3.0 L/day</span>
              </div>
            </div>

            {/* Exercise & Yoga Recommendations (replaces old Activity Log graph) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
              <h3 className="font-extrabold text-gray-800 text-lg mb-2">Tailored Exercise & Yoga Recommendations</h3>
              <p className="text-xs text-gray-400 mb-6">Based on your activity profiles and yesterday's calorie balance.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Yoga Card */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex flex-col justify-between group hover:shadow-md transition duration-200">
                  <div className="h-36 overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" 
                      alt="Yoga Session" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-purple-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">Yoga & Stretch</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Vinyasa Yoga & Flexibility</h4>
                      <p className="text-xs text-gray-500 mt-1">Calm your mind, improve flexibility, and recover.</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-600">Duration: {yesterdayExcess > 0 ? "30 mins" : "20 mins"}</span>
                      <a 
                        href="https://www.youtube.com/watch?v=v7AYKMP6rOE" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-700 transition"
                      >
                        ▶ Watch Video
                      </a>
                    </div>
                  </div>
                </div>

                {/* Jogging Card */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex flex-col justify-between group hover:shadow-md transition duration-200">
                  <div className="h-36 overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80" 
                      alt="Jogging Session" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-orange-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">Cardio</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Fat-Burning Jogging</h4>
                      <p className="text-xs text-gray-500 mt-1">Efficient cardio to burn off excess calories.</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-600">Duration: {Math.max(20, Math.round(yesterdayExcess / 10 || 25))} mins</span>
                      <a 
                        href="https://www.youtube.com/watch?v=gN4r8a_X8d4" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-700 transition"
                      >
                        ▶ Watch Video
                      </a>
                    </div>
                  </div>
                </div>

                {/* Cycling Card */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex flex-col justify-between group hover:shadow-md transition duration-200">
                  <div className="h-36 overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80" 
                      alt="Cycling Session" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">Endurance</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Circadian Cardio Cycling</h4>
                      <p className="text-xs text-gray-500 mt-1">Build stamina and burn active calories.</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600">Duration: {Math.max(20, Math.round(yesterdayExcess / 8 || 30))} mins</span>
                      <a 
                        href="https://www.youtube.com/watch?v=yPM7nS7R6H4" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-700 transition"
                      >
                        ▶ Watch Video
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sleep" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Sleep Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50">
                <h4 className="text-gray-400 text-[10px] font-bold uppercase mb-2">Sleep Duration</h4>
                <p className="text-3xl font-extrabold text-purple-600">{sleepDisplay}</p>
                <p className="text-[10px] text-gray-500 mt-1">Recommended: 7-9 hours</p>
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50">
                <h4 className="text-gray-400 text-[10px] font-bold uppercase mb-2">Sleep Score</h4>
                <p className="text-3xl font-extrabold text-emerald-600">{sleepScoreDisplay}</p>
                <p className="text-[10px] text-gray-500 mt-1">Calculated via rest stability</p>
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50">
                <h4 className="text-gray-400 text-[10px] font-bold uppercase mb-2">Sleep Efficiency</h4>
                <p className="text-3xl font-extrabold text-blue-600">{sleepEfficiencyDisplay}</p>
                <p className="text-[10px] text-gray-500 mt-1">Percentage of time actually asleep</p>
              </div>
            </div>

            {/* Stages & charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
                <h3 className="font-extrabold text-gray-800 text-sm mb-2">Light Sleeper Relaxing Playlist</h3>
                <p className="text-xs text-gray-400 mb-4">Calm your mind and sink into deep restorative sleep with these relaxing audio tracks.</p>
                
                <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-purple-300 transition duration-200">
                    <img 
                      src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=120&h=80&fit=crop&q=80" 
                      alt="Deep Sleep Music" 
                      className="w-16 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-xs truncate">Deep Sleep Healing Music</h4>
                      <p className="text-[10px] text-gray-400">8 Hours of delta wave frequencies.</p>
                    </div>
                    <a 
                      href="https://www.youtube.com/watch?v=Wnn47ObA8Gs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                    >
                      ▶ Play
                    </a>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-purple-300 transition duration-200">
                    <img 
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=120&h=80&fit=crop&q=80" 
                      alt="Lofi Beats" 
                      className="w-16 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-xs truncate">Chill Lofi Sleep & Study Beats</h4>
                      <p className="text-[10px] text-gray-400">Gentle ambient room lofi tracks.</p>
                    </div>
                    <a 
                      href="https://www.youtube.com/watch?v=jfKfPfyJRdk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                    >
                      ▶ Play
                    </a>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-purple-300 transition duration-200">
                    <img 
                      src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=120&h=80&fit=crop&q=80" 
                      alt="Rain Sounds" 
                      className="w-16 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-xs truncate">Heavy Rain & Ocean Waves</h4>
                      <p className="text-[10px] text-gray-400">Natural white noise for sound sleep.</p>
                    </div>
                    <a 
                      href="https://www.youtube.com/watch?v=q76bMs-NwRk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                    >
                      ▶ Play
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase mb-5">
                    <Sparkles className="w-3 h-3 text-pink-300" />
                    <span>AI Sleep Insights</span>
                  </div>
                  <h4 className="text-lg font-bold mb-3">{sleepInsights.title}</h4>
                  <p className="text-xs leading-relaxed text-purple-100 mb-4">
                    {sleepInsights.desc}
                  </p>
                  <ul className="list-disc pl-5 text-xs text-purple-200 space-y-1.5">
                    {sleepInsights.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "nutrition" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Calories Tracker widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
              <h3 className="font-extrabold text-gray-800 text-lg mb-2">Nutrition Calorie Budget</h3>
              <div className="flex justify-between items-center text-sm font-semibold mb-2 mt-4 text-gray-600">
                <span>Calories Consumed: {totalCalories} kcal</span>
                <span>Daily Target: {targetCalories} kcal</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${caloriePercent}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400">Calories remaining: {targetCalories - totalCalories} kcal</p>
              {totalCalories > targetCalories && (
                <div className="mt-4 bg-red-50 border border-red-250 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-xs font-semibold animate-pulse">
                  <Flame className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Calories consumed are taken more than the daily target limit! Try to do some extra exercise today to burn them off.</span>
                </div>
              )}
            </div>

            {/* Nutrition columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Logged meals list */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Meals Logged Today</h3>
                <div className="space-y-3">
                  {meals.map((meal, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100/50 text-xs">
                      <div>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[8px] uppercase tracking-wider mb-1">
                          {meal.type}
                        </span>
                        <p className="font-bold text-gray-800 text-sm">{meal.name}</p>
                      </div>
                      <span className="font-extrabold text-gray-700 text-sm">{meal.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add meal form */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Log Nutrition / Meal</h3>
                <form onSubmit={handleAddMeal} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 mb-1">Meal Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Scrambled Eggs, Protein Shake"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal((prev) => ({ ...prev, name: e.target.value }))}
                      className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-500 mb-1">Meal Category</label>
                      <select
                        value={newMeal.type}
                        onChange={(e) => setNewMeal((prev) => ({ ...prev, type: e.target.value }))}
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 bg-white"
                      >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-500 mb-1">Calories (kcal)</label>
                      <input
                        type="number"
                        placeholder="e.g. 350"
                        value={newMeal.calories}
                        onChange={(e) => setNewMeal((prev) => ({ ...prev, calories: e.target.value }))}
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-purple-700 transition cursor-pointer w-full"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Meal Intake</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
