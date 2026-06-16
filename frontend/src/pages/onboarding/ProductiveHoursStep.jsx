import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { PRODUCTIVE_HOURS_QUESTION } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import OptionCard from '../../components/onboarding/OptionCard';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function ProductiveHoursStep({ onNext, onBack }) {
  const { productiveWindow, updateProductiveWindow } = useOnboardingStore();
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!productiveWindow) {
      setError('Please select your peak focus window.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <QuestionCard
        title={PRODUCTIVE_HOURS_QUESTION.question}
        subtitle="We will coordinate your highest concentration tasks during this window."
        error={error}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRODUCTIVE_HOURS_QUESTION.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              desc={opt.desc}
              isSelected={productiveWindow === opt.id}
              onSelect={(id) => {
                setError('');
                updateProductiveWindow(id);
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        isNextDisabled={!productiveWindow}
      />
    </div>
  );
}
