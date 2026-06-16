import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { GOALS_QUESTION } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import MultiSelectCard from '../../components/onboarding/MultiSelectCard';
import OptionCard from '../../components/onboarding/OptionCard';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function GoalsStep({ onNext, onBack }) {
  const { goals, updateGoals } = useOnboardingStore();
  const [error, setError] = useState('');

  const selectedGoals = goals.selectedGoals || [];
  const primaryGoal = goals.primaryGoal || '';
  const sixMonthVision = goals.sixMonthVision || '';

  const handleToggleGoal = (id) => {
    setError('');
    let newGoals;
    if (selectedGoals.includes(id)) {
      newGoals = selectedGoals.filter((item) => item !== id);
      // If primary goal was deselected, clear it
      if (primaryGoal === id) {
        updateGoals({ selectedGoals: newGoals, primaryGoal: '' });
        return;
      }
    } else {
      newGoals = [...selectedGoals, id];
    }
    updateGoals({ selectedGoals: newGoals });
  };

  const handleSelectPrimary = (id) => {
    setError('');
    updateGoals({ primaryGoal: id });
  };

  const handleNext = () => {
    if (selectedGoals.length === 0) {
      setError('Please select at least one goal.');
      return;
    }
    if (!primaryGoal) {
      setError('Please select your primary focus goal.');
      return;
    }
    setError('');
    onNext();
  };

  // Resolve labels for the chosen goals list
  const primaryOptions = GOALS_QUESTION.options.filter((opt) =>
    selectedGoals.includes(opt.id)
  );

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* 1. Goals Selection */}
      <QuestionCard
        title={GOALS_QUESTION.question}
        subtitle="Select the balance targets you wish to pursue with TRIVARNA."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GOALS_QUESTION.options.map((opt) => (
            <MultiSelectCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              isSelected={selectedGoals.includes(opt.id)}
              onToggle={handleToggleGoal}
              icon={opt.icon}
            />
          ))}
        </div>
      </QuestionCard>

      {/* 2. Primary Goal Selection */}
      {selectedGoals.length > 0 && (
        <div className="border-t border-gray-100 pt-6 mt-6 animate-fadeIn">
          <QuestionCard
            title="Which goal is your highest priority right now?"
            subtitle="This will act as your anchor metric for daily schedule optimization."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {primaryOptions.map((opt) => (
                <OptionCard
                  key={opt.id}
                  id={opt.id}
                  label={opt.label}
                  isSelected={primaryGoal === opt.id}
                  onSelect={handleSelectPrimary}
                />
              ))}
            </div>
          </QuestionCard>
        </div>
      )}

      {/* 3. Six-month vision */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <QuestionCard
          title="Where do you want to be in 6 months?"
          subtitle="Describe your ideal state of mind, body, and balance. (Optional)"
          error={error}
        >
          <textarea
            value={sixMonthVision}
            onChange={(e) => updateGoals({ sixMonthVision: e.target.value })}
            placeholder="E.g., I want to wake up feeling energized, write my code without afternoon exhaustion, and maintain an uninterrupted exercise routine..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:border-primary-purple focus:ring-1 focus:ring-primary-purple outline-none resize-none transition-all duration-200 text-text-primary text-sm leading-relaxed"
          />
        </QuestionCard>
      </div>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        isNextDisabled={selectedGoals.length === 0 || !primaryGoal}
      />
    </div>
  );
}
