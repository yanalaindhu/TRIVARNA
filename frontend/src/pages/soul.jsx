import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import ScoreCard from "../components/scorecard";
import api from "../services/api";
import { Sparkles, Heart, CheckCircle2, Target, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function SoulOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lifestyleScore, setLifestyleScore] = useState(0);
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [journals, setJournals] = useState([]);

  const userId = localStorage.getItem("userId");

  const loadSoulData = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      // Fetch Dashboard
      const dashRes = await api.get(`/dashboard/${userId}`);
      if (dashRes.data) {
        setLifestyleScore(dashRes.data.profile?.lifestyle_score || 0);
      }

      // Fetch Goals
      const goalsRes = await api.get(`/goals/${userId}`);
      setGoals(goalsRes.data || []);

      // Fetch Habits
      const habitsRes = await api.get(`/habits/${userId}`);
      setHabits(habitsRes.data || []);

      // Fetch Reflections
      const journalsRes = await api.get(`/journals/${userId}`);
      setJournals(journalsRes.data || []);

    } catch (err) {
      console.error("Error loading soul overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoulData();
  }, [userId]);

  if (loading && goals.length === 0 && habits.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading Lifestyle Dynamics...</p>
        </div>
      </div>
    );
  }

  // Pie chart data for Life Balance Wheel
  const lifeBalanceData = [
    { name: "Career", value: 70, color: "#ef4444" },
    { name: "Health & Vitality", value: 80, color: "#10b981" },
    { name: "Relationships", value: 75, color: "#3b82f6" },
    { name: "Personal Growth", value: 85, color: "#8b5cf6" },
    { name: "Fun & Leisure", value: 60, color: "#f59e0b" }
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f8fc] text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              Soul & Lifestyle Overview
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Synchronize your long-term personal goals, habit streaks, and life balance coefficients.
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ScoreCard title="Lifestyle Score" score={lifestyleScore} color="orange" subtitle="Discipline & habits metrics" />
          <ScoreCard title="Active Goals" score={goals.filter(g => g.status === "active").length} color="purple" subtitle="Trivarna Goals register" />
          <ScoreCard title="Daily Habits Logged" score={habits.length} color="green" subtitle="Log routines checkmarks" />
        </div>

        {/* Layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Life Balance Wheel */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
            <h3 className="font-extrabold text-gray-800 text-lg mb-4">Life Balance Wheel</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lifeBalanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {lifeBalanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reflections & gratitude summary */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Gratitude reflections
              </h3>
              <p className="text-xs text-gray-400 mb-4">A record of what keeps you balanced and grounded.</p>
              
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {journals.length > 0 ? (
                  journals.map((j, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-400">{new Date(j.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full capitalize">
                          Emotion: {j.emotion_detected}
                        </span>
                      </div>
                      <p className="text-gray-700 italic font-medium">"{j.content}"</p>
                      {j.summary && (
                        <p className="text-[10px] text-gray-400 mt-2 bg-white p-2 rounded-lg border border-gray-100">
                          <strong className="text-purple-600">AI summary:</strong> {j.summary}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center italic py-10">No journal entries logged. Go to Mind overview to log one!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Goals & Habits lists summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Goals list */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Your Focus Goals
              </h3>
              <button onClick={() => navigate("/goals")} className="text-xs text-purple-600 font-bold hover:underline cursor-pointer">
                Manage Goals
              </button>
            </div>
            
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.slice(0, 3).map((goal, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-800 text-sm">{goal.goal_name}</h4>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-bold uppercase text-[8px]">
                        {goal.category || "General"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: `${goal.progress_percentage || 0}%` }}></div>
                    </div>
                    <p className="text-right text-[10px] text-gray-400">Progress: {goal.progress_percentage || 0}%</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-5 italic">No active goals found.</p>
              )}
            </div>
          </div>

          {/* Habits progress summary */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                Logged Habits Tracker
              </h3>
              <button onClick={() => navigate("/habits")} className="text-xs text-purple-600 font-bold hover:underline cursor-pointer">
                Track Habits
              </button>
            </div>

            <div className="space-y-4">
              {habits.length > 0 ? (
                habits.slice(0, 3).map((habit, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{habit.habit_name}</h4>
                      <span className="text-[10px] text-gray-400 capitalize">Frequency: {habit.target_frequency || "Daily"}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold border border-green-200/50 rounded-lg">
                      Logged Active
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-5 italic">No habits registered.</p>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
