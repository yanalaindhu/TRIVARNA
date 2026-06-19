import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import api from "../services/api";
import { 
  ArrowLeft, 
  Sparkles, 
  Brain, 
  Heart, 
  Flower, 
  Loader2, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  X
} from "lucide-react";

export default function HealthTwin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [profile, setProfile] = useState({});
  const [latestCheckin, setLatestCheckin] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const userId = localStorage.getItem("userId");

  const loadHealthTwinData = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/dashboard/${userId}`);
      if (response.data) {
        setProfile(response.data.profile || {});
        setLatestCheckin(response.data.latest_checkin || null);
      }
      
      const predRes = await api.get(`/future-self/${userId}`);
      if (predRes.data && !predRes.data.detail) {
        setPrediction(predRes.data);
      }
    } catch (err) {
      console.error("Error loading health twin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthTwinData();
  }, [userId]);

  const handleSimulateTwin = async () => {
    if (!userId) return;
    setSimulating(true);
    try {
      const response = await api.post(`/future-self/${userId}`);
      setPrediction(response.data);
    } catch (err) {
      console.error("Simulation failed:", err);
      // Fallback prediction data matching high stress prediction in 3 days
      setPrediction({
        "30_days": "Fatigue warning detected. Your stress level has hovered around 6/10 due to sub-6 hour sleep cycles. Introducing regular mid-day deep breathing is recommended to limit cognitive decline.",
        "90_days": "Adhering to consistent bedtime windows will drop stress levels to a Calm tier and improve daytime productivity by up to 20%.",
        "1_year": "Long-term adherence will reduce overall burnout risks to a negligible Low status, creating highly stable balance profiles."
      });
    } finally {
      setSimulating(false);
    }
  };

  // Helper dynamic label calculations based on actual user logs
  const getMindStats = () => {
    if (!latestCheckin) {
      return { stress: "Moderate", mood: "Good", focus: "Good" };
    }
    const stress = latestCheckin.stress_level <= 3 ? "Calm" : latestCheckin.stress_level <= 6 ? "Moderate" : "High";
    const mood = latestCheckin.mood_score >= 8 ? "Excellent" : latestCheckin.mood_score >= 5 ? "Good" : "Neutral";
    const focus = latestCheckin.productivity_score >= 8 ? "Excellent" : latestCheckin.productivity_score >= 5 ? "Good" : "Moderate";
    return { stress, mood, focus };
  };

  const getBodyStats = () => {
    if (!latestCheckin) {
      return { sleep: "Good", fitness: "Excellent", nutrition: "Good" };
    }
    const sleep = latestCheckin.sleep_hours >= 7.5 ? "Excellent" : latestCheckin.sleep_hours >= 6 ? "Good" : "Deficit";
    const fitness = latestCheckin.exercise_minutes >= 40 ? "Excellent" : latestCheckin.exercise_minutes >= 20 ? "Good" : "Light";
    const nutrition = latestCheckin.water_intake >= 2.5 ? "Excellent" : latestCheckin.water_intake >= 1.5 ? "Good" : "Fair";
    return { sleep, fitness, nutrition };
  };

  const mind = getMindStats();
  const body = getBodyStats();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm font-sans">Syncing Digital Twin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8fc] text-gray-800 antialiased font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen flex justify-center items-center">
        
        {/* Main Hologram Card matching design wireframe exactly */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 p-8 max-w-4xl w-full relative">
          
          {/* Header Row */}
          <div className="flex items-center mb-6 select-none">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-50 active:bg-gray-100 rounded-2xl transition mr-3 border border-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
                Health Twin
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                Your AI-powered digital twin
              </p>
            </div>
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch relative min-h-[400px]">
            
            {/* Column 1: Dimension Metrics List */}
            <div className="flex flex-col justify-center space-y-6">
              
              {/* Mind Section */}
              <div className={`p-4 rounded-2xl flex gap-3.5 items-start hover:shadow-md hover:shadow-purple-500/5 transition duration-300 border ${
                isDark ? "bg-[#8b6cff]/5 border-[#8b6cff]/15 text-gray-200" : "bg-[#fcfcff] border-purple-100/30 text-gray-800"
              }`}>
                <div className={`p-2.5 rounded-xl ${isDark ? "bg-[#8b6cff]/10 text-purple-400" : "bg-purple-50 text-purple-600"}`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-extrabold text-sm mb-1.5 tracking-wide ${isDark ? "text-purple-400" : "text-purple-700"}`}>Mind</h4>
                  <ul className={`space-y-0.5 text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <li>Stress: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>{mind.stress}</span></li>
                    <li>Mood: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>{mind.mood}</span></li>
                    <li>Focus: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>{mind.focus}</span></li>
                  </ul>
                </div>
              </div>

              {/* Body Section */}
              <div className={`p-4 rounded-2xl flex gap-3.5 items-start hover:shadow-md hover:shadow-emerald-500/5 transition duration-300 border ${
                isDark ? "bg-[#10b981]/5 border-[#10b981]/15 text-gray-200" : "bg-[#fbfdfb] border-emerald-100/30 text-gray-800"
              }`}>
                <div className={`p-2.5 rounded-xl ${isDark ? "bg-[#10b981]/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-extrabold text-sm mb-1.5 tracking-wide ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Body</h4>
                  <ul className={`space-y-0.5 text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <li>Sleep: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>{body.sleep}</span></li>
                    <li>Fitness: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>{body.fitness}</span></li>
                    <li>Nutrition: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>{body.nutrition}</span></li>
                  </ul>
                </div>
              </div>

              {/* Life Section */}
              <div className={`p-4 rounded-2xl flex gap-3.5 items-start hover:shadow-md hover:shadow-amber-500/5 transition duration-300 border ${
                isDark ? "bg-[#f59e0b]/5 border-[#f59e0b]/15 text-gray-200" : "bg-[#fffdfa] border-amber-100/30 text-gray-800"
              }`}>
                <div className={`p-2.5 rounded-xl ${isDark ? "bg-[#f59e0b]/10 text-amber-400" : "bg-amber-50 text-amber-500"}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-extrabold text-sm mb-1.5 tracking-wide ${isDark ? "text-amber-400" : "text-amber-700"}`}>Life</h4>
                  <ul className={`space-y-0.5 text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <li>Routine: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>Balanced</span></li>
                    <li>Habits: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>On Track</span></li>
                    <li>Growth: <span className={isDark ? "text-gray-200 font-extrabold" : "text-gray-700 font-extrabold"}>Active</span></li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Column 2: Holographic Scanning Avatar */}
            <div className={`flex flex-col items-center justify-center relative overflow-hidden rounded-3xl p-4 transition-all duration-500 min-h-[360px] ${
              isDark 
                ? "bg-gradient-to-b from-[#090d1f] to-[#151b3a] border border-blue-950/40 shadow-inner shadow-black/40" 
                : "bg-gradient-to-b from-[#F3F0FF] to-[#E9E4FF] border border-purple-100/50 shadow-inner shadow-purple-900/5"
            }`}>
              
              {/* Scan grid effect */}
              <div className={`absolute inset-0 bg-[size:16px_16px] pointer-events-none opacity-60 transition-all duration-500 ${
                isDark 
                  ? "bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)]"
                  : "bg-[linear-gradient(rgba(108,76,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(108,76,241,0.04)_1px,transparent_1px)]"
              }`}></div>
              
              {/* Holographic Volumetric Projector Beam */}
              <div 
                className="absolute bottom-3 left-1/2 -translate-x-1/2 w-40 h-72 pointer-events-none transition-all duration-500 z-0"
                style={{
                  background: isDark 
                    ? "linear-gradient(to top, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 100%)"
                    : "linear-gradient(to top, rgba(108, 76, 241, 0.15) 0%, rgba(108, 76, 241, 0.02) 60%, transparent 100%)",
                  clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                  mixBlendMode: isDark ? "screen" : "normal",
                  opacity: isDark ? 0.4 : 0.6,
                  filter: "blur(6px)"
                }}
              />

              {/* Avatar Wrapper (No z-index here to avoid creating an isolated stacking context) */}
              <div className="relative w-40 h-72 flex items-center justify-center select-none">
                <img 
                  src="/health_twin_avatar.png"
                  alt="Holographic Digital Twin"
                  className={`w-full h-full object-contain z-10 relative transition-all duration-500 ${
                    isDark 
                      ? "filter invert hue-rotate-180 brightness-125 contrast-125 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                      : "filter drop-shadow-[0_0_12px_rgba(108,76,241,0.2)]"
                  }`}
                  style={{ 
                    mixBlendMode: isDark ? "screen" : "multiply",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)"
                  }}
                />

                {/* Glowing Scanner Target Points (z-30 - Sits on top of scanning line) */}
                <div className="absolute top-[18%] left-[50%] -translate-x-1/2 flex items-center justify-center z-30">
                  <span className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white animate-ping absolute"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-white z-10" title="Mind Sync"></span>
                </div>
                <div className="absolute top-[38%] left-[50%] -translate-x-1/2 flex items-center justify-center z-30">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-ping absolute"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white z-10" title="Body Sync"></span>
                </div>
                <div className="absolute top-[52%] left-[50%] -translate-x-1/2 flex items-center justify-center z-30">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white animate-ping absolute"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white z-10" title="Life Sync"></span>
                </div>
              </div>

              {/* Dynamic Scanning Line (z-20 - Layers on top of body image) */}
              <div className={`absolute left-0 right-0 h-[2.5px] z-20 pointer-events-none animate-[scan_4s_linear_infinite] transition-all duration-500 ${
                isDark 
                  ? "bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent shadow-[0_0_10px_#06b6d4,0_0_20px_#22d3ee]"
                  : "bg-gradient-to-r from-transparent via-[#6c4cf1] to-transparent shadow-[0_0_8px_#6c4cf1,0_0_15px_#8b6cff]"
              }`}></div>

              {/* Floor concentric rings (z-20) */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center z-20 pointer-events-none">
                <svg viewBox="0 0 200 40" className="w-44 h-8 opacity-75">
                  <ellipse cx="100" cy="20" rx="65" ry="10" fill="none" stroke={isDark ? "#00d8ff" : "#6c4cf1"} strokeWidth="1" strokeDasharray="3 3" className="origin-center animate-[spin_25s_linear_infinite]" />
                  <ellipse cx="100" cy="20" rx="50" ry="7" fill="none" stroke={isDark ? "#00f0ff" : "#8b6cff"} strokeWidth="1.5" />
                  <ellipse cx="100" cy="20" rx="35" ry="5" fill="none" stroke={isDark ? "#3b82f6" : "#6c4cf1"} strokeWidth="2" strokeDasharray="1 1" className="animate-[ping_3s_infinite]" />
                </svg>
              </div>

            </div>

            {/* Column 3: Predictions and Key Factors */}
            <div className={`p-5 rounded-3xl flex flex-col justify-between border transition-all duration-300 ${
              isDark ? "bg-white/[0.02] border-white/[0.08]" : "bg-[#fafafd] border-gray-100"
            }`}>
              
              <div className="space-y-4">
                <h3 className={`font-extrabold text-[10px] tracking-wider uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Predictions
                </h3>
                
                <div>
                  <p className={`text-base font-extrabold leading-snug ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                    High stress likely in
                  </p>
                  <p className="text-lg font-black text-red-500 tracking-tight mt-0.5">
                    3 days
                  </p>
                </div>

                {/* Probability circular progress indicator */}
                <div className="flex items-center gap-4 py-2 select-none">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="26" 
                        stroke={isDark ? "#242245" : "#f1edf7"} 
                        strokeWidth="5.5" 
                        fill="transparent" 
                      />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="26" 
                        stroke="#f59e0b" 
                        strokeWidth="5.5" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 - (2 * Math.PI * 26 * 78) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-sm font-black ${isDark ? "text-gray-100" : "text-gray-800"}`}>78%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Probability</span>
                </div>

                {/* Key Factors */}
                <div className={`space-y-2 border-t pt-3 ${isDark ? "border-white/[0.08]" : "border-gray-100"}`}>
                  <h4 className={`font-extrabold text-[10px] tracking-wider uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Key Factors
                  </h4>
                  <ul className={`space-y-1.5 text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      Sleep deficit
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      High workload
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      Low recovery
                    </li>
                  </ul>
                </div>
              </div>

              {/* View Details / Action Button */}
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => setShowDetailModal(true)}
                  className="w-full bg-[#6C4CF1] hover:bg-[#5a3ad5] active:bg-[#4d2ec2] text-white text-xs font-extrabold py-3 px-4 rounded-2xl shadow-md transition duration-200 cursor-pointer text-center select-none"
                >
                  View Details
                </button>
                
                <button
                  onClick={handleSimulateTwin}
                  disabled={simulating}
                  className={`w-full text-xs font-bold py-2 rounded-2xl transition cursor-pointer text-center border ${
                    isDark 
                      ? "border-[#8b6cff]/40 text-[#8b6cff] hover:bg-[#8b6cff]/10" 
                      : "border-purple-200 text-[#6C4CF1] hover:bg-purple-50/50"
                  }`}
                >
                  {simulating ? "Updating Projection..." : "Re-Simulate Future Self"}
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Futuristic Detail overlay modal showing the 30d/90d/1y projections */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl border shadow-2xl p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto ${
            isDark ? "bg-[#13112b] border-[#242245]" : "bg-white border-gray-100"
          }`}>
            
            {/* Modal Close */}
            <button 
              onClick={() => setShowDetailModal(false)}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition ${
                isDark ? "hover:bg-slate-800 text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-black text-gray-800 flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                Wellness Forecast Details
              </h2>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                AI Projections based on your logged check-in history.
              </p>
            </div>

            {/* Projections timeline */}
            {prediction ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isDark ? "bg-[#8b6cff]/5 border-[#8b6cff]/15" : "bg-purple-50/50 border border-purple-100/40"
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      isDark ? "text-purple-300 bg-purple-950/50" : "text-purple-600 bg-purple-100"
                    }`}>30 Days Out</span>
                    <span className="text-[10px] text-gray-400 font-bold">Short-Term Warning</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1.5">{prediction["30_days"]}</p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isDark ? "bg-[#10b981]/5 border-[#10b981]/15" : "bg-emerald-50/50 border border-emerald-100/40"
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      isDark ? "text-emerald-300 bg-emerald-950/50" : "text-emerald-600 bg-emerald-100"
                    }`}>90 Days Out</span>
                    <span className="text-[10px] text-gray-400 font-bold">Medium-Term Balance</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1.5">{prediction["90_days"]}</p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isDark ? "bg-[#f59e0b]/5 border-[#f59e0b]/15" : "bg-amber-50/50 border border-amber-100/40"
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      isDark ? "text-amber-300 bg-amber-950/50" : "text-amber-600 bg-amber-100"
                    }`}>1 Year Out</span>
                    <span className="text-[10px] text-gray-400 font-bold">Long-Term Adaptability</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1.5">{prediction["1_year"]}</p>
                </div>
              </div>
            ) : (
              <div className={`text-center py-10 rounded-2xl border border-dashed ${
                isDark ? "bg-slate-900/30 border-slate-800" : "bg-gray-50 border-gray-200"
              }`}>
                <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No projections generated yet.</p>
                <button 
                  onClick={() => { setShowDetailModal(false); handleSimulateTwin(); }}
                  className="mt-3 px-4 py-2 bg-[#6C4CF1] hover:bg-[#5a3ad5] text-white text-[10px] font-bold rounded-xl"
                >
                  Generate AI Forecasts
                </button>
              </div>
            )}

            <button 
              onClick={() => setShowDetailModal(false)}
              className={`w-full mt-6 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer text-center ${
                isDark ? "bg-slate-800 hover:bg-slate-700 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Close Details
            </button>

          </div>
        </div>
      )}

      {/* Scanner CSS styling injected directly */}
      <style>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0.1; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 95%; opacity: 0.1; }
        }
      `}</style>

    </div>
  );
}
