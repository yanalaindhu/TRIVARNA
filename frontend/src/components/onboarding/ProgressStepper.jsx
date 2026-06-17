import React from 'react';

export default function ProgressStepper({ currentStep, totalSteps = 13 }) {
  // Calculate percentage progress. Clamp to 0 - 100
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-primary-purple">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-text-secondary">
          {percentage}% Complete
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-purple rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
