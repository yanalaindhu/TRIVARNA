import React from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { LIFESTYLE_QUESTIONS } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import RatingScale from '../../components/onboarding/RatingScale';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function LifestyleAssessmentStep({ onNext, onBack }) {
  const { lifestyleData, updateLifestyleData } = useOnboardingStore();

  const handleRatingChange = (id, val) => {
    updateLifestyleData({ [id]: val });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <QuestionCard
        title="Lifestyle Assessment"
        subtitle="These questions evaluate execution habits, distraction management, and routine consistency."
      >
        <div className="space-y-6">
          {LIFESTYLE_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-primary-purple/20 transition-all duration-200"
            >
              <h4 className="text-base font-bold text-text-primary">
                {q.label}
              </h4>
              <RatingScale
                type="likert"
                value={lifestyleData[q.id] || 3}
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
