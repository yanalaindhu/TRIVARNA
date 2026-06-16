import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { LIFE_CONTEXT_QUESTIONS } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import OptionCard from '../../components/onboarding/OptionCard';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function LifeContextStep({ onNext, onBack }) {
  const { lifeContext, updateLifeContext } = useOnboardingStore();
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!lifeContext.role || !lifeContext.age || !lifeContext.routine) {
      setError('Please fill in all sections to proceed.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* 1. Role Selection */}
      <QuestionCard
        title={LIFE_CONTEXT_QUESTIONS.role.question}
        subtitle="This helps us adjust our insights to match your professional or academic pace."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LIFE_CONTEXT_QUESTIONS.role.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              desc={opt.desc}
              isSelected={lifeContext.role === opt.id}
              onSelect={(id) => {
                setError('');
                updateLifeContext({ role: id });
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <div className="border-t border-gray-100 my-6" />

      {/* 2. Age Selection */}
      <QuestionCard
        title={LIFE_CONTEXT_QUESTIONS.ageGroup.question}
        subtitle="Age factors into default recovery speed and sleep metrics."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LIFE_CONTEXT_QUESTIONS.ageGroup.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              isSelected={lifeContext.age === opt.id}
              onSelect={(id) => {
                setError('');
                updateLifeContext({ age: id });
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <div className="border-t border-gray-100 my-6" />

      {/* 3. Daily Routine Selection */}
      <QuestionCard
        title={LIFE_CONTEXT_QUESTIONS.dailyRoutine.question}
        subtitle="This outlines your baseline physical posture and screen exposure."
        error={error}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LIFE_CONTEXT_QUESTIONS.dailyRoutine.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              desc={opt.desc}
              isSelected={lifeContext.routine === opt.id}
              onSelect={(id) => {
                setError('');
                updateLifeContext({ routine: id });
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        isNextDisabled={!lifeContext.role || !lifeContext.age || !lifeContext.routine}
      />
    </div>
  );
}
