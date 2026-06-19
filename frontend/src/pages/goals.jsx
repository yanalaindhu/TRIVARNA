import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import api from "../services/api";
import { Target, Plus, RefreshCw, Loader2, Calendar } from "lucide-react";

export default function GoalsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ goal_name: "", category: "Health", target_date: "" });
  const [addingGoal, setAddingGoal] = useState(false);

  const userId = localStorage.getItem("userId");

  const loadGoals = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/goals/${userId}`);
      setGoals(response.data || []);
    } catch (err) {
      console.error("Error loading goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, [userId]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.goal_name || !newGoal.target_date) return;
    
    // Validate target date is not in the past
    const selectedDate = new Date(newGoal.target_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert("Target deadline cannot be a past date. Please select today or a future date.");
      return;
    }

    setAddingGoal(true);
    try {
      const payload = {
        user_id: userId,
        goal_name: newGoal.goal_name,
        category: newGoal.category,
        target_date: newGoal.target_date,
        progress_percentage: 0,
        status: "active"
      };

      const res = await api.post("/goals/", payload);
      if (res.data.success) {
        setNewGoal({ goal_name: "", category: "Health", target_date: "" });
        loadGoals();
      }
    } catch (err) {
      console.error("Failed to add goal:", err);
      alert("Error adding goal.");
    } finally {
      setAddingGoal(false);
    }
  };

  const handleProgressChange = async (goalId, newProgress) => {
    try {
      const payload = {
        progress_percentage: parseInt(newProgress),
        status: parseInt(newProgress) >= 100 ? "completed" : "active"
      };

      await api.patch(`/goals/${goalId}`, payload);
      // Optimistic state update
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, ...payload } : g));
    } catch (err) {
      console.error("Failed to update goal progress:", err);
    }
  };

  if (loading && goals.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading Goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8fc] text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Target className="w-8 h-8 text-purple-600" />
              Trivarna Goals Register
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Set goals, define target deadlines, and drag the slider to log your real-time completion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Goal Form (Col span 1) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm h-fit">
            <h3 className="font-extrabold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Create Focus Goal
            </h3>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1">Goal Description / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Read 20 books this year"
                  value={newGoal.goal_name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, goal_name: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 bg-gray-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1">Category Dimension</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="Health">Health & Fitness</option>
                    <option value="Career">Career & Focus</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Personal Growth">Personal Growth</option>
                    <option value="Leisure">Fun & Leisure</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newGoal.target_date}
                    min={new Date().toLocaleDateString('en-CA')}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 bg-gray-50/50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addingGoal}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-purple-700 transition cursor-pointer w-full"
              >
                {addingGoal ? "Adding Goal..." : "Register Focus Goal"}
              </button>
            </form>
          </div>

          {/* Goals List (Col span 2) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
            <h3 className="font-extrabold text-gray-800 text-lg mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Active Goals Tracker
            </h3>

            <div className="space-y-6">
              {goals.length > 0 ? (
                goals.map((goal, idx) => (
                  <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative group animate-in fade-in duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[8px] uppercase tracking-wider mb-1">
                          {goal.category || "General"}
                        </span>
                        <h4 className="font-bold text-gray-800 text-sm">{goal.goal_name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        goal.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {goal.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          Target: {goal.target_date || "N/A"}
                        </span>
                        <span>Progress: {goal.progress_percentage || 0}%</span>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress_percentage || 0}
                        onChange={(e) => handleProgressChange(goal.id, e.target.value)}
                        className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">No active goals registered yet. Create one to kickstart your progress.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
