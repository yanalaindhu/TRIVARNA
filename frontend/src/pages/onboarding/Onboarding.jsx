import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import ProgressStepper from '../../components/onboarding/ProgressStepper';

// Import step components
import WelcomeStep from './WelcomeStep';
import LifeContextStep from './LifeContextStep';
import EmotionStep from './EmotionStep';
import WellbeingDriversStep from './WellbeingDriversStep';
import StressAssessmentStep from './StressAssessmentStep';
import BodyAssessmentStep from './BodyAssessmentStep';
import ProductiveHoursStep from './ProductiveHoursStep';
import LifestyleAssessmentStep from './LifestyleAssessmentStep';
import BalanceWheelStep from './BalanceWheelStep';
import GoalsStep from './GoalsStep';
import AnalysisStep from './AnalysisStep';
import ResultsStep from './ResultsStep';
import AIPlanStep from './AIPlanStep';

import { Compass } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { currentStep, nextStep, prevStep } = useOnboardingStore();

  const handleNext = () => {
    if (currentStep === 13) {
      // Direct user to dashboard on completion of AI Plan
      navigate('/dashboard');
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  // Render the active step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return <LifeContextStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <EmotionStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <WellbeingDriversStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <StressAssessmentStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <BodyAssessmentStep onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <ProductiveHoursStep onNext={handleNext} onBack={handleBack} />;
      case 8:
        return <LifestyleAssessmentStep onNext={handleNext} onBack={handleBack} />;
      case 9:
        return <BalanceWheelStep onNext={handleNext} onBack={handleBack} />;
      case 10:
        return <GoalsStep onNext={handleNext} onBack={handleBack} />;
      case 11:
        return <AnalysisStep onNext={handleNext} />;
      case 12:
        return <ResultsStep onNext={handleNext} onBack={handleBack} />;
      case 13:
        return <AIPlanStep onNext={handleNext} onBack={handleBack} />;
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  // Determine if we should show the stepper header (only for diagnostic questionnaire steps 2-10)
  const isQuestionnaireStep = currentStep >= 2 && currentStep <= 10;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between antialiased">
      {/* 1. Global Navigation Bar */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-light-purple text-primary-purple border border-primary-purple/20 rounded-xl flex items-center justify-center shadow-inner">
              <Compass className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xl font-black text-text-primary tracking-tight">
              TRIVARNA
            </span>
          </div>
          {isQuestionnaireStep && (
            <div className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Diagnostic Assessment
            </div>
          )}
        </div>
      </header>

      {/* 2. Onboarding Main Body Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-10 transition-all duration-300">
          
          {/* Diagnostic stepper header */}
          {isQuestionnaireStep && (
            <div className="mb-8 pb-6 border-b border-gray-100">
              <ProgressStepper
                currentStep={currentStep - 1} // questionnaire steps are index 1 to 9
                totalSteps={9} // 9 diagnostic steps
              />
            </div>
          )}

          {/* Render Active Step with smooth transitions */}
          <div className="transition-all duration-300 ease-in-out">
            {renderStepContent()}
          </div>
        </div>
      </main>

      {/* 3. Global Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 text-center text-xs text-text-secondary">
        <div className="max-w-6xl mx-auto px-6">
          © {new Date().getFullYear()} TRIVARNA. All rights reserved. • Mind • Body • Soul Alignment System
        </div>
      </footer>
    </div>
  );
}
