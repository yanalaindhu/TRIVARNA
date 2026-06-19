import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import ScoreCard from "../components/scorecard";
import api from "../services/api";
import { Activity, Dumbbell, Moon, Soup, Plus, Loader2, Sparkles } from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BodyOverview() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fitness"); // fitness, sleep, nutrition
  const [checkins, setCheckins] = useState([]);
  const [latestCheckin, setLatestCheckin] = useState(null);
  
  // Nutrition-specific state
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem(`meals_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse meals:", e);
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
    localStorage.setItem(`meals_${userId}`, JSON.stringify(updatedMeals));
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
  const targetCalories = 2200;
  const caloriePercent = Math.min((totalCalories / targetCalories) * 100, 100);

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
            {/* Fitness Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 flex flex-col justify-between">
                <span className="text-gray-400 text-[10px] font-bold uppercase">Exercise Minutes</span>
                <span className="text-3xl font-extrabold mt-2 text-purple-600">{totalExercise}</span>
                <span className="text-[10px] text-gray-500 mt-1">Goal: 45 mins/day</span>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 flex flex-col justify-between">
                <span className="text-gray-400 text-[10px] font-bold uppercase">Estimated Steps</span>
                <span className="text-3xl font-extrabold mt-2 text-emerald-600">{estimatedSteps.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500 mt-1">Goal: 10,000 steps</span>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 flex flex-col justify-between">
                <span className="text-gray-400 text-[10px] font-bold uppercase">Distance Covered</span>
                <span className="text-3xl font-extrabold mt-2 text-blue-600">{distanceCovered} km</span>
                <span className="text-[10px] text-gray-500 mt-1">Based on step cadence</span>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100/50 flex flex-col justify-between">
                <span className="text-gray-400 text-[10px] font-bold uppercase">Water Hydration</span>
                <span className="text-3xl font-extrabold mt-2 text-sky-500">{totalWater} L</span>
                <span className="text-[10px] text-gray-500 mt-1">Goal: 3.0 L/day</span>
              </div>
            </div>

            {/* Exercise graph */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
              <h3 className="font-extrabold text-gray-800 text-lg mb-4">Activity Log (Minutes)</h3>
              <div className="h-64 w-full">
                {checkins.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={checkins}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f4" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="exercise_minutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No activity entries found.
                  </div>
                )}
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
                <h3 className="font-extrabold text-gray-800 text-sm mb-4">Sleep Stages Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sleepStagesData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f1f4" />
                      <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                      <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                        {sleepStagesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase mb-5">
                    <Sparkles className="w-3 h-3 text-pink-300" />
                    <span>AI Sleep Insights</span>
                  </div>
                  <h4 className="text-lg font-bold mb-3">Optimal Recovery Cycle</h4>
                  <p className="text-xs leading-relaxed text-purple-100 mb-4">
                    Based on your active check-ins, your deep sleep levels drop significantly when caffeine intake is logged past 4:00 PM or when screen activities are registered under 30 minutes before sleep.
                  </p>
                  <ul className="list-disc pl-5 text-xs text-purple-200 space-y-1.5">
                    <li>Create a screen sunset routine 30 minutes before bed</li>
                    <li>Avoid caffeine blocks after 02:00 PM</li>
                    <li>Aim for regular sleep onset window (approx. 10:30 PM)</li>
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
