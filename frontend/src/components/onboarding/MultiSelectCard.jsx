import React from 'react';
import * as Icons from 'lucide-react';

export default function MultiSelectCard({ id, label, desc, isSelected, onToggle, icon }) {
  // Dynamically resolve icon from Lucide if provided
  const IconComponent = icon ? Icons[icon] : null;

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ease-in-out flex items-center justify-between ${
        isSelected
          ? 'border-primary-purple bg-light-purple/40 ring-1 ring-primary-purple shadow-sm'
          : 'border-gray-200 hover:border-secondary-purple hover:bg-gray-50 bg-white'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0 mr-4">
        {IconComponent && (
          <div
            className={`p-2 rounded-lg transition-colors duration-150 ${
              isSelected ? 'bg-primary-purple text-white' : 'bg-gray-100 text-text-secondary'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-base truncate transition-colors duration-150 ${isSelected ? 'text-primary-purple' : 'text-text-primary'}`}>
            {label}
          </h4>
          {desc && (
            <p className={`text-sm mt-0.5 truncate transition-colors duration-150 ${isSelected ? 'text-primary-purple/80' : 'text-text-secondary'}`}>
              {desc}
            </p>
          )}
        </div>
      </div>
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-150 flex-shrink-0 ${
          isSelected
            ? 'border-primary-purple bg-primary-purple text-white scale-105'
            : 'border-gray-300 bg-white'
        }`}
      >
        {isSelected && <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </button>
  );
}
