import { useEffect } from "react";
import { useOnboardingStore } from "../../../store/onboardingStore";
import { useProfileStore } from "../store/profileStore";
import {
  fetchBackendProfile,
  fetchBackendDashboard,
  fetchBackendOnboardingProfile
} from "../services/profileService";
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_BALANCE_WHEEL,
  DEFAULT_RESULTS,
  DEFAULT_AI_PLAN,
  DEFAULT_GOALS
} from "../constants/profileConfig";

const DEFAULT_USER_ID = "d2af0e65-c7d3-4e42-a2ee-8406f6648ef6";

/**
 * Normalizes backend profile, dashboard, or onboarding data with Zustand store state and config fallbacks.
 */
const normalizeData = (backendData, onboardingData) => {
  // 1. User
  const user = {
    name: backendData?.user?.name || onboardingData?.lifeContext?.name || DEFAULT_USER_PROFILE.name,
    email: backendData?.user?.email || DEFAULT_USER_PROFILE.email,
    role: backendData?.user?.role || DEFAULT_USER_PROFILE.role,
    joinDate: backendData?.user?.joinDate || DEFAULT_USER_PROFILE.joinDate,
    streak: backendData?.user?.streak || DEFAULT_USER_PROFILE.streak,
    level: backendData?.user?.level || DEFAULT_USER_PROFILE.level,
  };

  // 2. Scores
  const rawResults = onboardingData?.results || {};
  const scores = {
    mindScore: backendData?.mindScore ?? backendData?.mind_score ?? rawResults.mindScore ?? DEFAULT_RESULTS.mindScore,
    bodyScore: backendData?.bodyScore ?? backendData?.body_score ?? rawResults.bodyScore ?? DEFAULT_RESULTS.bodyScore,
    lifestyleScore: backendData?.lifestyleScore ?? backendData?.lifestyle_score ?? rawResults.lifestyleScore ?? DEFAULT_RESULTS.lifestyleScore,
    overallScore: backendData?.overallScore ?? backendData?.overall_score ?? rawResults.overallScore ?? DEFAULT_RESULTS.overallScore,
  };

  // 3. Goals
  const rawGoals = onboardingData?.goals || {};
  const goals = {
    selectedGoals: backendData?.goals?.selectedGoals || rawGoals.selectedGoals || DEFAULT_GOALS.selectedGoals,
    primaryGoal: backendData?.goals?.primaryGoal || rawGoals.primaryGoal || rawResults.primaryGoal || DEFAULT_GOALS.primaryGoal,
    sixMonthVision: backendData?.goals?.sixMonthVision || rawGoals.sixMonthVision || DEFAULT_GOALS.sixMonthVision,
  };

  // 4. AI Plan
  const rawAiPlan = onboardingData?.aiPlan || {};
  const aiPlan = {
    wakeTime: backendData?.aiPlan?.wakeTime ?? backendData?.aiPlan?.wake_time ?? rawAiPlan.wakeTime ?? DEFAULT_AI_PLAN.wakeTime,
    sleepTarget: backendData?.aiPlan?.sleepTarget ?? backendData?.aiPlan?.sleep_target ?? rawAiPlan.sleepTarget ?? DEFAULT_AI_PLAN.sleepTarget,
    schedule: backendData?.aiPlan?.schedule || rawAiPlan.schedule || DEFAULT_AI_PLAN.schedule,
  };

  // 5. Balance Wheel (mapped to Recharts format: 0 to 10 scale)
  const rawWheel = backendData?.balanceWheel || onboardingData?.balanceWheel || DEFAULT_BALANCE_WHEEL;
  const balanceWheel = [
    { subject: "Mental Health", value: rawWheel.mentalHealth ?? rawWheel.mental_health ?? 7, fullMark: 10 },
    { subject: "Physical Health", value: rawWheel.physicalHealth ?? rawWheel.physical_health ?? 6, fullMark: 10 },
    { subject: "Career", value: rawWheel.career ?? 8, fullMark: 10 },
    { subject: "Relationships", value: rawWheel.relationships ?? 7, fullMark: 10 },
    { subject: "Personal Growth", value: rawWheel.personalGrowth ?? rawWheel.personal_growth ?? 9, fullMark: 10 },
    { subject: "Finances", value: rawWheel.finances ?? 5, fullMark: 10 },
    { subject: "Leisure & Fun", value: rawWheel.leisure ?? rawWheel.leisure_fun ?? 6, fullMark: 10 },
    { subject: "Daily Routine", value: rawWheel.routine ?? 7, fullMark: 10 },
  ];

  // 6. Insights
  const insights = {
    primaryGoal: goals.primaryGoal,
    productiveWindow: backendData?.insights?.productiveWindow || rawResults.productiveWindow || onboardingData?.productiveWindow || DEFAULT_RESULTS.productiveWindow,
    burnoutRisk: backendData?.insights?.burnoutRisk || backendData?.burnout_risk || rawResults.burnoutRisk || DEFAULT_RESULTS.burnoutRisk,
    coachSummary: backendData?.insights?.coachSummary || backendData?.coach_summary || rawResults.coachSummary || DEFAULT_RESULTS.coachSummary,
    strengths: backendData?.insights?.strengths || rawResults.strengths || DEFAULT_RESULTS.strengths,
    risks: backendData?.insights?.risks || rawResults.risks || DEFAULT_RESULTS.risks,
    focusAreas: backendData?.insights?.focusAreas || rawResults.focusAreas || DEFAULT_RESULTS.focusAreas,
  };

  return { user, scores, goals, aiPlan, balanceWheel, insights };
};

export const useProfileData = () => {
  const onboardingStore = useOnboardingStore();
  const { profileData, loading, error, isSynced, setProfileData, setLoading, setError } = useProfileStore();

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      // Don't trigger loading state if we already have data
      if (!profileData) {
        setLoading(true);
      }

      const userId = localStorage.getItem("user_id") || DEFAULT_USER_ID;

      try {
        // Safe backend fetch checks
        const [profileRes, dashboardRes, onboardingProfileRes] = await Promise.all([
          fetchBackendProfile(userId),
          fetchBackendDashboard(userId),
          fetchBackendOnboardingProfile(userId)
        ]);

        if (!active) return;

        // If any backend requests returned valid profile data, merge them
        const hasBackendData = !!(profileRes || dashboardRes || onboardingProfileRes);
        const mergedBackendData = {
          ...(profileRes || {}),
          ...(dashboardRes?.latest_scores ? { mind_score: dashboardRes.latest_scores.mind_score, body_score: dashboardRes.latest_scores.body_score, lifestyle_score: dashboardRes.latest_scores.lifestyle_score, overall_score: dashboardRes.latest_scores.overall_score } : {}),
          ...(onboardingProfileRes?.data || {})
        };

        const normalized = normalizeData(
          hasBackendData ? mergedBackendData : null, 
          onboardingStore
        );

        setProfileData(normalized, hasBackendData);
      } catch (err) {
        if (!active) return;
        console.error("useProfileData: Error fetching profile", err);
        setError(err.message || "Failed to retrieve profile data");
        
        // Final fallback to onboardingStore & default constants
        const normalized = normalizeData(null, onboardingStore);
        setProfileData(normalized, false);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [
    onboardingStore.results,
    onboardingStore.aiPlan,
    onboardingStore.goals,
    onboardingStore.balanceWheel,
    onboardingStore.lifeContext,
    onboardingStore.productiveWindow,
    setProfileData,
    setLoading,
    setError
  ]);

  return {
    profileData,
    loading,
    error,
    isSynced
  };
};
