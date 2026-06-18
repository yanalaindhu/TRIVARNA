import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import api from "../services/api";
import { Calendar, Plus, Check, Loader2 } from "lucide-react";

export default function HabitsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ habit_name: "", category: "Mind", target_frequency: "Daily" });
  const [addingHabit, setAddingHabit] = useState(false);
  
  // Weekly checkin completion mock state tracker for local interaction
  // Maps habitId -> array of weekday booleans [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  const [weeklyCompletions, setWeeklyCompletions] = useState({});

  const userId = localStorage.getItem("userId");
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

  const loadHabits = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/habits/${userId}`);
      const fetchedHabits = response.data || [];
      setHabits(fetchedHabits);
      
      // Initialize weekly completions mock array [Mon-Sun] for UI checkboxes
      const initialWeekly = {};
      fetchedHabits.forEach(habit => {
        initialWeekly[habit.id] = [false, false, false, false, false, false, false];
      });
      setWeeklyCompletions(initialWeekly);
    } catch (err) {
      console.error("Error loading habits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, [userId]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.habit_name) return;
    setAddingHabit(true);
    try {
      const payload = {
        user_id: userId,
        habit_name: newHabit.habit_name,
        category: newHabit.category,
        target_frequency: newHabit.target_frequency
      };

      const res = await api.post("/habits/", payload);
      if (res.data.success) {
        setNewHabit({ habit_name: "", category: "Mind", target_frequency: "Daily" });
        loadHabits();
      }
    } catch (err) {
      console.error("Failed to add habit:", err);
      alert("Error adding habit.");
    } finally {
      setAddingHabit(false);
    }
  };

  const handleToggleDay = async (habitId, dayIndex) => {
    // Optimistic UI updates
    const currentList = weeklyCompletions[habitId] || [false, false, false, false, false, false, false];
    const isCompleted = !currentList[dayIndex];
    const updatedDays = [...currentList];
    updatedDays[dayIndex] = isCompleted;
    setWeeklyCompletions((prev) => ({
      ...prev,
      [habitId]: updatedDays,
    }));

    try {
      const todayString = new Date().toISOString().split('T')[0];
      const payload = {
        habit_id: habitId,
        completed: isCompleted,
        completed_date: todayString
      };
      await api.post("/habits/logs", payload);
    } catch (err) {
      console.error("Failed to log habit completion:", err);
    }
  };

  if (loading && habits.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading Habits...</p>
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
              <Calendar className="w-8 h-8 text-purple-600" />
              Habit Builder & Tracker
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Construct habits and click on weekly calendar blocks to register routine checks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Habit Form (Col span 1) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm h-fit">
            <h3 className="font-extrabold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Build New Habit
            </h3>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 mb-1">Habit Name</label>
                <input
                  type="text"
                  placeholder="e.g. Meditation, Study 2 Hours"
                  value={newHabit.habit_name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, habit_name: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 bg-gray-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1">Category Dimension</label>
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="Mind">Mind Wellbeing</option>
                    <option value="Body">Body Tracker</option>
                    <option value="Lifestyle">Soul & Lifestyle</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 mb-1">Target Frequency</label>
                  <select
                    value={newHabit.target_frequency}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, target_frequency: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="Daily">Daily Execution</option>
                    <option value="Weekly">Weekly Execution</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={addingHabit}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-purple-700 transition cursor-pointer w-full"
              >
                {addingHabit ? "Adding Habit..." : "Register Habit Tracker"}
              </button>
            </form>
          </div>

          {/* Habits Grid List (Col span 2) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm">
            <h3 className="font-extrabold text-gray-800 text-lg mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Weekly Habit Tracker Checkmarks
            </h3>

            <div className="space-y-6">
              {habits.length > 0 ? (
                habits.map((habit, idx) => {
                  const checkList = weeklyCompletions[habit.id] || [false, false, false, false, false, false, false];
                  return (
                    <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in duration-200">
                      <div>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[8px] uppercase tracking-wider mb-1">
                          {habit.category || "General"}
                        </span>
                        <h4 className="font-bold text-gray-800 text-sm">{habit.habit_name}</h4>
                        <span className="text-[10px] text-gray-400 capitalize">Target: {habit.target_frequency || "Daily"}</span>
                      </div>

                      {/* Weekly Calendar checkmark buttons */}
                      <div className="flex gap-2.5">
                        {weekdays.map((day, dIdx) => (
                          <div key={dIdx} className="flex flex-col items-center gap-1">
                            <span className="text-[9px] font-bold text-gray-400">{day}</span>
                            <button
                              onClick={() => handleToggleDay(habit.id, dIdx)}
                              className={`
                                w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs transition duration-200 cursor-pointer
                                ${checkList[dIdx]
                                  ? "bg-green-500 border-green-500 text-white shadow-sm"
                                  : "border-gray-200 bg-white text-gray-400 hover:border-purple-300"
                                }
                              `}
                            >
                              {checkList[dIdx] ? <Check className="w-4 h-4" /> : null}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">No habits logged yet. Create a habit to start tracking streaks.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
