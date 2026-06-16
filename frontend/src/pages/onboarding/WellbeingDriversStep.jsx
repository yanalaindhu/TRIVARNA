import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { WELLBEING_DRIVERS_QUESTION } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import MultiSelectCard from '../../components/onboarding/MultiSelectCard';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function WellbeingDriversStep({ onNext, onBack }) {
  const { wellbeingDrivers, updateWellbeingDrivers } = useOnboardingStore();
  const [error, setError] = useState('');

  const handleToggle = (id) => {
    setError('');
    let newDrivers;
    if (wellbeingDrivers.includes(id)) {
      newDrivers = wellbeingDrivers.filter(item => item !== id);
    } else {
      newDrivers = [...wellbeingDrivers, id];
    }
    updateWellbeingDrivers(newDrivers);
  };

  const handleNext = () => {
    if (wellbeingDrivers.length === 0) {
      setError('Please select at least one driver to proceed.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <QuestionCard
        title={WELLBEING_DRIVERS_QUESTION.question}
        subtitle="Identifying core stressors or pillars allows us to focus our balancing strategies."
        error={error}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WELLBEING_DRIVERS_QUESTION.options.map((opt) => (
            <MultiSelectCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              desc={opt.desc}
              isSelected={wellbeingDrivers.includes(opt.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </QuestionCard>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        isNextDisabled={wellbeingDrivers.length === 0}
      />
    </div>
  );
}
