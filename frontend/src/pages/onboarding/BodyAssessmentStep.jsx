import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { BODY_QUESTIONS } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import OptionCard from '../../components/onboarding/OptionCard';
import RatingScale from '../../components/onboarding/RatingScale';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function BodyAssessmentStep({ onNext, onBack }) {
  const { bodyData, updateBodyData } = useOnboardingStore();
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!bodyData.sleep || !bodyData.activity || !bodyData.energeticTime) {
      setError('Please fill out all physiological questions.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* 1. Sleep Duration */}
      <QuestionCard
        title={BODY_QUESTIONS.sleep.question}
        subtitle="Consistent rest duration directly modulates cognitive focus and executive control."
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          {BODY_QUESTIONS.sleep.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              isSelected={bodyData.sleep === opt.id}
              onSelect={(id) => {
                setError('');
                updateBodyData({ sleep: id });
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <div className="border-t border-gray-100 my-6" />

      {/* 2. Activity Level */}
      <QuestionCard
        title={BODY_QUESTIONS.activity.question}
        subtitle="Physical exertion tiers affect heart rate variability and daily metabolism."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BODY_QUESTIONS.activity.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              desc={opt.desc}
              isSelected={bodyData.activity === opt.id}
              onSelect={(id) => {
                setError('');
                updateBodyData({ activity: id });
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <div className="border-t border-gray-100 my-6" />

      {/* 3. Most Energetic Time */}
      <QuestionCard
        title={BODY_QUESTIONS.energeticTime.question}
        subtitle="Understanding your natural circadian rhythms lets us align intense workflows."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BODY_QUESTIONS.energeticTime.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              desc={opt.desc}
              isSelected={bodyData.energeticTime === opt.id}
              onSelect={(id) => {
                setError('');
                updateBodyData({ energeticTime: id });
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <div className="border-t border-gray-100 my-6" />

      {/* 4. Hydration Slider */}
      <QuestionCard
        title="Daily Hydration Intake"
        subtitle="Water consumption maintains tissue recovery and prevents cognitive speed drops."
        error={error}
      >
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <RatingScale
            type="slider"
            value={bodyData.hydration || 5}
            min={BODY_QUESTIONS.hydration.min}
            max={BODY_QUESTIONS.hydration.max}
            onChange={(val) => updateBodyData({ hydration: val })}
            label="How many glasses of water do you drink daily?"
          />
        </div>
      </QuestionCard>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        isNextDisabled={!bodyData.sleep || !bodyData.activity || !bodyData.energeticTime}
      />
    </div>
  );
}
