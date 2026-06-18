import React, { useEffect, useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import {
  saveOnboarding,
  generateProfile,
  generateAIPlan
} from '../../services/onboardingService';
import LoadingAnalysis from '../../components/onboarding/LoadingAnalysis';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function AnalysisStep({ onNext, onBack }) {
  const storeState = useOnboardingStore();
  const { setResults, setAIPlan, prevStep } = storeState;
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const processOnboarding = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🚀 Starting onboarding analysis...');

      const payload = {
        user_id: localStorage.getItem("userId") || "",
        life_context: storeState.lifeContext || {},
        emotion_data: storeState.emotionData || { feelings: [], triggers: [] },
        wellbeing_drivers: storeState.wellbeingDrivers || [],
        stress_data: storeState.stressData || {},
        body_data: storeState.bodyData || {},
        productive_window: storeState.productiveWindow || "Morning",
        lifestyle_data: storeState.lifestyleData || {},
        balance_wheel: storeState.balanceWheel || {},
        goals: storeState.goals || {},
      };

      const startTime = Date.now();
      const userId = localStorage.getItem("userId");
      console.log("USER ID =", userId);

      if (!userId) {
        throw new Error("User session ID not found. Please try logging in again.");
      }

      // 1. Save onboarding questionnaire answers
      await saveOnboarding(payload);
      console.log('✅ Onboarding answers saved');

      // 2. Generate profile scores & diagnostics
      const resultsResponse = await generateProfile(userId);
      console.log('✅ Profile generated:', resultsResponse);

      // 3. Generate AI plan schedule
      const aiPlanResponse = await generateAIPlan(userId);
      console.log('✅ AI Plan generated:', aiPlanResponse);

      // Ensure analysis animation shows for at least 3 seconds
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 3000) {
        await new Promise((resolve) =>
          setTimeout(resolve, 3000 - elapsedTime)
        );
      }

      // Normalize profiles response data from snake_case to camelCase
      const analysis = resultsResponse.analysis?.[0] || {};
      const normalizedResults = {
        mindScore: analysis.mind_score || 0,
        bodyScore: analysis.body_score || 0,
        lifestyleScore: analysis.lifestyle_score || 0,
        overallScore: analysis.overall_score || 0,
        burnoutRisk: analysis.burnout_risk || "Low",
        coachSummary: analysis.coach_summary || "",
        strengths: analysis.strengths || [],
        risks: analysis.risks || [],
        focusAreas: analysis.focus_areas || [],
        productiveWindow: storeState.productiveWindow || "Morning",
        primaryGoal: storeState.goals?.primaryGoal || "Balance",
        hydration: storeState.bodyData?.hydration || 8
      };

      // Normalize AI schedule plan from snake_case to camelCase
      const plan = aiPlanResponse.plan?.[0] || {};
      const normalizedAIPlan = {
        wakeTime: plan.wake_time || "06:00 AM",
        sleepTarget: plan.sleep_target || "10:00 PM",
        schedule: plan.schedule || []
      };

      setResults(normalizedResults);
      setAIPlan(normalizedAIPlan);

      console.log('✅ Results stored in Zustand');
      console.log('➡️ Moving to Results Step');

      setLoading(false);
      onNext();
    } catch (err) {
      console.error('❌ Error generating onboarding analysis:', err);
      const errMsg = err.response?.data?.detail || err.message || "An unexpected error occurred during profile analysis.";
      setError(errMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    processOnboarding();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingAnalysis />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-red-50/50 border border-red-100 rounded-3xl max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="p-4 bg-red-100 text-red-600 rounded-full">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">Analysis Generation Failed</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {error}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={prevStep}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back & Edit Answers</span>
          </button>
          
          <button
            onClick={processOnboarding}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Onboarding Analysis</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}