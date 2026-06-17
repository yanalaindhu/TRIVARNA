import React, { useEffect } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { onboardingService } from '../../services/onboardingService';
import LoadingAnalysis from '../../components/onboarding/LoadingAnalysis';

export default function AnalysisStep({ onNext }) {
  
  const storeState = useOnboardingStore();
  const { setResults, setAIPlan } = storeState;

  useEffect(() => {
    let active = true;

    const processOnboarding = async () => {
      try {
        // Collect data payload
        const payload = {
          lifeContext: storeState.lifeContext,
          emotionData: storeState.emotionData,
          wellbeingDrivers: storeState.wellbeingDrivers,
          stressData: storeState.stressData,
          bodyData: storeState.bodyData,
          productiveWindow: storeState.productiveWindow,
          lifestyleData: storeState.lifestyleData,
          balanceWheel: storeState.balanceWheel,
          goals: storeState.goals,
        };

        // Parallel mock API calls
        const [resultsResponse, aiPlanResponse] = await Promise.all([
          onboardingService.generateProfile(payload),
          onboardingService.generateAIPlan(payload),
          onboardingService.submitOnboarding(payload),
        ]);

        if (active) {
          setResults(resultsResponse);
          setAIPlan(aiPlanResponse);
        }
      } catch (err) {
        console.error("Error generating onboarding analysis profiles", err);
      }
    };

    processOnboarding();

    // Enforce 3-second visual timing
    const timer = setTimeout(() => {
      onNext();
    }, 3000);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [onNext, setResults, setAIPlan]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <LoadingAnalysis />
    </div>
  );
}
