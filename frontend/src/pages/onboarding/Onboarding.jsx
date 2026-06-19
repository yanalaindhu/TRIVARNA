import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import ProgressStepper from '../../components/onboarding/ProgressStepper';
import { motion, AnimatePresence } from 'framer-motion';
import bgImage from '../../assets/backgound.png';

// Import step components
import WelcomeStep from './WelcomeStep';
import LifeContextStep from './LifeContextStep';
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

export default function Onboarding() {
  const navigate = useNavigate();
  const { currentStep, nextStep, prevStep } = useOnboardingStore();

  const handleNext = () => {
    if (currentStep === 12) {
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
        return <WellbeingDriversStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <StressAssessmentStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <BodyAssessmentStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <ProductiveHoursStep onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <LifestyleAssessmentStep onNext={handleNext} onBack={handleBack} />;
      case 8:
        return <BalanceWheelStep onNext={handleNext} onBack={handleBack} />;
      case 9:
        return <GoalsStep onNext={handleNext} onBack={handleBack} />;
      case 10:
        return <AnalysisStep onNext={handleNext} />;
      case 11:
        return <ResultsStep onNext={handleNext} onBack={handleBack} />;
      case 12:
        return <AIPlanStep onNext={handleNext} onBack={handleBack} />;
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  // Determine if we should show the stepper header (only for diagnostic questionnaire steps 2-9)
  const isQuestionnaireStep = currentStep >= 2 && currentStep <= 9;

  return (
    <div 
      className="min-h-screen flex flex-col justify-between antialiased bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* 1. Global Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 py-3 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img
              src="/logo.png"
              alt="Trivarna Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-black text-slate-800 tracking-tight">
              TRIVARNA
            </span>
          </div>
          {isQuestionnaireStep && (
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Onboarding Assessment
            </div>
          )}
        </div>
      </header>

      {/* 2. Onboarding Main Body Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-300">
          
          {/* Diagnostic stepper header */}
          {isQuestionnaireStep && (
            <div className="mb-8 pb-6 border-b border-gray-100">
              <ProgressStepper
                currentStep={currentStep - 1} // questionnaire steps are index 1 to 8
                totalSteps={8} // 8 diagnostic steps
              />
            </div>
          )}

          {/* Render Active Step with smooth transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 3. Global Footer */}
      <footer className="bg-white/70 backdrop-blur-md border-t border-white/20 py-4 text-center text-xs text-gray-500 font-medium">
        <div className="max-w-6xl mx-auto px-6">
          © {new Date().getFullYear()} TRIVARNA. All rights reserved. • Mind • Body • Life Alignment System
        </div>
      </footer>
    </div>
  );
}
