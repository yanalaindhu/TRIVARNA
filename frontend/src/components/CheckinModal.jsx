import React, { useState } from "react";
import { X, Smile, Flame, ShieldAlert, Coffee, Droplet, Dumbbell, Star, FileText } from "lucide-react";
import api from "../services/api";

export default function CheckinModal({ isOpen, onClose, onCheckinSuccess }) {
  const [formData, setFormData] = useState({
    mood_score: 5,
    stress_level: 5,
    energy_level: 5,
    sleep_hours: 7.0,
    water_intake: 2.0,
    exercise_minutes: 30,
    productivity_score: 5,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "notes" ? value : parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User session not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        user_id: userId,
        ...formData,
      };

      const response = await api.post("/checkins/", payload);
      if (response.data.success) {
        if (onCheckinSuccess) onCheckinSuccess(response.data);
        onClose();
      } else {
        setError("Failed to save check-in. Try again.");
      }
    } catch (err) {
      console.error("Checkin submission error:", err);
      setError(err.response?.data?.detail || "An error occurred while saving check-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daily Wellbeing Check-in</h2>
            <p className="text-xs text-gray-500">Record your current wellness levels</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
              {error}
            </div>
          )}

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mood Score */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Smile className="w-4 h-4 text-yellow-500" />
                Mood: {formData.mood_score}/10
              </label>
              <input
                type="range"
                name="mood_score"
                min="1"
                max="10"
                value={formData.mood_score}
                onChange={handleChange}
                className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Struggling</span>
                <span>Neutral</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Stress Level */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Flame className="w-4 h-4 text-red-500" />
                Stress Level: {formData.stress_level}/10
              </label>
              <input
                type="range"
                name="stress_level"
                min="1"
                max="10"
                value={formData.stress_level}
                onChange={handleChange}
                className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Calm</span>
                <span>Moderate</span>
                <span>Burned Out</span>
              </div>
            </div>

            {/* Energy Level */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Coffee className="w-4 h-4 text-orange-500" />
                Energy Level: {formData.energy_level}/10
              </label>
              <input
                type="range"
                name="energy_level"
                min="1"
                max="10"
                value={formData.energy_level}
                onChange={handleChange}
                className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Exhausted</span>
                <span>Steady</span>
                <span>Hyperactive</span>
              </div>
            </div>

            {/* Productivity Score */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Productivity: {formData.productivity_score}/10
              </label>
              <input
                type="range"
                name="productivity_score"
                min="1"
                max="10"
                value={formData.productivity_score}
                onChange={handleChange}
                className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Distracted</span>
                <span>Focused</span>
                <span>Flow State</span>
              </div>
            </div>
            
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Sleep Hours */}
            <div className="flex flex-col">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Sleep Hours
              </label>
              <input
                type="number"
                name="sleep_hours"
                step="0.5"
                min="0"
                max="24"
                value={formData.sleep_hours}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white"
                required
              />
            </div>

            {/* Water Intake */}
            <div className="flex flex-col">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1">
                <Droplet className="w-3.5 h-3.5 text-blue-400" /> Water (Liters)
              </label>
              <input
                type="number"
                name="water_intake"
                step="0.1"
                min="0"
                value={formData.water_intake}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white"
                required
              />
            </div>

            {/* Exercise Minutes */}
            <div className="flex flex-col">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1">
                <Dumbbell className="w-3.5 h-3.5 text-green-500" /> Exercise (Mins)
              </label>
              <input
                type="number"
                name="exercise_minutes"
                min="0"
                value={formData.exercise_minutes}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="flex flex-col">
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-500" /> Wellbeing Notes / Reflection
            </label>
            <textarea
              name="notes"
              rows="3"
              placeholder="How was your day? Any stressors or achievements..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 bg-white resize-none"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:opacity-90 transition text-sm font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Log Check-in"}
          </button>
        </div>

      </div>
    </div>
  );
}
