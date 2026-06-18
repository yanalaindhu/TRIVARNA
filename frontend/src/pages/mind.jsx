import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import ScoreCard from "../components/scorecard";
import api from "../services/api";
import { Brain, Smile, Flame, Sparkles, BookOpen, Send, Loader2, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MindOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({ mind: 0, stress: 0, mood: 0 });
  const [checkins, setCheckins] = useState([]);
  const [journals, setJournals] = useState([]);
  const [insights, setInsights] = useState(null);
  const [newJournalContent, setNewJournalContent] = useState("");
  const [savingJournal, setSavingJournal] = useState(false);
  const [journalAnalysis, setJournalAnalysis] = useState(null);

  const userId = localStorage.getItem("userId");

  const loadMindData = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      // Fetch Dashboard
      const dashRes = await api.get(`/dashboard/${userId}`);
      if (dashRes.data) {
        const profile = dashRes.data.profile || {};
        const latest = dashRes.data.latest_checkin || {};
        setScores({
          mind: profile.mind_score || 0,
          stress: latest.stress_level || 0,
          mood: latest.mood_score || 0
        });
      }

      // Fetch Checkins History
      const checkinsRes = await api.get(`/checkins/${userId}`);
      if (checkinsRes.data) {
        // Reverse to show oldest first in chart
        const sortedCheckins = [...checkinsRes.data].reverse().map(c => ({
          ...c,
          date: new Date(c.created_at).toLocaleDateString([], { month: "short", day: "numeric" })
        }));
        setCheckins(sortedCheckins);
      }

      // Fetch Insights
      const insightsRes = await api.get(`/insights/${userId}`);
      setInsights(insightsRes.data);

      // Fetch Journals
      const journalsRes = await api.get(`/journals/${userId}`);
      setJournals(journalsRes.data || []);

    } catch (err) {
      console.error("Error loading Mind page data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMindData();
  }, [userId]);

  const handleSaveJournal = async (e) => {
    e.preventDefault();
    if (!newJournalContent.trim()) return;

    setSavingJournal(true);
    setJournalAnalysis(null);
    try {
      const payload = {
        user_id: userId,
        content: newJournalContent
      };
      const response = await api.post("/journals/", payload);
      if (response.data.success) {
        setNewJournalContent("");
        setJournalAnalysis(response.data.analysis);
        // Refresh journal list
        const updatedJournals = await api.get(`/journals/${userId}`);
        setJournals(updatedJournals.data || []);
        loadMindData(); // Refresh scores
      }
    } catch (err) {
      console.error("Failed to save journal:", err);
      alert("Error saving journal entry.");
    } finally {
      setSavingJournal(false);
    }
  };

  if (loading && checkins.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Loading Mind Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8fc] text-gray-800 antialiased">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-600" />
              Mind Wellness Overview
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Deep dive into your stress profiles, mood trends, and journaling analysis.
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ScoreCard title="Mind Score" score={scores.mind} color="purple" subtitle="Overall mental state" />
          <ScoreCard title="Mood Rating" score={scores.mood} color="orange" subtitle="Latest check-in mood" />
          <ScoreCard title="Stress Level" score={scores.stress} color="red" subtitle="Lower is better" />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 mb-8">
          <h2 className="font-extrabold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <Smile className="w-5 h-5 text-purple-600" />
            Mood & Stress Trends
          </h2>
          <div className="h-72 w-full">
            {checkins.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={checkins} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f4" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="#9ca3af" fontSize={12} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood_score" stroke="#8b5cf6" strokeWidth={3} name="Mood" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="stress_level" stroke="#ef4444" strokeWidth={3} name="Stress" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No check-in trends recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Split (Insights and Journaling) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AI Journal Analyzer */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100/50 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-gray-800 text-lg mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Reflective Journal
              </h3>
              <p className="text-xs text-gray-400 mb-4">Write down your feelings and reflections to analyze them with AI.</p>
              
              <form onSubmit={handleSaveJournal} className="space-y-4">
                <textarea
                  className="w-full border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-purple-500 bg-gray-50/50 resize-none h-40"
                  placeholder="Today I felt a bit overwhelmed, but managed to complete my tasks..."
                  value={newJournalContent}
                  onChange={(e) => setNewJournalContent(e.target.value)}
                  disabled={savingJournal}
                  required
                />
                
                <button
                  type="submit"
                  disabled={savingJournal || !newJournalContent.trim()}
                  className="flex items-center gap-2 bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-purple-700 transition cursor-pointer disabled:opacity-50"
                >
                  {savingJournal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Log Reflection</span>
                    </>
                  )}
                </button>
              </form>

              {journalAnalysis && (
                <div className="mt-6 p-4 rounded-2xl bg-purple-50/50 border border-purple-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">AI Analysis Result</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 capitalize">
                      {journalAnalysis.emotion || "Neutral"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed"><strong className="text-purple-900 font-bold">Summary:</strong> {journalAnalysis.summary}</p>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
                    <span>Sentiment Score: <strong className="text-gray-700 font-bold">{journalAnalysis.sentiment_score}</strong></span>
                    <span>Stress level detected: <strong className="text-gray-700 font-bold">{journalAnalysis.stress_level}/10</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* List of Recent Reflections */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-gray-700 text-sm mb-3">Past Reflections</h4>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {journals.map((j, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100/50 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-500">{new Date(j.created_at).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-semibold uppercase text-[8px]">{j.emotion_detected}</span>
                    </div>
                    <p className="text-gray-700 italic">"{j.content}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights & Coach Advices */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase mb-5">
                <Sparkles className="w-3 h-3 text-pink-300" />
                <span>AI Mental Wellbeing Analysis</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-purple-200 text-xs uppercase tracking-wider mb-2">Strengths</h4>
                  {insights && insights.strengths && insights.strengths.length > 0 ? (
                    <ul className="list-disc pl-5 text-xs text-purple-100 space-y-1.5">
                      {insights.strengths.slice(0, 3).map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-purple-200 italic">No strengths calculated. Add check-ins to unlock.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-red-300 text-xs uppercase tracking-wider mb-2">Risks & Vulnerabilities</h4>
                  {insights && insights.risks && insights.risks.length > 0 ? (
                    <ul className="list-disc pl-5 text-xs text-red-100 space-y-1.5">
                      {insights.risks.slice(0, 3).map((r, idx) => <li key={idx}>{r}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-purple-200 italic">No risks detected.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-yellow-300 text-xs uppercase tracking-wider mb-2">Recommendations</h4>
                  {insights && insights.recommendations && insights.recommendations.length > 0 ? (
                    <ul className="list-disc pl-5 text-xs text-yellow-100 space-y-1.5">
                      {insights.recommendations.slice(0, 3).map((rec, idx) => <li key={idx}>{rec}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-purple-200 italic">No recommendations yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4 flex justify-between items-center text-xs">
              <span className="text-purple-300">Coach suggestions synced:</span>
              <button 
                onClick={loadMindData}
                className="flex items-center gap-1.5 text-pink-300 font-bold hover:underline cursor-pointer"
              >
                <span>Trigger Refresh</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
