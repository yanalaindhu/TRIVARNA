import React from 'react';
import { Check } from 'lucide-react';

export default function OptionCard({ id, label, desc, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ease-in-out flex justify-between items-start ${
        isSelected
          ? 'border-primary-purple bg-light-purple/40 ring-1 ring-primary-purple shadow-sm'
          : 'border-gray-200 hover:border-secondary-purple hover:bg-gray-50 bg-white'
      }`}
    >
      <div className="flex-1 mr-4">
        <h4 className={`font-semibold text-base transition-colors duration-150 ${isSelected ? 'text-primary-purple' : 'text-text-primary'}`}>
          {label}
        </h4>
        {desc && (
          <p className={`text-sm mt-1 leading-snug transition-colors duration-150 ${isSelected ? 'text-primary-purple/80' : 'text-text-secondary'}`}>
            {desc}
          </p>
        )}
      </div>
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-150 mt-0.5 ${
          isSelected
            ? 'border-primary-purple bg-primary-purple text-white scale-110'
            : 'border-gray-300 bg-white'
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </button>
  );
}
