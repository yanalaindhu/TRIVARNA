import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { EMOTION_QUESTIONS } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import MultiSelectCard from '../../components/onboarding/MultiSelectCard';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function EmotionStep({ onNext, onBack }) {
  const { emotionData, updateEmotionData } = useOnboardingStore();
  const [error, setError] = useState('');

  const selectedFeelings = emotionData.feelings || [];
  const selectedTriggers = emotionData.triggers || [];

  // Determine if negative emotions are selected
  const hasNegativeSelected = selectedFeelings.some((id) => {
    const matched = EMOTION_QUESTIONS.feelings.options.find((opt) => opt.id === id);
    return matched && !matched.isPositive;
  });

  const handleToggleFeeling = (id) => {
    setError('');
    let newFeelings;
    if (selectedFeelings.includes(id)) {
      newFeelings = selectedFeelings.filter((item) => item !== id);
    } else {
      newFeelings = [...selectedFeelings, id];
    }
    updateEmotionData({ feelings: newFeelings });
  };

  const handleToggleTrigger = (id) => {
    setError('');
    let newTriggers;
    if (selectedTriggers.includes(id)) {
      newTriggers = selectedTriggers.filter((item) => item !== id);
    } else {
      newTriggers = [...selectedTriggers, id];
    }
    updateEmotionData({ triggers: newTriggers });
  };

  const handleNext = () => {
    if (selectedFeelings.length === 0) {
      setError('Please select at least one feeling.');
      return;
    }
    if (hasNegativeSelected && selectedTriggers.length === 0) {
      setError('Please select at least one contributing factor for these feelings.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-fadeIn">
      {/* 1. Main Feelings Question */}
      <QuestionCard
        title={EMOTION_QUESTIONS.feelings.question}
        subtitle="Select all emotions that apply to your experience over the past week."
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EMOTION_QUESTIONS.feelings.options.map((opt) => (
            <MultiSelectCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              isSelected={selectedFeelings.includes(opt.id)}
              onToggle={handleToggleFeeling}
            />
          ))}
        </div>
      </QuestionCard>

      {/* 2. Conditional Triggers Question */}
      {hasNegativeSelected && (
        <div className="border-t border-gray-100 pt-6 mt-6 transition-all duration-300">
          <QuestionCard
            title={EMOTION_QUESTIONS.triggers.question}
            subtitle="Let's isolate what is driving these heavier emotional states."
            error={error}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {EMOTION_QUESTIONS.triggers.options.map((opt) => (
                <MultiSelectCard
                  key={opt.id}
                  id={opt.id}
                  label={opt.label}
                  isSelected={selectedTriggers.includes(opt.id)}
                  onToggle={handleToggleTrigger}
                />
              ))}
            </div>
          </QuestionCard>
        </div>
      )}

      {/* If no negative selected, show error at the bottom (feelings validator) */}
      {!hasNegativeSelected && error && (
        <div className="text-danger-red bg-red-50 border border-red-100 p-3.5 rounded-xl text-sm mt-4">
          {error}
        </div>
      )}

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        isNextDisabled={selectedFeelings.length === 0 || (hasNegativeSelected && selectedTriggers.length === 0)}
      />
    </div>
  );
}
