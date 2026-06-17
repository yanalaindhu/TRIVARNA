import React from 'react';
import { LIKERT_SCALE_OPTIONS } from '../../utils/onboardingQuestions';

export default function RatingScale({ type = 'likert', value, onChange, min = 1, max = 10, label = '' }) {
  if (type === 'slider') {
    return (
      <div className="w-full py-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-text-secondary">{label}</span>
          <span className="text-2xl font-extrabold text-primary-purple bg-light-purple px-4 py-1.5 rounded-xl border border-primary-purple/10">
            {value} <span className="text-xs font-semibold text-text-secondary">glasses</span>
          </span>
        </div>
        <div className="relative mt-2">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-purple focus:outline-none"
          />
          <div className="flex justify-between text-xs text-text-secondary font-medium px-1 mt-2">
            <span>{min} Glass</span>
            <span>5 Glasses (Baseline)</span>
            <span>{max} Glasses+</span>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render Likert buttons
  return (
    <div className="w-full grid grid-cols-5 gap-2 sm:gap-3">
      {LIKERT_SCALE_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
              isSelected
                ? 'bg-light-purple/60 border-primary-purple text-primary-purple ring-1 ring-primary-purple font-semibold shadow-sm scale-[1.03]'
                : 'bg-white border-gray-200 hover:border-secondary-purple hover:bg-gray-50 text-text-secondary'
            }`}
          >
            <span className={`text-base md:text-lg mb-1 font-bold ${isSelected ? 'text-primary-purple' : 'text-gray-400'}`}>
              {opt.value}
            </span>
            <span className="text-[10px] sm:text-xs md:text-sm text-center font-medium leading-tight">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
