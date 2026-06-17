import React from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { STRESS_QUESTIONS } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import RatingScale from '../../components/onboarding/RatingScale';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function StressAssessmentStep({ onNext, onBack }) {
  const { stressData, updateStressData } = useOnboardingStore();

  const handleRatingChange = (id, val) => {
    updateStressData({ [id]: val });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <QuestionCard
        title="Stress & Burnout Assessment"
        subtitle="Please rate how frequently you experience each statement in your typical week."
      >
        <div className="space-y-6">
          {STRESS_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-primary-purple/20 transition-all duration-200"
            >
              <h4 className="text-base font-bold text-text-primary">
                {q.label}
              </h4>
              <RatingScale
                type="likert"
                value={stressData[q.id] || 3}
                onChange={(val) => handleRatingChange(q.id, val)}
              />
            </div>
          ))}
        </div>
      </QuestionCard>

      <NavigationButtons
        onNext={onNext}
        onBack={onBack}
      />
    </div>
  );
}
