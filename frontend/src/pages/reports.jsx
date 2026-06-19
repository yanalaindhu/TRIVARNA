import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import ScoreCard from "../components/scorecard";
import api from "../services/api";
import { FileBarChart, Download, Sparkles, AlertTriangle, CheckCircle, RefreshCw, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ReportsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [weeklyHistory, setWeeklyHistory] = useState([]);

  const userId = localStorage.getItem("userId");

  const loadReportData = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/reports/weekly/${userId}`);
      if (response.data && !response.data.detail) {
        setReport(response.data);
      }
    } catch (err) {
      console.error("Error loading reports data:", err);
      // Fallback local mock if DB is empty or fails
      setReport({
        weekly_score: 78,
        biggest_win: "Maintained a consistent sleep schedule and logged exercise on 5 separate days.",
        main_risk: "Higher stress levels registered around midweek productivity cycles.",
        mood_trend: "Overall positive shift (Mood average 7.5/10, up +0.5).",
        habit_trend: "Habit check-in completion score stabilized at 82%.",
        coach_summary: "Your week was productive and physically active, though stress monitoring suggests keeping work blocks focused and adding small mobility breaks to combat afternoon slump."
      });
    }

    try {
      const timelineRes = await api.get(`/timeline/${userId}`);
      if (timelineRes.data && timelineRes.data.mind_score_trend) {
        const mindTrend = timelineRes.data.mind_score_trend;
        const bodyTrend = timelineRes.data.body_score_trend;
        const lifeTrend = timelineRes.data.lifestyle_score_trend;
        
        const mappedHistory = mindTrend.map((score, index) => ({
          week: `Point ${index + 1}`,
          Mind: score,
          Body: bodyTrend[index] || 0,
          Life: lifeTrend[index] || 0
        }));
        
        if (mappedHistory.length > 0) {
          setWeeklyHistory(mappedHistory);
        } else {
          setWeeklyHistory([
            { week: "Week 1", Mind: 68, Body: 72, Life: 70 }
          ]);
        }
      } else {
        setWeeklyHistory([
          { week: "Week 1", Mind: 68, Body: 72, Life: 70 }
        ]);
      }
    } catch (err) {
      console.error("Error loading timeline data:", err);
      setWeeklyHistory([
        { week: "Week 1", Mind: 68, Body: 72, Life: 70 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [userId]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading && !report) {
    return (
      <div className="flex min-h-screen bg-[#f8f8fc] justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-gray-500 font-semibold text-sm">Compiling Wellbeing Reports...</p>
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
              <FileBarChart className="w-8 h-8 text-purple-600" />
              Wellbeing Analytics & Reports
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Aggregate your wellness scores, trace long-term trends, and download comprehensive summaries.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 cursor-pointer shadow-md shadow-purple-500/20 hover:-translate-y-[1px]"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>

        {/* Weekly score cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ScoreCard title="Weekly Score" score={report?.weekly_score || 75} color="purple" subtitle="Overall balance score" />
          <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase">Weekly Win</p>
              <p className="text-xs font-bold text-gray-700 mt-1 leading-snug">{report?.biggest_win}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-gray-100/50 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-red-50 text-red-50 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase">Key Vulnerability</p>
              <p className="text-xs font-bold text-gray-700 mt-1 leading-snug">{report?.main_risk}</p>
            </div>
          </div>
        </div>

        {/* Chart section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* History Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50">
            <h3 className="font-extrabold text-gray-800 text-lg mb-6">Wellbeing Dimensions Growth</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f4" />
                  <XAxis dataKey="week" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="Mind" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Body" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Life" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Coach Summary card */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase mb-5">
                <Sparkles className="w-3 h-3 text-pink-300" />
                <span>AI Coach Weekly Report</span>
              </div>
              <h4 className="text-lg font-bold mb-3">Overall Performance Summary</h4>
              <p className="text-sm leading-relaxed text-purple-100">
                "{report?.coach_summary}"
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-center text-xs">
              <span className="text-purple-300">Trend indicators:</span>
              <span className="text-green-300 font-bold uppercase">{report?.mood_trend}</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
